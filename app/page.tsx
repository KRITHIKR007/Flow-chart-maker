'use client'

import { useState } from 'react'
import PromptInput from '@/components/PromptInput'
import DiagramCanvas from '@/components/DiagramCanvas'
import type { DiagramData } from '@/types/diagram'

export default function Home() {
  const [diagramData, setDiagramData] = useState<DiagramData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateDiagram = async (prompt: string) => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate diagram')
      }

      if (result.success && result.data) {
        setDiagramData(result.data)
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error generating diagram:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setDiagramData(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-white">
      {!diagramData ? (
        <PromptInput
          onGenerate={handleGenerateDiagram}
          isGenerating={isGenerating}
          error={error}
        />
      ) : (
        <DiagramCanvas
          diagramData={diagramData}
          onReset={handleReset}
          onRegenerate={handleGenerateDiagram}
        />
      )}
    </main>
  )
}
