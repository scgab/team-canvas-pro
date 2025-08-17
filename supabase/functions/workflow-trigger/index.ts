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
  
  // Get active workflows with meeting completion triggers
  const activeWorkflows = getActiveWorkflowsForTrigger('meeting_completed', teamId);
  
  for (const workflow of activeWorkflows) {
    console.log('Processing workflow:', workflow.name);
    
    // Check if workflow conditions are met
    if (evaluateWorkflowConditions(workflow, meetingRecord)) {
      console.log('Workflow conditions met, executing workflow via workflow-execute service');
      await executeWorkflow(workflow, meetingRecord, teamId);
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

async function executeWorkflow(workflow: any, meetingRecord: any, teamId: string) {
  try {
    console.log('Executing workflow via workflow-execute service:', workflow.name);
    
    // Prepare workflow execution payload
    const executionPayload = {
      workflowId: workflow.id.toString(),
      workflowName: workflow.name,
      actions: workflow.actions.map((action: any) => ({
        type: action.type,
        config: action.config || {}
      })),
      context: {
        ...meetingRecord,
        isCalendarEvent: true // Flag to indicate this came from calendar events
      },
      teamId: teamId
    };

    // Call the workflow execution service
    const { data, error } = await supabase.functions.invoke('workflow-execute', {
      body: executionPayload
    });

    if (error) {
      console.error('Workflow execution service error:', error);
      throw error;
    }

    console.log('Workflow executed successfully:', data);
    return data;
  } catch (error) {
    console.error('Error executing workflow:', error);
    throw error;
  }
}

// Remove the old action execution functions since we now use workflow-execute service
// This keeps the trigger function focused on just triggering workflows