import { supabase } from "@/integrations/supabase/client";

export class WorkflowTriggerService {
  static async triggerWorkflow(eventType: string, record: any, teamId: string) {
    try {
      console.log('Triggering workflow:', { eventType, recordId: record?.id, teamId });
      
      const { data, error } = await supabase.functions.invoke('workflow-trigger', {
        body: {
          eventType,
          record,
          teamId
        }
      });

      if (error) {
        console.error('Workflow trigger error:', error);
        throw error;
      }

      console.log('Workflow triggered successfully:', data);
      return data;
    } catch (error) {
      console.error('Error triggering workflow:', error);
      throw error;
    }
  }

  static async triggerMeetingCompleted(meetingRecord: any, teamId: string) {
    return this.triggerWorkflow('meeting_completed', meetingRecord, teamId);
  }

  // Future trigger methods can be added here
  static async triggerTaskCompleted(taskRecord: any, teamId: string) {
    return this.triggerWorkflow('task_completed', taskRecord, teamId);
  }

  static async triggerProjectStatusChanged(projectRecord: any, teamId: string) {
    return this.triggerWorkflow('project_status_changed', projectRecord, teamId);
  }
}