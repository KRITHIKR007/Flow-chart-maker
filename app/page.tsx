'use client'

import { useState, useEffect } from 'react'
import PromptInput from '@/components/PromptInput'
import DiagramCanvas from '@/components/DiagramCanvas'
import type { DiagramData } from '@/types/diagram'
import type { ThemeName } from '@/lib/themes'
import type { AppTheme } from '@/lib/appTheme'
import { appThemes } from '@/lib/appTheme'

export default function Home() {
  const [diagramData, setDiagramData] = useState<DiagramData | null>(null)
  const [chartName, setChartName] = useState<string>('Untitled Diagram')
  const [theme, setTheme] = useState<ThemeName>('classic')
  const [appTheme, setAppTheme] = useState<AppTheme>('light')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme') as AppTheme
    if (savedTheme) {
      setAppTheme(savedTheme)
    }
  }, [])

  // Save theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem('appTheme', appTheme)
    document.documentElement.style.backgroundColor = appThemes[appTheme].background
  }, [appTheme])

  const toggleAppTheme = () => {
    setAppTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const handleGenerateDiagram = async (prompt: string, name: string, selectedTheme: ThemeName) => {
    setIsGenerating(true)
    setError(null)
    setChartName(name)
    setTheme(selectedTheme)

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
    setChartName('Untitled Diagram')
  }

  const currentAppTheme = appThemes[appTheme]

  return (
    <main 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: currentAppTheme.background }}
    >
      {!diagramData ? (
        <PromptInput
          onGenerate={handleGenerateDiagram}
          isGenerating={isGenerating}
          error={error}
          appTheme={appTheme}
          onToggleTheme={toggleAppTheme}
        />
      ) : (
        <DiagramCanvas
          diagramData={diagramData}
          chartName={chartName}
          theme={theme}
          appTheme={appTheme}
          onToggleTheme={toggleAppTheme}
          onReset={handleReset}
          onRegenerate={handleGenerateDiagram}
        />
      )}
    </main>
  )
}
