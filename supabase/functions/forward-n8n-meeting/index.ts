import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Public N8N webhook URL for meeting created events
const N8N_WEBHOOK_URL = "https://wheewls.app.n8n.cloud/webhook/webhook-test/a8ad0817-3fd7-4465-a7f4-4cccc7d0a40c";

interface MeetingCreatedPayload {
  sessionId?: string;
  chatInput?: string;
  timezone?: string;
  userEmail?: string;
  eventTitle?: string;
  eventDescription?: string;
  start_date?: string;
  end_date?: string;
  // Legacy fields for backward compatibility
  meetingId?: string;
  title?: string;
  date?: string;
  time?: string;
  end_time?: string | null;
  attendees?: string[];
  createdBy?: string;
  location?: string;
  agenda?: string[];
  source?: string;
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

    // Enhance payload with default values and proper structure
    const enhancedPayload = {
      sessionId: payload.sessionId || "demo-1",
      chatInput: payload.chatInput || `Create a meeting on ${payload.date || payload.start_date} at ${payload.time} for 30 minutes`,
      timezone: payload.timezone || "Europe/Stockholm",
      userEmail: payload.userEmail || payload.createdBy || "user@example.com",
      eventTitle: payload.eventTitle || payload.title || "Untitled Event",
      eventDescription: payload.eventDescription || payload.agenda?.join(", ") || "",
      start_date: payload.start_date,
      end_date: payload.end_date,
      // Include original payload for compatibility
      ...payload
    };

    // Forward to N8N webhook from server-side to avoid browser CORS issues
    const forwardResp = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enhancedPayload),
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
