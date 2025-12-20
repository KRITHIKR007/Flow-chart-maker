'use client'

import { useCallback, useState, useMemo, useEffect, useRef } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  NodeChange,
  EdgeChange,
  Connection,
  addEdge,
  MiniMap,
  NodeTypes,
  getRectOfNodes,
  getTransformForBounds,
} from 'reactflow'
import 'reactflow/dist/style.css'
import type { DiagramData } from '@/types/diagram'
import { convertDiagramToFlow } from '@/lib/layoutUtils'
import CustomNode from './CustomNode'
import { themes, ThemeName } from '@/lib/themes'
import { AppTheme, appThemes } from '@/lib/appTheme'

interface DiagramCanvasProps {
  diagramData: DiagramData
  chartName: string
  theme: ThemeName
  appTheme: AppTheme
  onToggleTheme: () => void
  onReset: () => void
  onRegenerate: (prompt: string, chartName: string, theme: ThemeName) => void
}

interface HistoryState {
  nodes: Node[]
  edges: Edge[]
}

export default function DiagramCanvas({ diagramData, chartName, theme, appTheme, onToggleTheme, onReset, onRegenerate }: DiagramCanvasProps) {
  const { nodes: initialNodes, edges: initialEdges } = convertDiagramToFlow(diagramData)
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [showPrompt, setShowPrompt] = useState(false)
  const [newPrompt, setNewPrompt] = useState('')
  const [newChartName, setNewChartName] = useState(chartName)
  const [copiedNodes, setCopiedNodes] = useState<Node[]>([])
  const [showShortcuts, setShowShortcuts] = useState(false)
  
  const currentTheme = themes[theme]
  const colors = appThemes[appTheme]
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([{ nodes: initialNodes, edges: initialEdges }])
  const [historyIndex, setHistoryIndex] = useState(0)
  const isUndoRedoAction = useRef(false)

  // Save to history whenever nodes or edges change
  useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false
      return
    }

    const newState = { nodes, edges }
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(newState)
      // Limit history to 50 states
      if (newHistory.length > 50) {
        newHistory.shift()
        return newHistory
      }
      return newHistory
    })
    setHistoryIndex((prev) => Math.min(prev + 1, 49))
  }, [nodes, edges])

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true
      const prevState = history[historyIndex - 1]
      setNodes(prevState.nodes)
      setEdges(prevState.edges)
      setHistoryIndex((prev) => prev - 1)
    }
  }, [historyIndex, history, setNodes, setEdges])

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true
      const nextState = history[historyIndex + 1]
      setNodes(nextState.nodes)
      setEdges(nextState.edges)
      setHistoryIndex((prev) => prev + 1)
    }
  }, [historyIndex, history, setNodes, setEdges])

  // Copy selected nodes
  const copyNodes = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected)
    if (selectedNodes.length > 0) {
      setCopiedNodes(selectedNodes)
      showNotification(`Copied ${selectedNodes.length} node(s)`)
    }
  }, [nodes])

  // Paste nodes
  const pasteNodes = useCallback(() => {
    if (copiedNodes.length === 0) return

    const newNodes = copiedNodes.map((node, index) => ({
      ...node,
      id: `${node.id}-copy-${Date.now()}-${index}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      selected: false,
    }))

    setNodes((nds) => [...nds, ...newNodes])
    showNotification(`Pasted ${newNodes.length} node(s)`)
  }, [copiedNodes, setNodes])

  // Delete selected nodes and edges
  const deleteSelected = useCallback(() => {
    const selectedNodeIds = nodes.filter((n) => n.selected).map((n) => n.id)
    const selectedEdgeIds = edges.filter((e) => e.selected).map((e) => e.id)
    
    if (selectedNodeIds.length > 0 || selectedEdgeIds.length > 0) {
      setNodes((nds) => nds.filter((n) => !n.selected))
      setEdges((eds) => eds.filter((e) => !e.selected && !selectedNodeIds.includes(e.source) && !selectedNodeIds.includes(e.target)))
      showNotification(`Deleted ${selectedNodeIds.length} node(s) and ${selectedEdgeIds.length} edge(s)`)
    }
  }, [nodes, edges, setNodes, setEdges])

  // Add new node
  const addNode = useCallback(() => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'default',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { 
        label: 'New Node',
        onImageUpload: handleImageUpload,
        onColorChange: handleColorChange,
        onDelete: handleNodeDelete,
      },
    }
    setNodes((nds) => [...nds, newNode])
    showNotification('Added new node')
  }, [setNodes])

  // Notification system
  const [notification, setNotification] = useState<string | null>(null)
  const showNotification = useCallback((message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 2000)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields
      if ((event.target as HTMLElement).tagName === 'INPUT' || (event.target as HTMLElement).tagName === 'TEXTAREA') {
        return
      }

      const isCtrl = event.ctrlKey || event.metaKey

      // Ctrl+Z - Undo
      if (isCtrl && event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        undo()
      }

      // Ctrl+Y or Ctrl+Shift+Z - Redo
      if ((isCtrl && event.key === 'y') || (isCtrl && event.shiftKey && event.key === 'z')) {
        event.preventDefault()
        redo()
      }

      // Ctrl+C - Copy
      if (isCtrl && event.key === 'c') {
        event.preventDefault()
        copyNodes()
      }

      // Ctrl+V - Paste
      if (isCtrl && event.key === 'v') {
        event.preventDefault()
        pasteNodes()
      }

      // Delete or Backspace - Delete selected
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        deleteSelected()
      }

      // Ctrl+A - Select All
      if (isCtrl && event.key === 'a') {
        event.preventDefault()
        setNodes((nds) => nds.map((n) => ({ ...n, selected: true })))
        setEdges((eds) => eds.map((e) => ({ ...e, selected: true })))
      }

      // Ctrl+N - Add New Node
      if (isCtrl && event.key === 'n') {
        event.preventDefault()
        addNode()
      }

      // ? - Show shortcuts
      if (event.key === '?') {
        event.preventDefault()
        setShowShortcuts((prev) => !prev)
      }

      // Escape - Deselect all
      if (event.key === 'Escape') {
        setNodes((nds) => nds.map((n) => ({ ...n, selected: false })))
        setEdges((eds) => eds.map((e) => ({ ...e, selected: false })))
        setShowShortcuts(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, copyNodes, pasteNodes, deleteSelected, addNode, setNodes, setEdges])

  // Define custom node types
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      default: CustomNode,
    }),
    []
  )

  // Handle edge connections (when user connects nodes manually)
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({
        ...connection,
        type: 'smoothstep',
        animated: false,
        style: { stroke: 'black', strokeWidth: 2 },
      }, eds))
    },
    [setEdges]
  )

  // Handle image upload for a node
  const handleImageUpload = useCallback((nodeId: string, imageUrl: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, image: imageUrl } }
          : node
      )
    )
  }, [setNodes])

  // Handle color change for a node
  const handleColorChange = useCallback((nodeId: string, color: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, color } }
          : node
      )
    )
  }, [setNodes])

  // Handle node deletion
  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
  }, [setNodes, setEdges])

  // Add callbacks to all nodes
  const nodesWithCallbacks = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onImageUpload: handleImageUpload,
          onColorChange: handleColorChange,
          onDelete: handleNodeDelete,
        },
        style: {
          ...node.style,
          backgroundColor: node.data.color || currentTheme.nodeBackground,
          borderColor: currentTheme.nodeBorder,
          color: currentTheme.nodeText,
        },
      })),
    [nodes, handleImageUpload, handleColorChange, handleNodeDelete, currentTheme]
  )

  // Export diagram as PNG
  const handleExportPNG = useCallback(async () => {
    const nodesBounds = getRectOfNodes(nodesWithCallbacks)
    const padding = 50
    
    const imageWidth = nodesBounds.width + padding * 2
    const imageHeight = nodesBounds.height + padding * 2

    const reactFlowWrapper = document.querySelector('.react-flow') as HTMLElement

    if (!reactFlowWrapper) {
      showNotification('Export failed: Canvas not found')
      return
    }

    try {
      const html2canvas = (await import('html2canvas')).default
      
      // Get the viewport element that contains both nodes and edges
      const viewportElement = reactFlowWrapper.querySelector('.react-flow__viewport') as HTMLElement
      
      if (!viewportElement) {
        showNotification('Export failed: Viewport not found')
        return
      }

      // Calculate the current transform to get visible area
      const transform = viewportElement.style.transform
      
      // Temporarily adjust viewport to show only the diagram
      const originalTransform = viewportElement.style.transform
      viewportElement.style.transform = `translate(${padding - nodesBounds.x}px, ${padding - nodesBounds.y}px) scale(1)`
      
      // Create a container with exact dimensions
      const tempContainer = document.createElement('div')
      tempContainer.style.width = `${imageWidth}px`
      tempContainer.style.height = `${imageHeight}px`
      tempContainer.style.position = 'relative'
      tempContainer.style.backgroundColor = currentTheme.background

      const canvas = await html2canvas(viewportElement, {
        backgroundColor: currentTheme.background,
        width: imageWidth,
        height: imageHeight,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        x: nodesBounds.x - padding,
        y: nodesBounds.y - padding,
      })

      // Restore original transform
      viewportElement.style.transform = originalTransform

      const link = document.createElement('a')
      link.download = `${chartName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

      showNotification('Diagram exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      showNotification('Export failed. Please try again.')
    }
  }, [nodesWithCallbacks, chartName, currentTheme])

  // Export diagram as SVG
  const handleExportSVG = useCallback(() => {
    const nodesBounds = getRectOfNodes(nodesWithCallbacks)
    const padding = 50
    
    const svgWidth = nodesBounds.width + padding * 2
    const svgHeight = nodesBounds.height + padding * 2

    const svgElement = document.querySelector('.react-flow__edges') as SVGElement
    const nodesElement = document.querySelector('.react-flow__nodes') as HTMLElement

    if (!svgElement || !nodesElement) {
      showNotification('Export failed: Canvas not found')
      return
    }

    try {
      // Create SVG with proper bounds
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('width', svgWidth.toString())
      svg.setAttribute('height', svgHeight.toString())
      svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

      // Add background
      const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      background.setAttribute('width', '100%')
      background.setAttribute('height', '100%')
      background.setAttribute('fill', currentTheme.background)
      svg.appendChild(background)

      // Clone and add edges
      const edgesClone = svgElement.cloneNode(true) as SVGElement
      edgesClone.setAttribute('transform', `translate(${padding - nodesBounds.x}, ${padding - nodesBounds.y})`)
      svg.appendChild(edgesClone)

      // Add nodes as foreignObject
      const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
      foreignObject.setAttribute('x', (padding - nodesBounds.x).toString())
      foreignObject.setAttribute('y', (padding - nodesBounds.y).toString())
      foreignObject.setAttribute('width', nodesBounds.width.toString())
      foreignObject.setAttribute('height', nodesBounds.height.toString())
      
      const nodesClone = nodesElement.cloneNode(true) as HTMLElement
      foreignObject.appendChild(nodesClone)
      svg.appendChild(foreignObject)

      // Serialize and download
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svg)
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.download = `${chartName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.svg`
      link.href = url
      link.click()

      URL.revokeObjectURL(url)
      showNotification('SVG exported successfully!')
    } catch (error) {
      console.error('SVG export error:', error)
      showNotification('SVG export failed. Please try again.')
    }
  }, [nodesWithCallbacks, chartName, currentTheme])

  // Reset layout to original positions
  const handleResetLayout = useCallback(() => {
    const { nodes: resetNodes, edges: resetEdges } = convertDiagramToFlow(diagramData)
    setNodes(resetNodes)
    setEdges(resetEdges)
  }, [diagramData, setNodes, setEdges])

  const handleRegenerateSubmit = () => {
    if (newPrompt.trim()) {
      onRegenerate(newPrompt.trim(), newChartName || chartName, theme)
      setShowPrompt(false)
      setNewPrompt('')
    }
  }

  return (
    <div className="relative h-screen w-full">
      {/* Header toolbar */}
      <div
        className="absolute left-0 right-0 top-0 z-10 px-6 py-4 transition-colors"
        style={{ 
          backgroundColor: colors.cardBackground,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold" style={{ color: colors.text }}>{chartName}</h2>
            <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
              {diagramData.type.replace('_', ' ').toUpperCase()} • {nodes.length} nodes, {edges.length} edges • Theme: {currentTheme.name}
            </p>
          </div>

          <div className="flex gap-2">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="rounded border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{
                backgroundColor: colors.buttonBackground,
                color: colors.buttonText,
                borderColor: colors.border,
              }}
            >
              {appTheme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>

            {/* Undo Button */}
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="rounded border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80 disabled:opacity-30"
              style={{
                backgroundColor: colors.cardBackground,
                color: colors.text,
                borderColor: colors.border,
              }}
              title="Undo (Ctrl+Z)"
            >
              ↶ Undo
            </button>

            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="rounded border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80 disabled:opacity-30"
              style={{
                backgroundColor: colors.cardBackground,
                color: colors.text,
                borderColor: colors.border,
              }}
              title="Redo (Ctrl+Y)"
            >
              ↷ Redo
            </button>

            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="rounded border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{
                backgroundColor: colors.cardBackground,
                color: colors.text,
                borderColor: colors.border,
              }}
              title="Keyboard Shortcuts (?)"
            >
              ⌨️ Shortcuts
            </button>

            <button
              onClick={handleResetLayout}
              className="rounded border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{
                backgroundColor: colors.cardBackground,
                color: colors.text,
                borderColor: colors.border,
              }}
            >
              Reset Layout
            </button>
            
            <button
              onClick={() => setShowPrompt(!showPrompt)}
              className="rounded border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{
                backgroundColor: colors.cardBackground,
                color: colors.text,
                borderColor: colors.border,
              }}
            >
              Regenerate
            </button>

            <button
              onClick={handleExportPNG}
              className="rounded border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{
                backgroundColor: colors.cardBackground,
                color: colors.text,
                borderColor: colors.border,
              }}
            >
              Export PNG
            </button>

            <button
              onClick={handleExportSVG}
              className="rounded border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{
                backgroundColor: colors.cardBackground,
                color: colors.text,
                borderColor: colors.border,
              }}
            >
              Export SVG
            </button>

            <button
              onClick={onReset}
              className="rounded px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: colors.buttonBackground,
                color: colors.buttonText,
              }}
            >
              New Diagram
            </button>
          </div>
        </div>

        {/* Regenerate prompt input */}
        {showPrompt && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newChartName}
              onChange={(e) => setNewChartName(e.target.value)}
              placeholder="Chart name..."
              className="rounded px-3 py-2 text-sm transition-colors"
              style={{
                backgroundColor: colors.inputBackground,
                color: colors.text,
                border: `1px solid ${colors.inputBorder}`,
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleRegenerateSubmit()}
            />
            <input
              type="text"
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Enter new prompt to regenerate..."
              className="flex-1 rounded px-3 py-2 text-sm transition-colors"
              style={{
                backgroundColor: colors.inputBackground,
                color: colors.text,
                border: `1px solid ${colors.inputBorder}`,
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleRegenerateSubmit()}
            />
            <button
              onClick={handleRegenerateSubmit}
              className="rounded px-4 py-2 text-sm font-medium"
              style={{
                backgroundColor: colors.buttonBackground,
                color: colors.buttonText,
              }}
            >
              Generate
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="rounded border px-4 py-2 text-sm"
              style={{
                backgroundColor: colors.cardBackground,
                color: colors.text,
                borderColor: colors.border,
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in rounded-lg border border-gray-300 bg-white px-4 py-3 shadow-lg">
          <p className="text-sm font-medium text-black">{notification}</p>
        </div>
      )}

      {/* Keyboard Shortcuts Panel */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-black">⌨️ Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-2xl text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ShortcutItem shortcut="Ctrl + Z" description="Undo last action" />
              <ShortcutItem shortcut="Ctrl + Y" description="Redo last action" />
              <ShortcutItem shortcut="Ctrl + C" description="Copy selected nodes" />
              <ShortcutItem shortcut="Ctrl + V" description="Paste copied nodes" />
              <ShortcutItem shortcut="Ctrl + A" description="Select all" />
              <ShortcutItem shortcut="Ctrl + N" description="Add new node" />
              <ShortcutItem shortcut="Delete" description="Delete selected items" />
              <ShortcutItem shortcut="Backspace" description="Delete selected items" />
              <ShortcutItem shortcut="Escape" description="Deselect all" />
              <ShortcutItem shortcut="?" description="Show/hide shortcuts" />
              <ShortcutItem shortcut="Drag Node" description="Move node position" />
              <ShortcutItem shortcut="Drag Handle" description="Connect nodes" />
              <ShortcutItem shortcut="Mouse Wheel" description="Zoom in/out" />
              <ShortcutItem shortcut="Space + Drag" description="Pan canvas" />
            </div>

            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 font-semibold text-black">💡 Tips:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Hover over nodes to see edit options (photo, color, delete)</li>
                <li>• Click and drag from bottom to top handles to connect nodes</li>
                <li>• Hold Ctrl and click to multi-select nodes</li>
                <li>• Double-click a node to edit its label</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* React Flow Canvas */}
      <div className="h-full w-full pt-24" style={{ backgroundColor: currentTheme.background }}>
        <ReactFlow
          nodes={nodesWithCallbacks}
          edges={edges.map(edge => ({
            ...edge,
            style: { ...edge.style, stroke: currentTheme.edgeColor }
          }))}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Control"
        >
          <Controls />
          <Background 
            color={currentTheme.gridColor} 
            gap={20} 
            variant={BackgroundVariant.Dots}
            size={2}
          />
          <MiniMap
            nodeColor={(node) => (node.data.color as string) || currentTheme.nodeBackground}
            nodeStrokeColor={currentTheme.nodeBorder}
            nodeStrokeWidth={2}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>
    </div>
  )
}

// Shortcut Item Component
function ShortcutItem({ shortcut, description }: { shortcut: string; description: string }) {
  return (
    <div className="flex items-center justify-between rounded border border-gray-200 p-3">
      <span className="text-sm text-gray-600">{description}</span>
      <kbd className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-black">
        {shortcut}
      </kbd>
    </div>
  )
}
