// Global app theme (light/dark mode)

export type AppTheme = 'light' | 'dark'

export interface AppThemeColors {
  background: string
  text: string
  border: string
  cardBackground: string
  buttonBackground: string
  buttonText: string
  inputBackground: string
  inputBorder: string
}

export const appThemes: Record<AppTheme, AppThemeColors> = {
  light: {
    background: '#ffffff',
    text: '#000000',
    border: '#e5e5e5',
    cardBackground: '#ffffff',
    buttonBackground: '#000000',
    buttonText: '#ffffff',
    inputBackground: '#ffffff',
    inputBorder: '#000000',
  },
  dark: {
    background: '#0f172a',
    text: '#f1f5f9',
    border: '#334155',
    cardBackground: '#1e293b',
    buttonBackground: '#3b82f6',
    buttonText: '#ffffff',
    inputBackground: '#1e293b',
    inputBorder: '#475569',
  },
}
