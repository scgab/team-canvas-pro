import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the meeting ID from the URL
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Meeting ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Fetch meeting from calendar_events table
    const { data: meeting, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', id)
      .eq('type', 'meeting')
      .single()

    if (error || !meeting) {
      return new Response(
        JSON.stringify({ error: 'Meeting not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Return meeting details in the requested format
    return new Response(
      JSON.stringify({
        id: meeting.id,
        title: meeting.title,
        content: meeting.description || meeting.meeting_notes,
        date: meeting.date,
        time: meeting.time,
        location: meeting.location,
        teamId: meeting.team_id,
        organizer: meeting.created_by || 'Team'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error fetching meeting details:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})