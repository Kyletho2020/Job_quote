import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { text, keyId } = await req.json()

    if (!text || !keyId) {
      return new Response(
        JSON.stringify({ error: 'Text and keyId are required' }),
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

    // Retrieve and decrypt the API key
    const { data: keyData, error: keyError } = await supabase
      .from('stored_api_key')
      .select('encrypted_key')
      .eq('id', keyId)
      .single()

    if (keyError || !keyData) {
      return new Response(
        JSON.stringify({ error: 'API key not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Decrypt the API key (reverse the base64 encoding)
    const apiKey = atob(keyData.encrypted_key)

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that extracts project information from text. 
            Extract the following information and return it as a JSON object:
            - projectTitle: The name or title of the project
            - companyName: The company or client name
            - siteAddress: The physical address where work will be performed
            - siteContactName: The primary contact person's name
            - siteContactPhone: Contact phone number
            - workDescription: Description of the work to be performed
            
            If any information is not found, use an empty string for that field.
            Return only valid JSON, no additional text.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorData}`)
    }

    const openaiData = await openaiResponse.json()
    const extractedInfo = JSON.parse(openaiData.choices[0].message.content)

    return new Response(
      JSON.stringify({
        success: true,
        extractedInfo,
        message: 'Information extracted successfully'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in AI extraction:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to extract information',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})