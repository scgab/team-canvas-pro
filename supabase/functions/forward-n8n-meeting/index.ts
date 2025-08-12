import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Public N8N webhook URL for meeting created events
const N8N_WEBHOOK_URL = "https://wheewls.app.n8n.cloud/webhook/wheewls/meeting-created";

interface MeetingCreatedPayload {
  meetingId?: string;
  title: string;
  date: string;
  time?: string;
  end_time?: string | null;
  attendees?: string[];
  createdBy?: string;
  location?: string;
  agenda?: string[];
  source?: string; // e.g., 'meetings' | 'calendar'
  timestamp?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const payload = (await req.json()) as MeetingCreatedPayload;

    // Forward to N8N webhook from server-side to avoid browser CORS issues
    const forwardResp = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await forwardResp.text();
    const resBody = {
      ok: forwardResp.ok,
      status: forwardResp.status,
      statusText: forwardResp.statusText,
      responseText: text?.slice(0, 2000) || "",
    };

    // Log for debugging
    console.log("forward-n8n-meeting =>", resBody);

    return new Response(JSON.stringify(resBody), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("forward-n8n-meeting error:", err?.message || err);
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
