import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Setup demo users function loaded')

Deno.serve(async (req) => {
  console.log('Request received:', req.method, req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log('Creating demo users...')

    // Define the demo users
    const demoUsers = [
      {
        email: 'hna@scandac.com',
        password: 'Scandac2025!',
        full_name: 'HNA User'
      },
      {
        email: 'myh@scandac.com', 
        password: 'Scandac2025!',
        full_name: 'MYH User'
      }
    ]

    const results = []

    for (const user of demoUsers) {
      console.log(`Processing user: ${user.email}`)
      
      // Check if user already exists by listing users and filtering by email
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (listError) {
        console.error(`Failed to check existing users:`, listError)
        results.push({
          email: user.email,
          status: 'error',
          error: listError.message
        })
        continue
      }

      const existingUser = existingUsers.users.find(u => u.email === user.email)
      
      if (existingUser) {
        console.log(`User ${user.email} already exists`)
        results.push({
          email: user.email,
          status: 'already_exists',
          user_id: existingUser.id
        })
        continue
      }

      // Create the user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: user.full_name
        }
      })

      if (createError) {
        console.error(`Failed to create user ${user.email}:`, createError)
        results.push({
          email: user.email,
          status: 'error',
          error: createError.message
        })
      } else {
        console.log(`Successfully created user ${user.email}`)
        results.push({
          email: user.email,
          status: 'created',
          user_id: newUser.user?.id
        })
      }
    }

    console.log('Demo users setup complete:', results)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo users setup completed',
        results
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
      }
    )

  } catch (error) {
    console.error('Error setting up demo users:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
      }
    )
  }
})