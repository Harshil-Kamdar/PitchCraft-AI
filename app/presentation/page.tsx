"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Home, Download, Play, Pause, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { PresentationSlide } from "@/components/presentation-slide"
import { ThemeProvider, useTheme, type Theme } from "@/components/theme-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Slide {
  id: number
  type: "title" | "content" | "chart" | "image" | "intro"
  title: string
  content?: string
  bulletPoints?: string[]
  chartData?: any
  imageUrl?: string
  imagePrompt?: string
  metrics?: Array<{ label: string; value: string; icon: string }>
}

function PresentationContent() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [direction, setDirection] = useState(0)
  const { theme, setTheme, themeConfig, themes } = useTheme()

  useEffect(() => {
    const presentationData = localStorage.getItem("presentationData")

    if (presentationData) {
      setSlides(JSON.parse(presentationData))
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoPlay && slides.length > 0) {
      interval = setInterval(() => {
        nextSlide()
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [isAutoPlay, currentSlide, slides.length])

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${themeConfig.background} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center ${themeConfig.textPrimary}`}
        >
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl">Loading your presentation...</div>
        </motion.div>
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${themeConfig.background} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center ${themeConfig.textPrimary}`}
        >
          <h2 className="text-2xl mb-4">No presentation found</h2>
          <Button onClick={() => (window.location.href = "/")} className="bg-purple-600 hover:bg-purple-700">
            <Home className="w-4 h-4 mr-2" />
            Create Presentation
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeConfig.background} relative overflow-hidden`}>
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-4 z-20"
      >
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
          className={`bg-white/10 ${themeConfig.border} ${themeConfig.textPrimary} hover:bg-white/20 backdrop-blur-lg`}
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 right-4 z-20 flex gap-2"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`bg-white/10 ${themeConfig.border} ${themeConfig.textPrimary} hover:bg-white/20 backdrop-blur-lg`}
            >
              <Palette className="w-4 h-4 mr-2" />
              {themeConfig.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-800 border-slate-700">
            {Object.entries(themes).map(([key, config]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setTheme(key as Theme)}
                className="text-white hover:bg-slate-700"
              >
                {config.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          variant="outline"
          className={`bg-white/10 ${themeConfig.border} ${themeConfig.textPrimary} hover:bg-white/20 backdrop-blur-lg`}
        >
          {isAutoPlay ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isAutoPlay ? "Pause" : "Auto"}
        </Button>
        <Button
          variant="outline"
          className={`bg-white/10 ${themeConfig.border} ${themeConfig.textPrimary} hover:bg-white/20 backdrop-blur-lg`}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </motion.div>

      {/* Slide Counter */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div
          className={`bg-white/10 backdrop-blur-lg rounded-full px-6 py-2 ${themeConfig.textPrimary} ${themeConfig.border}`}
        >
          <span className="font-semibold">{currentSlide + 1}</span>
          <span className={`${themeConfig.textSecondary} mx-2`}>/</span>
          <span className={themeConfig.textSecondary}>{slides.length}</span>
        </div>
      </motion.div>

      {/* Main Slide Area */}
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-6xl aspect-video relative">
          <AnimatePresence mode="wait" custom={direction}>
            <PresentationSlide key={currentSlide} slide={slides[currentSlide]} />
          </AnimatePresence>
        </div>
      </div>

      {/* Enhanced Navigation Controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6 z-20"
      >
        <Button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          variant="outline"
          size="icon"
          className={`bg-white/10 ${themeConfig.border} ${themeConfig.textPrimary} hover:bg-white/20 disabled:opacity-50 backdrop-blur-lg`}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Enhanced Slide Dots */}
        <div className={`flex gap-2 bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 ${themeConfig.border}`}>
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-purple-400 scale-125 shadow-lg shadow-purple-400/50"
                  : "bg-white/30 hover:bg-white/50 hover:scale-110"
              }`}
              whileHover={{ scale: index === currentSlide ? 1.25 : 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <Button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          variant="outline"
          size="icon"
          className={`bg-white/10 ${themeConfig.border} ${themeConfig.textPrimary} hover:bg-white/20 disabled:opacity-50 backdrop-blur-lg`}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Keyboard Navigation */}
      <div
        className="absolute inset-0 z-10"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === " ") {
            e.preventDefault()
            nextSlide()
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault()
            prevSlide()
          }
          if (e.key === "Escape") {
            setIsAutoPlay(false)
          }
        }}
        tabIndex={0}
      />
    </div>
  )
}

export default function PresentationPage() {
  return (
    <ThemeProvider>
      <PresentationContent />
    </ThemeProvider>
  )
}
