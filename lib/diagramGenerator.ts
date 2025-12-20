import type { DiagramData, DiagramType } from '@/types/diagram'

/**
 * Local diagram generator - no API required!
 * Analyzes prompt and generates diagram structure based on keywords and patterns
 */

export function generateDiagram(prompt: string): DiagramData {
  const lowerPrompt = prompt.toLowerCase()
  
  // Detect diagram type
  const type = detectDiagramType(lowerPrompt)
  
  // Generate nodes and edges based on type
  switch (type) {
    case 'flowchart':
      return generateFlowchart(prompt)
    case 'org_chart':
      return generateOrgChart(prompt)
    case 'decision_tree':
      return generateDecisionTree(prompt)
    case 'timeline':
      return generateTimeline(prompt)
    case 'architecture':
      return generateArchitecture(prompt)
    default:
      return generateFlowchart(prompt)
  }
}

function detectDiagramType(prompt: string): DiagramType {
  if (prompt.includes('timeline') || prompt.includes('chronolog') || prompt.includes('history')) {
    return 'timeline'
  }
  if (prompt.includes('org chart') || prompt.includes('organization') || prompt.includes('hierarchy') || prompt.includes('team')) {
    return 'org_chart'
  }
  if (prompt.includes('decision') || prompt.includes('choice') || prompt.includes('if')) {
    return 'decision_tree'
  }
  if (prompt.includes('architecture') || prompt.includes('system') || prompt.includes('microservice')) {
    return 'architecture'
  }
  return 'flowchart'
}

function generateFlowchart(prompt: string): DiagramData {
  const steps = extractSteps(prompt)
  
  const nodes = steps.map((step, i) => ({
    id: String(i + 1),
    label: step
  }))
  
  const edges = nodes.slice(0, -1).map((node, i) => ({
    from: node.id,
    to: String(i + 2)
  }))
  
  return { type: 'flowchart', nodes, edges }
}

function generateOrgChart(prompt: string): DiagramData {
  const nodes = [
    { id: '1', label: 'CEO' },
    { id: '2', label: 'CTO' },
    { id: '3', label: 'CFO' },
    { id: '4', label: 'COO' },
    { id: '5', label: 'Engineering' },
    { id: '6', label: 'Product' },
    { id: '7', label: 'Finance Team' },
    { id: '8', label: 'Operations' }
  ]
  
  const edges = [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '1', to: '4' },
    { from: '2', to: '5' },
    { from: '2', to: '6' },
    { from: '3', to: '7' },
    { from: '4', to: '8' }
  ]
  
  // Customize based on prompt keywords
  if (prompt.toLowerCase().includes('startup')) {
    nodes[0].label = 'Founder/CEO'
    nodes[5].label = 'Dev Team'
    nodes[6].label = 'Marketing'
  }
  
  return { type: 'org_chart', nodes, edges }
}

function generateDecisionTree(prompt: string): DiagramData {
  const nodes = [
    { id: '1', label: 'Start' },
    { id: '2', label: 'Evaluate Option A' },
    { id: '3', label: 'Evaluate Option B' },
    { id: '4', label: 'Choose A' },
    { id: '5', label: 'Choose B' },
    { id: '6', label: 'Result A' },
    { id: '7', label: 'Result B' }
  ]
  
  const edges = [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '4' },
    { from: '3', to: '5' },
    { from: '4', to: '6' },
    { from: '5', to: '7' }
  ]
  
  // Customize for cloud provider example
  if (prompt.toLowerCase().includes('cloud')) {
    nodes[0].label = 'Choose Cloud Provider'
    nodes[1].label = 'Need Flexibility?'
    nodes[2].label = 'Need Integration?'
    nodes[3].label = 'Yes - AWS'
    nodes[4].label = 'Yes - Azure'
    nodes[5].label = 'Use AWS'
    nodes[6].label = 'Use Azure'
  }
  
  return { type: 'decision_tree', nodes, edges }
}

function generateTimeline(prompt: string): DiagramData {
  const nodes = [
    { id: '1', label: '2010' },
    { id: '2', label: '2015' },
    { id: '3', label: '2020' },
    { id: '4', label: '2025' }
  ]
  
  const edges = [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' }
  ]
  
  // Customize for web development timeline
  if (prompt.toLowerCase().includes('web')) {
    nodes[0].label = '2010 - HTML5'
    nodes[1].label = '2015 - React'
    nodes[2].label = '2020 - Next.js'
    nodes[3].label = '2024 - AI Tools'
  }
  
  return { type: 'timeline', nodes, edges }
}

function generateArchitecture(prompt: string): DiagramData {
  const nodes = [
    { id: '1', label: 'Client' },
    { id: '2', label: 'API Gateway' },
    { id: '3', label: 'Auth Service' },
    { id: '4', label: 'User Service' },
    { id: '5', label: 'Database' },
    { id: '6', label: 'Cache' }
  ]
  
  const edges = [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '2', to: '4' },
    { from: '4', to: '5' },
    { from: '4', to: '6' }
  ]
  
  // Customize for e-commerce
  if (prompt.toLowerCase().includes('commerce') || prompt.toLowerCase().includes('shop')) {
    nodes[3].label = 'Product Service'
    nodes[4].label = 'Order Service'
    nodes.push({ id: '7', label: 'Payment Service' })
    edges.push({ from: '2', to: '7' })
  }
  
  return { type: 'architecture', nodes, edges }
}

function extractSteps(prompt: string): string[] {
  // Try to extract numbered steps or bullet points
  const steps: string[] = []
  
  // Look for common process keywords
  const processKeywords = ['login', 'signup', 'register', 'authenticate', 'verify', 'submit', 'process', 'complete']
  
  if (prompt.toLowerCase().includes('authentication') || prompt.toLowerCase().includes('login')) {
    return [
      'Start',
      'Enter Credentials',
      'Validate Input',
      'Check Database',
      'Generate Token',
      'Login Success'
    ]
  }
  
  if (prompt.toLowerCase().includes('checkout') || prompt.toLowerCase().includes('purchase')) {
    return [
      'Start',
      'Add to Cart',
      'Review Cart',
      'Enter Payment',
      'Process Payment',
      'Order Complete'
    ]
  }
  
  // Default generic process
  return [
    'Start',
    'Input Data',
    'Process',
    'Validate',
    'Complete'
  ]
}
