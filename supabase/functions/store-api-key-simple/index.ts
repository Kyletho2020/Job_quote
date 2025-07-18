import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { apiKey, keyId } = await req.json()

    if (!apiKey || typeof apiKey !== 'string') {
      return new Response(
        JSON.stringify({ error: 'API key is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_MANUAL_KEY') ?? ''
    )

    // Simple encryption using base64 encoding (for basic obfuscation)
    // In production, you'd want to use proper encryption
    const encryptedKey = btoa(apiKey)

    let result
    if (keyId === '816a7bfb-8a9b-410c-8a62-84bef585eb28') {
      // Update existing key
      const { data, error } = await supabase
        .from('stored_api_key')
        .update({ 
          encrypted_key: encryptedKey,
          created_at: new Date().toISOString()
        })
        .eq('id', keyId)
        .select()
        .single()
      
      if (error) {
        console.error('Update error:', error)
        throw error
      }
      result = data
    } else {
      // Insert new key
      const { data, error } = await supabase
        .from('stored_api_key')
        .insert({ encrypted_key: encryptedKey })
        .select()
        .single()
      
      if (error) {
        console.error('Insert error:', error)
        throw error
      }
      result = data
    }

    return new Response(
      JSON.stringify({ keyId: result.id, message: 'API key stored successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error storing API key:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to store API key',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})