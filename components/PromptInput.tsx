'use client'

import { useState, useEffect } from 'react'

interface PromptInputProps {
  onGenerate: (prompt: string) => void
  isGenerating: boolean
  error: string | null
}

const examplePrompts = [
  'Create a flowchart for user authentication process',
  'Show an org chart for a tech startup with CEO, CTO, and engineering teams',
  'Decision tree for choosing a cloud provider',
  'Timeline of major web development milestones from 2010 to 2024',
  'System architecture diagram for a microservices e-commerce platform',
]

export default function PromptInput({ onGenerate, isGenerating, error }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  // Rotate placeholder examples every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % examplePrompts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim())
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <h1 className="mb-2 text-center text-4xl font-bold text-black">
          Diagram Generator
        </h1>
        <p className="mb-8 text-center text-sm text-gray-600">
          Convert natural language into visual diagrams
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={examplePrompts[placeholderIndex]}
            className="h-32 w-full resize-none rounded-lg border-2 border-black px-4 py-3 text-black placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-black"
            disabled={isGenerating}
          />

          {error && (
            <div className="rounded border border-red-500 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Diagram'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500">
          Supports: Flowcharts, Org Charts, Decision Trees, Timelines, Architecture Diagrams
        </div>
      </div>
    </div>
  )
}
