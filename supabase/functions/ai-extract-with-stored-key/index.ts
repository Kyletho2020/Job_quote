import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

interface ProjectInfo {
  projectTitle?: string
  companyName?: string
  siteAddress?: string
  siteContactName?: string
  siteContactPhone?: string
  workDescription?: string
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { text } = await req.json()
    const authHeader = req.headers.get('Authorization')

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text input is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from auth header
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get user's stored API key
    const { data: apiKeyData, error: keyError } = await supabase
      .from('user_api_keys')
      .select('encrypted_api_key')
      .eq('user_id', user.id)
      .single()

    if (keyError || !apiKeyData) {
      return new Response(
        JSON.stringify({ error: 'No API key found. Please set up your OpenAI API key first.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Decrypt the API key
    const encryptionKey = Deno.env.get('API_KEY_ENCRYPTION_SECRET') ?? 'default-key'
    const { data: decryptedKey, error: decryptError } = await supabase
      .rpc('decrypt_api_key', {
        encrypted_key: apiKeyData.encrypted_api_key,
        encryption_key: encryptionKey
      })

    if (decryptError || !decryptedKey) {
      return new Response(
        JSON.stringify({ error: 'Failed to decrypt API key' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Call OpenAI API with decrypted key
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${decryptedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting project information from text. Extract the following information from the provided text and return it as a JSON object with these exact keys:
            - projectTitle: The name or title of the project/job
            - companyName: The company or client name
            - siteAddress: The complete address where work will be performed
            - siteContactName: The name of the person to contact at the site
            - siteContactPhone: The phone number for the site contact
            - workDescription: A description of the work to be performed

            Only include fields where you can confidently extract the information. If a field cannot be determined from the text, omit it from the response. Return only valid JSON, no additional text.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      console.error('OpenAI API error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Failed to process with AI' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const openaiData = await openaiResponse.json()
    const aiResponse = openaiData.choices[0]?.message?.content

    if (!aiResponse) {
      return new Response(
        JSON.stringify({ error: 'No response from AI' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse the AI response as JSON
    let extractedInfo: ProjectInfo
    try {
      extractedInfo = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid AI response format' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ extractedInfo }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process text' }),
      {
        status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})