import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AnnouncementRequest {
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  author: string;
  authorEmail: string;
  recipients: 'all' | 'team' | 'managers';
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const getTypeEmoji = (type: string) => {
  switch (type) {
    case 'info': return 'ℹ️';
    case 'warning': return '⚠️';
    case 'success': return '✅';
    case 'urgent': return '🚨';
    default: return 'ℹ️';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'info': return '#3b82f6';
    case 'warning': return '#f59e0b';
    case 'success': return '#10b981';
    case 'urgent': return '#ef4444';
    default: return '#3b82f6';
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, type, author, authorEmail, recipients }: AnnouncementRequest = await req.json();

    console.log(`Sending announcement "${title}" from ${author} to ${recipients}`);

    // Get team members based on recipients filter
    let recipientEmails: string[] = [];
    
    if (recipients === 'all') {
      const { data: allMembers } = await supabase
        .from('team_members')
        .select('email')
        .eq('status', 'active');
      recipientEmails = allMembers?.map(member => member.email) || [];
    } else if (recipients === 'managers') {
      const { data: managers } = await supabase
        .from('team_members')
        .select('email')
        .eq('status', 'active')
        .eq('role', 'admin');
      recipientEmails = managers?.map(member => member.email) || [];
    } else {
      // For 'team', get all non-admin members
      const { data: teamMembers } = await supabase
        .from('team_members')
        .select('email')
        .eq('status', 'active')
        .eq('role', 'member');
      recipientEmails = teamMembers?.map(member => member.email) || [];
    }

    if (recipientEmails.length === 0) {
      console.log('No recipients found for announcement');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No recipients found",
          emailsSent: 0
        }), 
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const typeEmoji = getTypeEmoji(type);
    const typeColor = getTypeColor(type);
    
    const emailResponse = await resend.emails.send({
      from: "Team Announcements <noreply@wheewls.com>",
      to: recipientEmails,
      subject: `${typeEmoji} Team Announcement: ${title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Team Announcement</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: ${typeColor}; margin-bottom: 10px;">${typeEmoji} Team Announcement</h1>
            <p style="font-size: 18px; color: #666;">From ${author}</p>
          </div>
          
          <div style="background: linear-gradient(135deg, ${typeColor} 0%, ${typeColor}dd 100%); color: white; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <h2 style="margin-top: 0; color: white; font-size: 24px;">${title}</h2>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid ${typeColor}; margin-bottom: 25px;">
            <div style="color: #374151; white-space: pre-wrap; font-size: 16px; line-height: 1.6;">
${content}
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 14px; color: #6b7280;">
              Sent by ${author} (${authorEmail})<br>
              ${new Date().toLocaleString()}
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <p style="font-size: 12px; color: #6b7280;">
              Team Management Platform<br>
              Wheewls Team Communication
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Announcement email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Announcement emails sent successfully",
        emailId: emailResponse.data?.id,
        emailsSent: recipientEmails.length,
        recipients: recipientEmails
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-announcement function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);