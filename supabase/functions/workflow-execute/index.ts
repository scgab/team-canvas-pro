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

interface WorkflowAction {
  type: string;
  config: any;
}

interface WorkflowExecution {
  workflowId: string;
  workflowName: string;
  actions: WorkflowAction[];
  context: any; // Data from the trigger (e.g., meeting data)
  teamId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const execution: WorkflowExecution = await req.json();
    
    console.log('Starting workflow execution:', {
      workflowId: execution.workflowId,
      workflowName: execution.workflowName,
      actionsCount: execution.actions.length,
      teamId: execution.teamId
    });

    const results = [];
    let context = { ...execution.context }; // Copy initial context

    // Execute actions sequentially
    for (let i = 0; i < execution.actions.length; i++) {
      const action = execution.actions[i];
      console.log(`Executing action ${i + 1}/${execution.actions.length}:`, action.type);

      try {
        const result = await executeAction(action, context, execution.teamId);
        results.push({
          actionType: action.type,
          success: true,
          result: result,
          executedAt: new Date().toISOString()
        });

        // Update context with action results for subsequent actions
        context = { ...context, ...result };
        
        console.log(`Action ${action.type} completed successfully`);
      } catch (error) {
        console.error(`Action ${action.type} failed:`, error);
        results.push({
          actionType: action.type,
          success: false,
          error: error.message,
          executedAt: new Date().toISOString()
        });
        
        // For now, we'll continue with other actions even if one fails
        // In production, you might want to add failure handling strategies
      }
    }

    // Log workflow execution results
    await logWorkflowExecution(execution.workflowId, execution.workflowName, results, execution.teamId);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`Workflow execution completed: ${successCount} successful, ${failureCount} failed`);

    return new Response(JSON.stringify({
      success: true,
      workflowId: execution.workflowId,
      workflowName: execution.workflowName,
      results: results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in workflow-execute function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Workflow execution failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function executeAction(action: WorkflowAction, context: any, teamId: string): Promise<any> {
  switch (action.type) {
    case 'generate_summary':
      return await executeGenerateSummary(action, context, teamId);
    case 'send_email':
      return await executeSendEmail(action, context, teamId);
    case 'create_task':
      return await executeCreateTask(action, context, teamId);
    case 'send_notification':
      return await executeSendNotification(action, context, teamId);
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

async function executeGenerateSummary(action: WorkflowAction, context: any, teamId: string): Promise<any> {
  console.log('Executing generate_summary action');
  
  // Prepare meeting data for summary generation
  const meetingData = {
    title: context.title || 'Untitled Meeting',
    date: context.date || 'Not specified',
    attendees: Array.isArray(context.attendees) ? context.attendees.join(', ') : (context.attendees || 'Not specified'),
    notes: context.meeting_notes || context.notes || 'No notes provided',
    actionItems: Array.isArray(context.action_items) ? context.action_items.join(', ') : (context.action_items || 'No action items'),
    duration: context.duration || 'Not specified'
  };

  const { data, error } = await supabase.functions.invoke('generate-meeting-summary', {
    body: { meetingData }
  });

  if (error) {
    throw new Error(`Summary generation failed: ${error.message}`);
  }

  const summary = data?.summary;
  if (!summary) {
    throw new Error('No summary returned from generation service');
  }

  // Update the meeting record with the summary if it's a calendar event
  if (context.id && context.isCalendarEvent !== false) {
    try {
      const { error: updateError } = await supabase
        .from('calendar_events')
        .update({ meeting_summary: summary })
        .eq('id', context.id);
        
      if (updateError) {
        console.error('Failed to update meeting with summary:', updateError);
        // Don't fail the action for this, just log it
      }
    } catch (updateError) {
      console.error('Error updating meeting record:', updateError);
    }
  }

  return {
    summary: summary,
    summaryGenerated: true,
    summaryLength: summary.length
  };
}

async function executeSendEmail(action: WorkflowAction, context: any, teamId: string): Promise<any> {
  console.log('Executing send_email action');
  
  const config = action.config || {};
  let recipients = [];

  // Determine recipients
  if (config.recipients === 'attendees' && context.attendees) {
    recipients = Array.isArray(context.attendees) ? context.attendees : [context.attendees];
  } else if (config.recipients === 'team') {
    // Get all team members
    const { data: teamMembers, error } = await supabase
      .from('team_members')
      .select('email')
      .eq('team_id', teamId)
      .eq('status', 'active');
    
    if (!error && teamMembers) {
      recipients = teamMembers.map(member => member.email);
    }
  } else if (config.customRecipients) {
    recipients = Array.isArray(config.customRecipients) ? config.customRecipients : [config.customRecipients];
  }

  if (recipients.length === 0) {
    throw new Error('No recipients specified for email action');
  }

  // Prepare email content
  const subject = config.subject || `Meeting Summary: ${context.title || 'Untitled Meeting'}`;
  const summary = context.summary || 'Summary not available';
  
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
        Meeting Summary
      </h2>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #495057; margin-top: 0;">Meeting Details</h3>
        <p><strong>Meeting:</strong> ${context.title || 'Untitled Meeting'}</p>
        <p><strong>Date:</strong> ${context.date || 'Not specified'}</p>
        ${context.time ? `<p><strong>Time:</strong> ${context.time}</p>` : ''}
        ${context.location ? `<p><strong>Location:</strong> ${context.location}</p>` : ''}
        ${context.attendees ? `<p><strong>Attendees:</strong> ${Array.isArray(context.attendees) ? context.attendees.join(', ') : context.attendees}</p>` : ''}
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #495057;">AI-Generated Summary</h3>
        <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #007bff; border-radius: 0 5px 5px 0;">
          ${summary.replace(/\n/g, '<br>')}
        </div>
      </div>
      
      ${context.action_items && context.action_items.length > 0 ? `
        <div style="margin: 20px 0;">
          <h3 style="color: #495057;">Action Items</h3>
          <ul style="background-color: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
            ${context.action_items.map((item: string) => `<li style="margin: 5px 0;">${item}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px; text-align: center;">
        <p style="margin: 0; color: #6c757d; font-size: 14px;">
          This summary was automatically generated by the workflow automation system.
        </p>
      </div>
    </div>
  `;

  // Send emails to all recipients
  const emailResults = [];
  for (const recipient of recipients) {
    try {
      console.log(`Sending email to: ${recipient}`);
      
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-announcement', {
        body: {
          recipientEmail: recipient,
          subject: subject,
          content: emailContent,
          teamId: teamId
        }
      });

      if (emailError) {
        console.error(`Failed to send email to ${recipient}:`, emailError);
        emailResults.push({ recipient, success: false, error: emailError.message });
      } else {
        console.log(`Email sent successfully to ${recipient}`);
        emailResults.push({ recipient, success: true });
      }
    } catch (error) {
      console.error(`Error sending email to ${recipient}:`, error);
      emailResults.push({ recipient, success: false, error: error.message });
    }
  }

  const successfulEmails = emailResults.filter(r => r.success).length;
  const failedEmails = emailResults.filter(r => !r.success).length;

  if (successfulEmails === 0) {
    throw new Error(`Failed to send emails to all ${recipients.length} recipients`);
  }

  return {
    emailsSent: successfulEmails,
    emailsFailed: failedEmails,
    totalRecipients: recipients.length,
    recipients: emailResults
  };
}

async function executeCreateTask(action: WorkflowAction, context: any, teamId: string): Promise<any> {
  console.log('Executing create_task action');
  
  const config = action.config || {};
  const taskData = {
    title: config.title || `Follow-up: ${context.title || 'Meeting'}`,
    description: config.description || `Task created from meeting: ${context.title}`,
    priority: config.priority || 'medium',
    status: 'todo',
    team_id: teamId,
    created_by: context.created_by || 'workflow-system',
    assignee: config.assignee || null,
    due_date: config.due_date || null
  };

  const { data, error } = await supabase
    .from('tasks')
    .insert([taskData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }

  return {
    taskCreated: true,
    taskId: data.id,
    taskTitle: data.title
  };
}

async function executeSendNotification(action: WorkflowAction, context: any, teamId: string): Promise<any> {
  console.log('Executing send_notification action');
  
  const config = action.config || {};
  const message = config.message || `Workflow completed for: ${context.title}`;
  
  // For now, we'll log the notification
  // In a real implementation, you might send to a notification service
  console.log('Notification:', message);
  
  return {
    notificationSent: true,
    message: message
  };
}

async function logWorkflowExecution(workflowId: string, workflowName: string, results: any[], teamId: string) {
  try {
    console.log('Logging workflow execution:', {
      workflowId,
      workflowName,
      resultsCount: results.length,
      teamId
    });

    // In a real implementation, you might want to store this in a workflows_executions table
    // For now, we'll just log it
    const executionLog = {
      workflowId,
      workflowName,
      executedAt: new Date().toISOString(),
      teamId,
      results,
      summary: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    };

    console.log('Workflow execution logged:', executionLog);
  } catch (error) {
    console.error('Error logging workflow execution:', error);
  }
}