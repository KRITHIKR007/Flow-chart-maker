import type { DiagramData, DiagramNode, DiagramEdge } from '@/types/diagram'
import { Node, Edge, Position } from 'reactflow'

/**
 * Calculate automatic layout positions for nodes based on diagram type
 */
export function calculateNodePositions(
  nodes: DiagramNode[],
  edges: DiagramEdge[],
  type: string
): Node[] {
  const nodeMap = new Map<string, DiagramNode>()
  nodes.forEach(node => nodeMap.set(node.id, node))

  // Build adjacency list for hierarchy detection
  const childrenMap = new Map<string, string[]>()
  const parentMap = new Map<string, string>()
  
  edges.forEach(edge => {
    if (!childrenMap.has(edge.from)) {
      childrenMap.set(edge.from, [])
    }
    childrenMap.get(edge.from)!.push(edge.to)
    parentMap.set(edge.to, edge.from)
  })

  // Find root nodes (nodes with no parents)
  const rootNodes = nodes.filter(node => !parentMap.has(node.id))

  const positionedNodes: Node[] = []
  const visited = new Set<string>()

  // Constants for layout
  const NODE_WIDTH = 180
  const NODE_HEIGHT = 60
  const HORIZONTAL_SPACING = 100
  const VERTICAL_SPACING = 120

  if (type === 'timeline') {
    // Timeline: horizontal layout
    nodes.forEach((node, index) => {
      positionedNodes.push({
        id: node.id,
        data: { label: node.label },
        position: { x: index * (NODE_WIDTH + HORIZONTAL_SPACING), y: 100 },
        type: 'default',
      })
    })
  } else if (type === 'org_chart' || type === 'decision_tree') {
    // Hierarchical top-down layout
    let currentLevel = 0
    const levelNodes: string[][] = []

    // BFS to assign levels
    const queue: Array<{ id: string; level: number }> = rootNodes.map(node => ({
      id: node.id,
      level: 0,
    }))

    while (queue.length > 0) {
      const { id, level } = queue.shift()!
      if (visited.has(id)) continue
      visited.add(id)

      if (!levelNodes[level]) {
        levelNodes[level] = []
      }
      levelNodes[level].push(id)

      const children = childrenMap.get(id) || []
      children.forEach(childId => {
        if (!visited.has(childId)) {
          queue.push({ id: childId, level: level + 1 })
        }
      })
    }

    // Position nodes by level
    levelNodes.forEach((nodeIds, level) => {
      const levelWidth = nodeIds.length * (NODE_WIDTH + HORIZONTAL_SPACING)
      const startX = -levelWidth / 2

      nodeIds.forEach((nodeId, index) => {
        const node = nodeMap.get(nodeId)
        if (node) {
          positionedNodes.push({
            id: node.id,
            data: { label: node.label },
            position: {
              x: startX + index * (NODE_WIDTH + HORIZONTAL_SPACING),
              y: level * (NODE_HEIGHT + VERTICAL_SPACING),
            },
            type: 'default',
          })
        }
      })
    })
  } else {
    // Flowchart, architecture: vertical flow layout
    let currentY = 0
    const processed = new Set<string>()

    const processNode = (nodeId: string, x: number = 0) => {
      if (processed.has(nodeId)) return
      processed.add(nodeId)

      const node = nodeMap.get(nodeId)
      if (!node) return

      positionedNodes.push({
        id: node.id,
        data: { label: node.label },
        position: { x, y: currentY },
        type: 'default',
      })

      currentY += NODE_HEIGHT + VERTICAL_SPACING

      const children = childrenMap.get(nodeId) || []
      children.forEach(childId => processNode(childId, x))
    }

    // Start with root nodes
    if (rootNodes.length > 0) {
      rootNodes.forEach(node => processNode(node.id))
    }

    // Process any remaining unvisited nodes
    nodes.forEach(node => {
      if (!processed.has(node.id)) {
        processNode(node.id)
      }
    })
  }

  return positionedNodes
}

/**
 * Convert diagram edges to React Flow edges
 */
export function convertEdges(edges: DiagramEdge[]): Edge[] {
  return edges.map((edge, index) => ({
    id: `edge-${edge.from}-${edge.to}-${index}`,
    source: edge.from,
    target: edge.to,
    type: 'smoothstep',
    animated: false,
    style: { stroke: 'black', strokeWidth: 2 },
  }))
}

/**
 * Main function to convert diagram data to React Flow compatible format
 */
export function convertDiagramToFlow(diagramData: DiagramData): {
  nodes: Node[]
  edges: Edge[]
} {
  const nodes = calculateNodePositions(
    diagramData.nodes,
    diagramData.edges,
    diagramData.type
  )
  const edges = convertEdges(diagramData.edges)

  return { nodes, edges }
}
