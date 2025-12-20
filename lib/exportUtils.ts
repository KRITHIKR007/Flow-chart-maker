import { Node, Edge } from 'reactflow'

/**
 * Export diagram as PNG using canvas rendering
 * This is a placeholder - in production you'd use html2canvas or similar
 */
export async function exportAsPNG(
  nodes: Node[],
  edges: Edge[],
  filename: string = 'diagram.png'
): Promise<void> {
  try {
    // Get the React Flow viewport element
    const rfElement = document.querySelector('.react-flow__viewport') as HTMLElement
    if (!rfElement) {
      throw new Error('React Flow viewport not found')
    }

    // In a production app, you would:
    // 1. Install html2canvas: npm install html2canvas
    // 2. Import it: import html2canvas from 'html2canvas'
    // 3. Use it like this:
    
    /*
    const canvas = await html2canvas(rfElement, {
      backgroundColor: '#ffffff',
      scale: 2,
    })
    
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
    */

    console.log('PNG export would trigger here with html2canvas')
    alert('To enable PNG export, install html2canvas:\nnpm install html2canvas\n\nThen uncomment the code in lib/exportUtils.ts')
  } catch (error) {
    console.error('Error exporting PNG:', error)
    throw error
  }
}

/**
 * Export diagram as SVG
 */
export function exportAsSVG(
  nodes: Node[],
  edges: Edge[],
  filename: string = 'diagram.svg'
): void {
  try {
    // Get all SVG elements from React Flow
    const svgElement = document.querySelector('.react-flow__edges') as SVGElement
    if (!svgElement) {
      throw new Error('SVG elements not found')
    }

    // Create a complete SVG document
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttribute('width', '1200')
    svg.setAttribute('height', '800')
    
    // Clone and append the edges and nodes
    const clone = svgElement.cloneNode(true) as SVGElement
    svg.appendChild(clone)

    // Serialize to string
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svg)
    
    // Create blob and download
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.download = filename
    link.href = url
    link.click()
    
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting SVG:', error)
    throw error
  }
}

/**
 * Export diagram data as JSON
 */
export function exportAsJSON(
  nodes: Node[],
  edges: Edge[],
  filename: string = 'diagram.json'
): void {
  try {
    const data = {
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    }

    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.download = filename
    link.href = url
    link.click()
    
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting JSON:', error)
    throw error
  }
}
