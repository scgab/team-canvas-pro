import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify JWT and get user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { action, code, eventId } = await req.json();
    const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

    if (!googleClientId || !googleClientSecret) {
      return new Response(
        JSON.stringify({ error: 'Google OAuth credentials not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (action === 'getAuthUrl') {
      // Generate OAuth URL from backend to ensure proper configuration
      const redirectUri = `${req.headers.get('origin')}/test-site-calendar`;
      const scope = "https://www.googleapis.com/auth/calendar.readonly";
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(googleClientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent`;

      console.log('Generated OAuth URL:', authUrl);
      console.log('Redirect URI:', redirectUri);
      
      return new Response(
        JSON.stringify({ success: true, authUrl }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (action === 'exchangeCode') {
      // Handle OAuth code exchange
      if (!code) {
        return new Response(
          JSON.stringify({ error: 'Authorization code required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const redirectUri = `${req.headers.get('origin')}/test-site-calendar`;
      console.log('Exchanging code for tokens with redirect URI:', redirectUri);

      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: googleClientId,
          client_secret: googleClientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange failed:', errorText);
        return new Response(
          JSON.stringify({ error: 'Failed to exchange authorization code' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const tokenData = await tokenResponse.json();
      console.log('Token exchange successful');

      // Store tokens in database
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
      
      const { error: insertError } = await supabase
        .from('user_google_tokens')
        .upsert({
          user_id: user.id,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: expiresAt.toISOString(),
        });

      if (insertError) {
        console.error('Failed to store tokens:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to store authentication tokens' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Google Calendar connected successfully' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (action === 'getEvents') {
      // Get user's stored Google tokens
      const { data: tokenData, error: tokenError } = await supabase
        .from('user_google_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (tokenError || !tokenData) {
        return new Response(
          JSON.stringify({ error: 'Google Calendar not connected. Please authenticate first.' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      let accessToken = tokenData.access_token;

      // Check if token is expired and refresh if needed
      if (new Date(tokenData.expires_at) <= new Date()) {
        console.log('Access token expired, refreshing...');
        
        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: googleClientId,
            client_secret: googleClientSecret,
            refresh_token: tokenData.refresh_token,
            grant_type: 'refresh_token',
          }),
        });

        if (!refreshResponse.ok) {
          return new Response(
            JSON.stringify({ error: 'Failed to refresh access token. Please re-authenticate.' }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const refreshData = await refreshResponse.json();
        accessToken = refreshData.access_token;

        // Update stored tokens
        const newExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000);
        await supabase
          .from('user_google_tokens')
          .update({
            access_token: accessToken,
            expires_at: newExpiresAt.toISOString(),
          })
          .eq('user_id', user.id);
      }

      // Fetch calendar events
      const calendarResponse = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=50&singleEvents=true&orderBy=startTime',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!calendarResponse.ok) {
        const errorText = await calendarResponse.text();
        console.error('Calendar API request failed:', errorText);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch calendar events' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const calendarData = await calendarResponse.json();
      
      return new Response(
        JSON.stringify({ success: true, events: calendarData.items || [] }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (action === 'getEvent') {
      // Legacy support for single event fetching
      if (!eventId) {
        return new Response(
          JSON.stringify({ error: 'Event ID required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Get user's stored Google tokens (same logic as getEvents)
      const { data: tokenData, error: tokenError } = await supabase
        .from('user_google_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (tokenError || !tokenData) {
        return new Response(
          JSON.stringify({ error: 'Google Calendar not connected. Please authenticate first.' }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      let accessToken = tokenData.access_token;

      // Check if token is expired and refresh if needed (same logic as above)
      if (new Date(tokenData.expires_at) <= new Date()) {
        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: googleClientId,
            client_secret: googleClientSecret,
            refresh_token: tokenData.refresh_token,
            grant_type: 'refresh_token',
          }),
        });

        if (!refreshResponse.ok) {
          return new Response(
            JSON.stringify({ error: 'Failed to refresh access token. Please re-authenticate.' }),
            { 
              status: 401, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        const refreshData = await refreshResponse.json();
        accessToken = refreshData.access_token;

        const newExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000);
        await supabase
          .from('user_google_tokens')
          .update({
            access_token: accessToken,
            expires_at: newExpiresAt.toISOString(),
          })
          .eq('user_id', user.id);
      }

      // Fetch specific calendar event
      const eventResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!eventResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch calendar event' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const eventData = await eventResponse.json();
      
      return new Response(
        JSON.stringify({ success: true, event: eventData }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (action === 'disconnect') {
      // Remove stored tokens
      const { error: deleteError } = await supabase
        .from('user_google_tokens')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Failed to delete tokens:', deleteError);
        return new Response(
          JSON.stringify({ error: 'Failed to disconnect Google Calendar' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Google Calendar disconnected successfully' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action specified' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});