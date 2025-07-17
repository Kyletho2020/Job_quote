import { corsHeaders } from '../_shared/cors.ts'

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

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text input is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Simple text parsing logic to extract project information
    const extractedInfo: ProjectInfo = {}

    // Extract project title (look for patterns like "Project:", "Job:", etc.)
    const projectTitleMatch = text.match(/(?:project|job|work)\s*:?\s*([^\n\r.]+)/i)
    if (projectTitleMatch) {
      extractedInfo.projectTitle = projectTitleMatch[1].trim()
    }

    // Extract company name (look for patterns like "Company:", "Client:", etc.)
    const companyMatch = text.match(/(?:company|client|contractor)\s*:?\s*([^\n\r.]+)/i)
    if (companyMatch) {
      extractedInfo.companyName = companyMatch[1].trim()
    }

    // Extract address (look for patterns with street numbers, addresses)
    const addressMatch = text.match(/(?:address|location|site)\s*:?\s*([^\n\r]+(?:\n[^\n\r]*(?:street|ave|road|blvd|way|dr|st|lane).*)?)/i)
    if (addressMatch) {
      extractedInfo.siteAddress = addressMatch[1].trim()
    }

    // Extract contact name (look for patterns like "Contact:", "Foreman:", etc.)
    const contactMatch = text.match(/(?:contact|foreman|supervisor|manager)\s*:?\s*([^\n\r.]+)/i)
    if (contactMatch) {
      extractedInfo.siteContactName = contactMatch[1].trim()
    }

    // Extract phone number (look for phone number patterns)
    const phoneMatch = text.match(/(?:phone|tel|call)\s*:?\s*([0-9\-\(\)\s\.]+)/i) || 
                     text.match(/\b\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/)
    if (phoneMatch) {
      extractedInfo.siteContactPhone = phoneMatch[1].trim()
    }

    // Extract work description (look for patterns describing work to be done)
    const workMatch = text.match(/(?:work|scope|description|task|job)\s*:?\s*([^\n\r]+(?:\n[^\n\r]*)*)/i)
    if (workMatch) {
      extractedInfo.workDescription = workMatch[1].trim()
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