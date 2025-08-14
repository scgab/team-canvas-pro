// Example utility for calling the Google Calendar API edge function directly with fetch

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus: string;
  }>;
}

export interface GoogleCalendarApiResponse {
  success: boolean;
  event?: GoogleCalendarEvent;
  error?: string;
  user_id?: string;
}

/**
 * Fetch a Google Calendar event using the Supabase Edge Function
 * @param eventId - The Google Calendar event ID
 * @param accessToken - The Supabase Auth JWT token
 * @returns Promise with the event data or error
 */
export async function fetchGoogleCalendarEvent(
  eventId: string, 
  accessToken: string
): Promise<GoogleCalendarApiResponse> {
  try {
    const response = await fetch(
      'https://susniyygjqxfvisjwpun.supabase.co/functions/v1/google-api',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1c25peXlnanF4ZnZpc2p3cHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTM4MjMsImV4cCI6MjA2ODE4OTgyM30.8aYwOnAtfSJhqrO08_KdlVFk0mfstxEGTg1w8q-oHJk',
        },
        body: JSON.stringify({
          action: 'getEvent',
          eventId: eventId
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: GoogleCalendarApiResponse = await response.json();
    return data;

  } catch (error) {
    console.error('Error calling Google Calendar API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Example usage in a React component:
 * 
 * import { fetchGoogleCalendarEvent } from '@/utils/googleCalendarApi';
 * import { supabase } from '@/integrations/supabase/client';
 * 
 * const MyComponent = () => {
 *   const handleFetchEvent = async (eventId: string) => {
 *     // Get current session
 *     const { data: { session } } = await supabase.auth.getSession();
 *     
 *     if (!session?.access_token) {
 *       console.error('User not authenticated');
 *       return;
 *     }
 * 
 *     // Call the API
 *     const result = await fetchGoogleCalendarEvent(eventId, session.access_token);
 *     
 *     if (result.success && result.event) {
 *       console.log('Event fetched:', result.event);
 *       // Handle success - display event data
 *     } else {
 *       console.error('Error:', result.error);
 *       // Handle error - show error message
 *     }
 *   };
 * 
 *   return (
 *     <button onClick={() => handleFetchEvent('your-event-id')}>
 *       Fetch Event
 *     </button>
 *   );
 * };
 */