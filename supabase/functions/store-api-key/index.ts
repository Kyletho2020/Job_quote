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

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Encrypt the API key
    const encryptionKey = Deno.env.get('API_KEY_ENCRYPTION_SECRET') ?? 'default-encryption-key'
    const { data: encryptedKey, error: encryptError } = await supabase
      .rpc('encrypt_api_key', {
        api_key: apiKey,
        encryption_key: encryptionKey
      })

    if (encryptError) {
      throw encryptError
    }

    let result
    if (keyId) {
      // Update existing key
      const { data, error } = await supabase
        .from('api_keys')
        .update({ encrypted_key: encryptedKey })
        .eq('id', keyId)
        .select()
        .single()
      
      if (error) throw error
      result = data
    } else {
      // Insert new key
      const { data, error } = await supabase
        .from('api_keys')
        .insert({ encrypted_key: encryptedKey })
        .select()
        .single()
      
      if (error) throw error
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
      JSON.stringify({ error: 'Failed to store API key' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})