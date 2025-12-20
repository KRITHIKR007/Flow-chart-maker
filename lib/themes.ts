// Theme configurations for diagrams

export interface Theme {
  name: string
  background: string
  nodeBackground: string
  nodeBorder: string
  nodeText: string
  edgeColor: string
  gridColor: string
  accentColor: string
}

export const themes: Record<string, Theme> = {
  classic: {
    name: 'Classic B&W',
    background: '#ffffff',
    nodeBackground: '#ffffff',
    nodeBorder: '#000000',
    nodeText: '#000000',
    edgeColor: '#000000',
    gridColor: '#e5e5e5',
    accentColor: '#000000',
  },
  modern: {
    name: 'Modern Blue',
    background: '#f8fafc',
    nodeBackground: '#ffffff',
    nodeBorder: '#3b82f6',
    nodeText: '#1e293b',
    edgeColor: '#3b82f6',
    gridColor: '#e2e8f0',
    accentColor: '#3b82f6',
  },
  dark: {
    name: 'Dark Mode',
    background: '#1e293b',
    nodeBackground: '#334155',
    nodeBorder: '#64748b',
    nodeText: '#f1f5f9',
    edgeColor: '#94a3b8',
    gridColor: '#475569',
    accentColor: '#60a5fa',
  },
  nature: {
    name: 'Nature Green',
    background: '#f0fdf4',
    nodeBackground: '#ffffff',
    nodeBorder: '#22c55e',
    nodeText: '#14532d',
    edgeColor: '#22c55e',
    gridColor: '#dcfce7',
    accentColor: '#16a34a',
  },
}

export type ThemeName = keyof typeof themes
