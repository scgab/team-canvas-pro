import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ShiftNotificationRequest {
  teamId: string;
  month: string;
  version: string;
  adminEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { teamId, month, version, adminEmail }: ShiftNotificationRequest = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get team information
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('team_name')
      .eq('id', teamId)
      .single();

    if (teamError) {
      console.error('Error fetching team:', teamError);
      throw new Error('Failed to fetch team information');
    }

    // Get team members
    const { data: teamMembers, error: membersError } = await supabase
      .from('team_members')
      .select('email, full_name')
      .eq('team_id', teamId)
      .eq('status', 'active');

    if (membersError) {
      console.error('Error fetching team members:', membersError);
      throw new Error('Failed to fetch team members');
    }

    // Get assigned shifts for the month
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;
    
    const { data: shifts, error: shiftsError } = await supabase
      .from('shifts')
      .select('*')
      .eq('team_id', teamId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (shiftsError) {
      console.error('Error fetching shifts:', shiftsError);
      throw new Error('Failed to fetch shifts');
    }

    // Get available shifts for the month
    const { data: availableShifts, error: availableError } = await supabase
      .from('available_shifts')
      .select('*')
      .eq('team_id', teamId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (availableError) {
      console.error('Error fetching available shifts:', availableError);
      throw new Error('Failed to fetch available shifts');
    }

    // Create HTML table for assigned shifts
    const shiftsTable = `
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Date</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Time</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Assigned To</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Type</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${shifts?.map(shift => `
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 12px;">${new Date(shift.date).toLocaleDateString()}</td>
              <td style="border: 1px solid #dee2e6; padding: 12px;">${shift.start_time} - ${shift.end_time}</td>
              <td style="border: 1px solid #dee2e6; padding: 12px;">${shift.assigned_to}</td>
              <td style="border: 1px solid #dee2e6; padding: 12px;">${shift.shift_type}</td>
              <td style="border: 1px solid #dee2e6; padding: 12px;">${shift.status}</td>
            </tr>
          `).join('') || '<tr><td colspan="5" style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">No assigned shifts for this month</td></tr>'}
        </tbody>
      </table>
    `;

    // Create HTML table for available shifts
    const availableShiftsTable = `
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #e3f2fd;">
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Date</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Time</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Type</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Competence Required</th>
            <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${availableShifts?.map(shift => `
            <tr>
              <td style="border: 1px solid #dee2e6; padding: 12px;">${new Date(shift.date).toLocaleDateString()}</td>
              <td style="border: 1px solid #dee2e6; padding: 12px;">${shift.start_time} - ${shift.end_time}</td>
              <td style="border: 1px solid #dee2e6; padding: 12px;">${shift.shift_type}</td>
              <td style="border: 1px solid #dee2e6; padding: 12px;">${shift.competence_required}</td>
              <td style="border: 1px solid #dee2e6; padding: 12px;">${shift.claimed_by ? `Claimed by ${shift.claimed_by}` : 'Available'}</td>
            </tr>
          `).join('') || '<tr><td colspan="5" style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">No available shifts for this month</td></tr>'}
        </tbody>
      </table>
    `;

    const monthName = new Date(`${month}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Send emails to all team members
    const emailPromises = teamMembers?.map(async (member) => {
      try {
        return await resend.emails.send({
          from: "Team Shift Manager <onboarding@resend.dev>",
          to: [member.email],
          subject: `${team.team_name} - Shift Schedule Update ${version} (${monthName})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
                ${team.team_name} - Shift Schedule ${version}
              </h1>
              
              <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
                Dear ${member.full_name || member.email},
              </p>
              
              <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
                Here's the updated shift schedule for <strong>${monthName}</strong> (${version}). 
                Please review your assignments and available shifts you can claim.
              </p>

              <h2 style="color: #333; margin-top: 30px; margin-bottom: 15px;">📅 Assigned Shifts</h2>
              ${shiftsTable}

              <h2 style="color: #333; margin-top: 30px; margin-bottom: 15px;">🔓 Available Shifts to Claim</h2>
              ${availableShiftsTable}

              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px;">
                <h3 style="color: #333; margin-top: 0;">Important Notes:</h3>
                <ul style="color: #666;">
                  <li>Please log into the team portal to claim any available shifts</li>
                  <li>Contact your team admin if you need to modify your assigned shifts</li>
                  <li>This is ${version} - previous versions are now outdated</li>
                </ul>
              </div>

              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Best regards,<br>
                ${team.team_name} Management<br>
                <em>Sent by ${adminEmail}</em>
              </p>
            </div>
          `,
        });
      } catch (error) {
        console.error(`Error sending email to ${member.email}:`, error);
        return null;
      }
    }) || [];

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter(result => result.status === 'fulfilled' && result.value !== null).length;
    const failed = results.length - successful;

    console.log(`Shift notifications sent: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successful, 
        failed: failed,
        version: version,
        month: monthName
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
    console.error("Error in send-shift-notifications function:", error);
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