import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TeamInviteRequest {
  email: string;
  teamName: string;
  inviterName: string;
  invitationToken?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, teamName, inviterName, invitationToken }: TeamInviteRequest = await req.json();

    console.log(`Sending team invitation to: ${email} for team: ${teamName}`);

    const emailResponse = await resend.emails.send({
      from: "Team Management <noreply@wheewls.com>",
      to: [email],
      subject: `🎉 You're invited to join ${teamName}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Team Invitation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">🎉 You're Invited!</h1>
            <p style="font-size: 18px; color: #666;">Join ${teamName} and start collaborating</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <h2 style="margin-top: 0; color: white;">Welcome to ${teamName}</h2>
            <p style="margin-bottom: 15px;">Hi there!</p>
            <p style="margin-bottom: 15px;">
              <strong>${inviterName}</strong> has invited you to join <strong>${teamName}</strong> 
              on our team management platform.
            </p>
            <p style="margin-bottom: 0;">
              You'll have access to projects, team messaging, shift planning, and much more!
            </p>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 25px;">
            <h3 style="color: #065f46; margin-top: 0;">🚀 What's included:</h3>
            <ul style="color: #374151; margin-bottom: 0;">
              <li style="margin-bottom: 8px;">📋 Project management and task tracking</li>
              <li style="margin-bottom: 8px;">💬 Team messaging and collaboration</li>
              <li style="margin-bottom: 8px;">📅 Shift planning and scheduling</li>
              <li style="margin-bottom: 8px;">📊 Analytics and reporting</li>
              <li style="margin-bottom: 8px;">📁 File sharing and storage</li>
            </ul>
          </div>

          <div style="text-align: center; margin-bottom: 25px;">
            <a href="#" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Accept Invitation & Join Team
            </a>
          </div>

          <div style="background: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
            <h3 style="color: #92400e; margin-top: 0;">📝 Getting Started</h3>
            <ol style="color: #374151; margin-bottom: 0;">
              <li style="margin-bottom: 8px;">Click the invitation link above</li>
              <li style="margin-bottom: 8px;">Create your account or sign in</li>
              <li style="margin-bottom: 8px;">Complete your profile setup</li>
              <li style="margin-bottom: 8px;">Start collaborating with your team!</li>
            </ol>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
              Need help? Contact your team admin or our support team.
            </p>
            <p style="font-size: 12px; color: #999;">
              This invitation was sent by ${inviterName} from ${teamName}.<br>
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              Team Management Platform<br>
              Professional Team Collaboration
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Team invitation email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Team invitation sent successfully",
        emailId: emailResponse.data?.id 
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
    console.error("Error in send-team-invite function:", error);
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