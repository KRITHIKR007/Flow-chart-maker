import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'
import type { DiagramData, GenerateDiagramResponse } from '@/types/diagram'

// Initialize Hugging Face client with new router endpoint
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)
// Override the base URL to use the new router
Object.defineProperty(hf, 'apiUrl', {
  value: 'https://router.huggingface.co',
  writable: false,
  configurable: true
})

// System prompt for diagram generation
const SYSTEM_PROMPT = `You are an expert at converting natural language into structured diagram data.

Analyze the prompt and create a diagram with:
- Appropriate type (flowchart, org_chart, decision_tree, timeline, or architecture)
- Clear nodes with short labels (2-5 words each)
- Logical connections between nodes

Return ONLY a valid JSON object with this structure:
{
  "type": "flowchart",
  "nodes": [{"id": "1", "label": "Start"}],
  "edges": [{"from": "1", "to": "2"}]
}`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid prompt' },
        { status: 400 }
      )
    }

    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Hugging Face API key not configured' },
        { status: 500 }
      )
    }

    // Use Hugging Face Inference API with Qwen model (faster and better for JSON)
    const fullPrompt = `${SYSTEM_PROMPT}

User request: "${prompt}"

Generate the JSON diagram data:`

    const response = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        { 
          role: 'system', 
          content: SYSTEM_PROMPT 
        },
        { 
          role: 'user', 
          content: `Create a diagram for: "${prompt}"\n\nReturn only the JSON object.` 
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    })

    const responseContent = response.choices[0]?.message?.content

    if (!responseContent) {
      return NextResponse.json(
        { success: false, error: 'No response from Hugging Face' },
        { status: 500 }
      )
    }

    // Extract JSON from response
    let jsonString = responseContent.trim()
    
    // Remove markdown code blocks if present
    jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    
    // Find JSON object in response
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonString = jsonMatch[0]
    }

    // Parse the JSON response
    const diagramData: DiagramData = JSON.parse(jsonString)

    // Validate the response structure
    if (!diagramData.type || !diagramData.nodes || !diagramData.edges) {
      return NextResponse.json(
        { success: false, error: 'Invalid diagram data structure' },
        { status: 500 }
      )
    }

    const apiResponse: GenerateDiagramResponse = {
      success: true,
      data: diagramData,
    }

    return NextResponse.json(apiResponse)
  } catch (error) {
    console.error('Error generating diagram:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
