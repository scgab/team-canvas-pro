import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { meetingData } = await req.json();
    
    console.log('Received meeting data:', meetingData);

    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not found');
    }

    // Prepare the meeting content for summarization
    const meetingContent = `
Meeting Details:
- Title: ${meetingData.title || 'Untitled Meeting'}
- Date: ${meetingData.date || 'Not specified'}
- Duration: ${meetingData.duration || 'Not specified'}
- Attendees: ${meetingData.attendees || 'Not specified'}
- Meeting Notes: ${meetingData.notes || 'No notes provided'}
- Action Items: ${meetingData.actionItems || 'No action items'}
    `;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Please create a professional meeting summary based on the following meeting information. Include key discussion points, decisions made, and action items. Format it as a clear, concise summary suitable for email distribution.

${meetingContent}`
          }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log('Anthropic response:', data);
    
    const summary = data.content[0].text;

    return new Response(JSON.stringify({ 
      summary,
      meetingData: meetingData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-meeting-summary function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate meeting summary'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});