"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Theme = "dark" | "light" | "corporate" | "modern" | "vibrant"

interface ThemeConfig {
  name: string
  background: string
  cardBackground: string
  textPrimary: string
  textSecondary: string
  accent: string
  accentSecondary: string
  border: string
}

const themes: Record<Theme, ThemeConfig> = {
  dark: {
    name: "Dark",
    background: "from-slate-900 via-purple-900 to-slate-900",
    cardBackground: "from-slate-800/90 to-purple-900/90",
    textPrimary: "text-white",
    textSecondary: "text-gray-300",
    accent: "from-purple-400 to-blue-400",
    accentSecondary: "from-blue-400 to-purple-400",
    border: "border-white/10",
  },
  light: {
    name: "Light",
    background: "from-gray-50 via-blue-50 to-gray-50",
    cardBackground: "from-white/95 to-blue-50/95",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
    accent: "from-blue-600 to-purple-600",
    accentSecondary: "from-purple-600 to-blue-600",
    border: "border-gray-200",
  },
  corporate: {
    name: "Corporate",
    background: "from-slate-800 via-slate-700 to-slate-800",
    cardBackground: "from-slate-700/90 to-slate-600/90",
    textPrimary: "text-white",
    textSecondary: "text-slate-300",
    accent: "from-slate-400 to-slate-200",
    accentSecondary: "from-slate-200 to-slate-400",
    border: "border-slate-500/20",
  },
  modern: {
    name: "Modern",
    background: "from-indigo-900 via-cyan-900 to-indigo-900",
    cardBackground: "from-indigo-800/90 to-cyan-800/90",
    textPrimary: "text-white",
    textSecondary: "text-indigo-200",
    accent: "from-cyan-400 to-indigo-400",
    accentSecondary: "from-indigo-400 to-cyan-400",
    border: "border-cyan-500/20",
  },
  vibrant: {
    name: "Vibrant",
    background: "from-pink-900 via-orange-900 to-pink-900",
    cardBackground: "from-pink-800/90 to-orange-800/90",
    textPrimary: "text-white",
    textSecondary: "text-pink-200",
    accent: "from-orange-400 to-pink-400",
    accentSecondary: "from-pink-400 to-orange-400",
    border: "border-orange-500/20",
  },
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themeConfig: ThemeConfig
  themes: Record<Theme, ThemeConfig>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themeConfig: themes[theme],
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
