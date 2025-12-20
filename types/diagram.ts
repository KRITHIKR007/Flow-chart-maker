// Type definitions for diagram data structures

export type DiagramType = 'flowchart' | 'org_chart' | 'decision_tree' | 'timeline' | 'architecture';

export interface DiagramNode {
  id: string;
  label: string;
  // Position will be calculated automatically
  x?: number;
  y?: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
}

export interface DiagramData {
  type: DiagramType;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface GenerateDiagramRequest {
  prompt: string;
}

export interface GenerateDiagramResponse {
  success: boolean;
  data?: DiagramData;
  error?: string;
}
