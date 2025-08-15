import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the team ID from the URL
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const id = pathParts[pathParts.length - 2] // Get team ID from /teams/[id]/members

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Team ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`Fetching team members for team ID: ${id}`)

    // Fetch team members from team_members table
    const { data: members, error } = await supabase
      .from('team_members')
      .select('email, full_name, name, role, status, competence_level')
      .eq('team_id', id)
      .eq('status', 'active')

    if (error) {
      console.error('Error fetching team members:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch team members' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Format members data
    const formattedMembers = members.map(member => ({
      email: member.email,
      name: member.full_name || member.name || member.email,
      role: member.role || 'member',
      competenceLevel: member.competence_level || 'beginner'
    }))

    console.log(`Found ${formattedMembers.length} active team members`)

    return new Response(
      JSON.stringify(formattedMembers),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error in team members function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})