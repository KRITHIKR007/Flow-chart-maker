'use client'

import { useState, useEffect } from 'react'
import { themes, ThemeName } from '@/lib/themes'
import { AppTheme, appThemes } from '@/lib/appTheme'

interface PromptInputProps {
  onGenerate: (prompt: string, chartName: string, theme: ThemeName) => void
  isGenerating: boolean
  error: string | null
  appTheme: AppTheme
  onToggleTheme: () => void
}

const examplePrompts = [
  'Create a flowchart for user authentication process',
  'Show an org chart for a tech startup with CEO, CTO, and engineering teams',
  'Decision tree for choosing a cloud provider',
  'Timeline of major web development milestones from 2010 to 2024',
  'System architecture diagram for a microservices e-commerce platform',
]

export default function PromptInput({ onGenerate, isGenerating, error, appTheme, onToggleTheme }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [chartName, setChartName] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('classic')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const colors = appThemes[appTheme]

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
      onGenerate(prompt.trim(), chartName.trim() || 'Untitled Diagram', selectedTheme)
    }
  }

  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: colors.background }}>
      {/* Theme Toggle Button */}
      <div className="mb-4 flex justify-end px-6 pt-6">
        <button
          onClick={onToggleTheme}
          className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          style={{
            backgroundColor: colors.cardBackground,
            color: colors.text,
            border: `1px solid ${colors.border}`,
          }}
        >
          {appTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>

      <div className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6 rounded-lg border p-8 shadow-lg transition-colors" style={{ backgroundColor: colors.cardBackground, borderColor: colors.border }}>
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold transition-colors" style={{ color: colors.text }}>
              Diagram Generator
            </h1>
            <p className="transition-colors" style={{ color: colors.text, opacity: 0.7 }}>
              Convert your ideas into beautiful diagrams with AI
            </p>
          </div>

          {/* Chart Name Input */}
          <div>
            <label htmlFor="chartName" className="mb-2 block text-sm font-medium" style={{ color: colors.text }}>
              Chart Name (Optional)
            </label>
            <input
              id="chartName"
              type="text"
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              placeholder="My Awesome Diagram"
              className="w-full rounded-lg border-2 px-4 py-2 transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.inputBorder,
              }}
              disabled={isGenerating}
            />
          </div>

          {/* Theme Selection */}
          <div>
            <label className="mb-3 block text-sm font-medium" style={{ color: colors.text }}>
              Choose Theme
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedTheme(key as ThemeName)}
                  disabled={isGenerating}
                  className={`relative overflow-hidden rounded-lg border-2 p-4 transition-all ${
                    selectedTheme === key
                      ? 'ring-2'
                      : 'hover:opacity-80'
                  }`}
                  style={{ 
                    backgroundColor: theme.background,
                    borderColor: selectedTheme === key ? colors.buttonBackground : colors.border,
                    ringColor: selectedTheme === key ? colors.buttonBackground : 'transparent'
                  }}
                >
                  {/* Theme Preview */}
                  <div className="mb-2 flex items-center justify-center">
                    <div
                      className="h-8 w-12 rounded border-2"
                      style={{
                        backgroundColor: theme.nodeBackground,
                        borderColor: theme.nodeBorder,
                      }}
                    />
                  </div>
                  <p className="text-xs font-medium" style={{ color: colors.text }}>
                    {theme.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label htmlFor="prompt" className="mb-2 block text-sm font-medium" style={{ color: colors.text }}>
              Describe Your Diagram
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={examplePrompts[placeholderIndex]}
              className="h-32 w-full resize-none rounded-lg border-2 px-4 py-3 transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.inputBackground,
                color: colors.text,
                borderColor: colors.inputBorder,
              }}
              disabled={isGenerating}
            />
          </div>

          {error && (
            <div className="rounded border border-red-500 bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="w-full rounded-lg px-6 py-3 font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{
              backgroundColor: colors.buttonBackground,
              color: colors.buttonText,
            }}
          >
            {isGenerating ? 'Generating...' : 'Generate Diagram'}
          </button>
        </form>
      </div>

      <div className="pb-8 text-center text-xs transition-colors" style={{ color: colors.text, opacity: 0.5 }}>
        Supports: Flowcharts, Org Charts, Decision Trees, Timelines, Architecture Diagrams
      </div>
    </div>
  )
}
