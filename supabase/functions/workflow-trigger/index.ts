import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventType, record, teamId } = await req.json();
    
    console.log('Workflow trigger received:', { eventType, recordId: record?.id, teamId });

    // For now, we'll focus on meeting completion triggers
    if (eventType === 'meeting_completed' && record?.meeting_status === 'completed') {
      await handleMeetingCompletedTrigger(record, teamId);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in workflow-trigger function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleMeetingCompletedTrigger(meetingRecord: any, teamId: string) {
  console.log('Handling meeting completed trigger for meeting:', meetingRecord.id);
  
  // Check for active workflows with meeting completion triggers
  const activeWorkflows = getActiveWorkflowsForTrigger('meeting_completed', teamId);
  
  for (const workflow of activeWorkflows) {
    console.log('Processing workflow:', workflow.name);
    
    // Check if workflow conditions are met
    if (evaluateWorkflowConditions(workflow, meetingRecord)) {
      console.log('Workflow conditions met, executing actions');
      await executeWorkflowActions(workflow, meetingRecord, teamId);
    }
  }
}

function getActiveWorkflowsForTrigger(triggerType: string, teamId: string) {
  // Sample workflow that matches our "Meeting Summary & Email" workflow
  // In a real implementation, this would query a workflows table
  return [
    {
      id: 1,
      name: "Meeting Summary & Email",
      active: true,
      teamId: teamId,
      trigger: {
        type: "meeting_completed",
        conditions: {
          has_notes: true,
          has_attendees: true
        }
      },
      actions: [
        {
          type: "generate_summary",
          config: {}
        },
        {
          type: "send_email",
          config: {
            to: "attendees",
            subject: "Meeting Summary: {meeting_title}",
            template: "meeting_summary"
          }
        }
      ]
    }
  ];
}

function evaluateWorkflowConditions(workflow: any, meetingRecord: any): boolean {
  const conditions = workflow.trigger.conditions;
  
  // Check if meeting has notes (if required)
  if (conditions.has_notes && !meetingRecord.meeting_notes) {
    console.log('Workflow condition not met: missing meeting notes');
    return false;
  }
  
  // Check if meeting has attendees (if required)
  if (conditions.has_attendees && (!meetingRecord.attendees || meetingRecord.attendees.length === 0)) {
    console.log('Workflow condition not met: no attendees');
    return false;
  }
  
  console.log('All workflow conditions met');
  return true;
}

async function executeWorkflowActions(workflow: any, meetingRecord: any, teamId: string) {
  for (const action of workflow.actions) {
    try {
      console.log('Executing action:', action.type);
      
      switch (action.type) {
        case 'generate_summary':
          await executeGenerateSummaryAction(meetingRecord, teamId);
          break;
        case 'send_email':
          await executeSendEmailAction(action.config, meetingRecord, teamId);
          break;
        default:
          console.log('Unknown action type:', action.type);
      }
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error);
      // Continue with next action even if one fails
    }
  }
}

async function executeGenerateSummaryAction(meetingRecord: any, teamId: string) {
  console.log('Generating AI summary for meeting:', meetingRecord.id);
  
  try {
    // Call our generate-meeting-summary function
    const summaryResponse = await supabase.functions.invoke('generate-meeting-summary', {
      body: {
        meetingData: {
          title: meetingRecord.title,
          date: meetingRecord.date,
          attendees: meetingRecord.attendees?.join(', '),
          notes: meetingRecord.meeting_notes,
          actionItems: meetingRecord.action_items?.join(', ')
        }
      }
    });
    
    if (summaryResponse.error) {
      throw new Error(`Summary generation failed: ${summaryResponse.error.message}`);
    }
    
    const summary = summaryResponse.data?.summary;
    
    if (summary) {
      // Update the meeting record with the generated summary
      const { error } = await supabase
        .from('calendar_events')
        .update({ meeting_summary: summary })
        .eq('id', meetingRecord.id);
        
      if (error) {
        console.error('Error updating meeting with summary:', error);
      } else {
        console.log('Meeting summary updated successfully');
      }
    }
    
    return summary;
  } catch (error) {
    console.error('Error in generate summary action:', error);
    throw error;
  }
}

async function executeSendEmailAction(config: any, meetingRecord: any, teamId: string) {
  console.log('Sending email for meeting:', meetingRecord.id);
  
  try {
    // Get attendee emails
    const attendeeEmails = meetingRecord.attendees || [];
    
    if (attendeeEmails.length === 0) {
      console.log('No attendees to send email to');
      return;
    }
    
    // Prepare email subject
    const subject = config.subject.replace('{meeting_title}', meetingRecord.title || 'Untitled Meeting');
    
    // Get meeting summary (should be available from previous action)
    const { data: updatedMeeting } = await supabase
      .from('calendar_events')
      .select('meeting_summary')
      .eq('id', meetingRecord.id)
      .single();
    
    const summary = updatedMeeting?.meeting_summary || 'Summary not available';
    
    // Send email to each attendee
    for (const email of attendeeEmails) {
      console.log('Sending summary email to:', email);
      
      await supabase.functions.invoke('send-announcement', {
        body: {
          recipientEmail: email,
          subject: subject,
          content: `
            <h2>Meeting Summary</h2>
            <p><strong>Meeting:</strong> ${meetingRecord.title}</p>
            <p><strong>Date:</strong> ${meetingRecord.date}</p>
            <p><strong>Time:</strong> ${meetingRecord.time}</p>
            
            <h3>Summary</h3>
            ${summary}
            
            ${meetingRecord.action_items && meetingRecord.action_items.length > 0 ? `
              <h3>Action Items</h3>
              <ul>
                ${meetingRecord.action_items.map((item: string) => `<li>${item}</li>`).join('')}
              </ul>
            ` : ''}
            
            <p>This summary was automatically generated by our workflow system.</p>
          `,
          teamId: teamId
        }
      });
    }
    
    console.log(`Successfully sent summary emails to ${attendeeEmails.length} attendees`);
  } catch (error) {
    console.error('Error in send email action:', error);
    throw error;
  }
}