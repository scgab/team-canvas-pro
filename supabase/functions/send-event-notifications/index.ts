import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EventNotificationRequest {
  eventId: string;
  eventTitle: string;
  eventDescription?: string;
  eventDate: string;
  eventTime?: string;
  endTime?: string;
  location?: string;
  attendees: string[];
  agenda?: string[];
  type: 'meeting' | 'event';
  senderEmail: string;
  senderName?: string;
}

const formatEventTime = (time?: string, endTime?: string) => {
  if (!time) return "All day";
  if (endTime) {
    return `${time} - ${endTime}`;
  }
  return time;
};

const formatEventDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    return dateStr;
  }
};

const generateEmailContent = (event: EventNotificationRequest) => {
  const eventType = event.type === 'meeting' ? 'Meeting' : 'Event';
  const timeDisplay = formatEventTime(event.eventTime, event.endTime);
  const dateDisplay = formatEventDate(event.eventDate);
  
  let agendaHtml = '';
  if (event.agenda && event.agenda.length > 0) {
    agendaHtml = `
      <div style="margin: 20px 0;">
        <h3 style="color: #374151; margin: 10px 0;">Agenda:</h3>
        <ul style="margin: 0; padding-left: 20px;">
          ${event.agenda.map(item => `<li style="margin: 5px 0;">${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  let locationHtml = '';
  if (event.location) {
    locationHtml = `
      <div style="margin: 10px 0; padding: 10px; background-color: #f3f4f6; border-radius: 6px;">
        <strong>📍 Location:</strong> ${event.location}
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${eventType} Reminder</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">📅 ${eventType} Reminder</h1>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            ${event.eventTitle}
          </h2>
          
          ${event.eventDescription ? `
            <div style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-left: 4px solid #3b82f6; border-radius: 6px;">
              <p style="margin: 0; color: #4b5563;">${event.eventDescription}</p>
            </div>
          ` : ''}
          
          <div style="margin: 25px 0;">
            <div style="display: inline-block; margin: 10px 15px 10px 0; padding: 10px 15px; background-color: #dbeafe; border-radius: 8px;">
              <strong>🗓️ Date:</strong> ${dateDisplay}
            </div>
            <div style="display: inline-block; margin: 10px 0; padding: 10px 15px; background-color: #dcfce7; border-radius: 8px;">
              <strong>⏰ Time:</strong> ${timeDisplay}
            </div>
          </div>
          
          ${locationHtml}
          ${agendaHtml}
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; color: #0c4a6e;">
              💡 This is a reminder for the upcoming ${event.type}. Please make sure to attend on time.
            </p>
          </div>
          
          <div style="margin: 25px 0; text-align: center;">
            <div style="display: inline-block; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Sent by: <strong>${event.senderName || event.senderEmail}</strong>
              </p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
          <p>This notification was sent automatically by your team calendar system.</p>
        </div>
      </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const eventData: EventNotificationRequest = await req.json();
    
    console.log("Sending event notifications:", eventData);

    if (!eventData.attendees || eventData.attendees.length === 0) {
      return new Response(
        JSON.stringify({ error: "No attendees specified" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailPromises = eventData.attendees.map(async (attendeeEmail) => {
      const emailContent = generateEmailContent(eventData);
      
      return resend.emails.send({
        from: "Team Calendar <onboarding@resend.dev>",
        to: [attendeeEmail],
        subject: `📅 ${eventData.type === 'meeting' ? 'Meeting' : 'Event'} Reminder: ${eventData.eventTitle}`,
        html: emailContent,
      });
    });

    const results = await Promise.allSettled(emailPromises);
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`Email notifications sent: ${successful} successful, ${failed} failed`);

    // Log any failures
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Failed to send email to ${eventData.attendees[index]}:`, result.reason);
      }
    });

    return new Response(
      JSON.stringify({ 
        message: `Notifications sent to ${successful} attendees`, 
        successful,
        failed 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: any) {
    console.error("Error in send-event-notifications function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);