import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminInviteRequest {
  email: string;
  adminLevel?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, adminLevel = "full" }: AdminInviteRequest = await req.json();

    console.log(`Sending admin invite to: ${email} with ${adminLevel} access`);

    const emailResponse = await resend.emails.send({
      from: "Team Management <noreply@wheewls.com>",
      to: [email],
      subject: "🚀 Admin Access Granted - Unlimited Team Management",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Admin Access Granted</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">🎉 Welcome to Full Admin Access!</h1>
            <p style="font-size: 18px; color: #666;">You've been granted unlimited team management capabilities</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
            <h2 style="margin-top: 0; color: white;">🔑 Admin Privileges Activated</h2>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 10px;">✅ Create unlimited teams</li>
              <li style="margin-bottom: 10px;">✅ Add unlimited team members</li>
              <li style="margin-bottom: 10px;">✅ Full project management access</li>
              <li style="margin-bottom: 10px;">✅ Advanced reporting & analytics</li>
              <li style="margin-bottom: 10px;">✅ Priority support</li>
            </ul>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 25px;">
            <h3 style="color: #065f46; margin-top: 0;">🚀 Getting Started</h3>
            <ol style="color: #374151;">
              <li style="margin-bottom: 8px;">Access the platform with your existing credentials</li>
              <li style="margin-bottom: 8px;">Navigate to Team Settings to create your organization</li>
              <li style="margin-bottom: 8px;">Invite team members without any limits</li>
              <li style="margin-bottom: 8px;">Set up projects and manage workflows</li>
            </ol>
          </div>

          <div style="background: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
            <h3 style="color: #92400e; margin-top: 0;">💡 Pro Tips</h3>
            <ul style="color: #374151;">
              <li style="margin-bottom: 8px;">Use team templates to quickly set up new projects</li>
              <li style="margin-bottom: 8px;">Enable notifications to stay updated on team activities</li>
              <li style="margin-bottom: 8px;">Utilize the analytics dashboard for insights</li>
              <li style="margin-bottom: 8px;">Set up automated workflows for efficiency</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
              Need help getting started? Our support team is here to assist you.
            </p>
            <p style="font-size: 14px; color: #999;">
              This admin access is complimentary and includes all premium features.<br>
              Enjoy building amazing teams! 🎯
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #6b7280;">
              Team Management Platform<br>
              Premium Admin Access
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin invite email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin invite sent successfully",
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
    console.error("Error in send-admin-invite function:", error);
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