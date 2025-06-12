"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Logo } from "./logo"
import { useTheme } from "./theme-provider"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { TrendingUp, Users, Shield, Globe, Rocket, DollarSign, Target, Zap, ImageIcon } from "lucide-react"

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

interface PresentationSlideProps {
  slide: Slide
}

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

// Icon mapping for string-based icon references
const iconMap = {
  DollarSign,
  TrendingUp,
  Target,
  Zap,
  Shield,
  Globe,
  Users,
  Rocket,
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 45 : -45,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? 45 : -45,
  }),
}

export function PresentationSlide({ slide }: PresentationSlideProps) {
  const { themeConfig } = useTheme()

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement
    console.log("Image failed to load:", img.src)
    // Replace with a more descriptive placeholder
    img.src = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(slide.title || "Image")}`
  }

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement
    console.log("Image loaded successfully:", img.src)
  }

  const renderSlideContent = () => {
    switch (slide.type) {
      case "intro":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center relative overflow-hidden">
            {/* Animated background particles */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
                  animate={{
                    x: [Math.random() * 1200, Math.random() * 1200],
                    y: [Math.random() * 800, Math.random() * 800],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative z-10"
            >
              <Logo size="lg" animated={true} />
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-8 space-y-6"
            >
              <h1 className={`text-7xl font-bold bg-gradient-to-r ${themeConfig.accent} bg-clip-text text-transparent`}>
                PitchCraft
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 1 }}
                className={`h-1 bg-gradient-to-r ${themeConfig.accent} rounded-full mx-auto max-w-md`}
              />
              <p className={`text-2xl ${themeConfig.textSecondary} max-w-2xl`}>
                {slide.content || "Transforming Ideas into Investment-Ready Presentations"}
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className={`mt-12 text-lg ${themeConfig.textSecondary}`}
            >
              Powered by AI • Built for Success
            </motion.div>
          </div>
        )

      case "title":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center relative">
            {/* Geometric background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute bottom-20 right-20 w-24 h-24 bg-blue-500/10 transform rotate-45"
                animate={{ scale: [1, 1.3, 1], rotate: [45, 225, 405] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8 relative z-10"
            >
              <div className="flex items-center justify-center mb-6">
                <Logo size="md" animated={true} />
              </div>
              <h1
                className={`text-6xl font-bold bg-gradient-to-r ${themeConfig.accent} bg-clip-text text-transparent mb-4`}
              >
                {slide.title}
              </h1>
              {slide.content && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className={`text-2xl ${themeConfig.textSecondary} max-w-3xl leading-relaxed`}
                >
                  {slide.content}
                </motion.p>
              )}
              {slide.imageUrl && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="mt-8"
                >
                  <img
                    src={slide.imageUrl || "/placeholder.svg"}
                    alt={slide.title}
                    className="max-h-64 mx-auto rounded-lg shadow-2xl"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    crossOrigin="anonymous"
                  />
                </motion.div>
              )}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex items-center justify-center gap-4 mt-8"
              >
                <div className={`w-16 h-1 bg-gradient-to-r ${themeConfig.accent} rounded-full`}></div>
                <div className={`w-8 h-8 bg-gradient-to-r ${themeConfig.accent} rounded-full`}></div>
                <div className={`w-16 h-1 bg-gradient-to-r ${themeConfig.accentSecondary} rounded-full`}></div>
              </motion.div>
            </motion.div>
          </div>
        )

      case "content":
        return (
          <div className="h-full p-12 relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full blur-3xl" />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <Logo size="sm" animated={false} />
                <h2
                  className={`text-4xl font-bold ${themeConfig.textPrimary} bg-gradient-to-r ${themeConfig.accent} bg-clip-text text-transparent`}
                >
                  {slide.title}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  {slide.content && (
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`text-xl ${themeConfig.textSecondary} mb-8 leading-relaxed`}
                    >
                      {slide.content}
                    </motion.p>
                  )}

                  {slide.bulletPoints && (
                    <div className="grid gap-4">
                      {slide.bulletPoints.map((point, index) => (
                        <motion.div
                          key={index}
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                          className={`flex items-start gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-lg ${themeConfig.border} hover:bg-white/10 transition-all`}
                        >
                          <div
                            className={`w-3 h-3 bg-gradient-to-r ${themeConfig.accent} rounded-full mt-2 flex-shrink-0`}
                          ></div>
                          <span className={`text-lg ${themeConfig.textSecondary}`}>{point}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {slide.imageUrl && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className={`bg-white/5 backdrop-blur-lg rounded-lg p-4 ${themeConfig.border} relative`}
                    >
                      <img
                        src={slide.imageUrl || "/placeholder.svg"}
                        alt={slide.title}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        crossOrigin="anonymous"
                      />
                      {slide.imageUrl.includes("placeholder.svg") && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                          <ImageIcon className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {slide.metrics && (
                    <div className="grid grid-cols-2 gap-4">
                      {slide.metrics.map((metric, index) => {
                        const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || DollarSign
                        return (
                          <motion.div
                            key={index}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                            className={`bg-white/5 backdrop-blur-lg rounded-lg p-4 text-center ${themeConfig.border}`}
                          >
                            <IconComponent className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                            <div className={`text-2xl font-bold ${themeConfig.textPrimary}`}>{metric.value}</div>
                            <div className={`text-sm ${themeConfig.textSecondary}`}>{metric.label}</div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )

      case "chart":
        return (
          <div className="h-full p-12 relative">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="h-full relative z-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <Logo size="sm" animated={false} />
                <h2
                  className={`text-4xl font-bold ${themeConfig.textPrimary} bg-gradient-to-r ${themeConfig.accent} bg-clip-text text-transparent`}
                >
                  {slide.title}
                </h2>
              </div>

              {slide.content && <p className={`text-lg ${themeConfig.textSecondary} mb-6`}>{slide.content}</p>}

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`h-96 bg-white/5 backdrop-blur-lg rounded-lg p-6 ${themeConfig.border} relative overflow-hidden`}
              >
                {/* Chart background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-xl" />

                <ResponsiveContainer width="100%" height="100%">
                  {slide.chartData?.type === "bar" && (
                    <BarChart data={slide.chartData.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="name" stroke="#ffffff80" />
                      <YAxis stroke="#ffffff80" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                      />
                      <Bar dataKey="value" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  )}
                  {slide.chartData?.type === "line" && (
                    <LineChart data={slide.chartData.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="name" stroke="#ffffff80" />
                      <YAxis stroke="#ffffff80" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        strokeWidth={4}
                        dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: "#06b6d4" }}
                      />
                    </LineChart>
                  )}
                  {slide.chartData?.type === "area" && (
                    <AreaChart data={slide.chartData.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="name" stroke="#ffffff80" />
                      <YAxis stroke="#ffffff80" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fill="url(#areaGradient)"
                        strokeWidth={3}
                      />
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  )}
                  {slide.chartData?.type === "pie" && (
                    <PieChart>
                      <Pie
                        data={slide.chartData.data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {slide.chartData.data.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                      />
                    </PieChart>
                  )}
                  {slide.chartData?.type === "radar" && (
                    <RadarChart data={slide.chartData.data}>
                      <PolarGrid stroke="#ffffff20" />
                      <PolarAngleAxis dataKey="subject" stroke="#ffffff80" />
                      <PolarRadiusAxis stroke="#ffffff40" />
                      <Radar
                        name="Score"
                        dataKey="A"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#ffffff",
                        }}
                      />
                    </RadarChart>
                  )}
                </ResponsiveContainer>
              </motion.div>
            </motion.div>
          </div>
        )

      case "image":
        return (
          <div className="h-full p-12 relative">
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-purple-500/5 to-blue-500/5 rounded-full blur-3xl" />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="h-full relative z-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <Logo size="sm" animated={false} />
                <h2
                  className={`text-4xl font-bold ${themeConfig.textPrimary} bg-gradient-to-r ${themeConfig.accent} bg-clip-text text-transparent`}
                >
                  {slide.title}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 h-96">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className={`bg-white/5 backdrop-blur-lg rounded-lg p-6 ${themeConfig.border} flex items-center justify-center relative overflow-hidden`}
                >
                  {slide.imageUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={slide.imageUrl || "/placeholder.svg"}
                        alt={slide.title}
                        className="max-h-full max-w-full object-contain rounded-lg mx-auto"
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                        crossOrigin="anonymous"
                      />
                      {slide.imageUrl.includes("placeholder.svg") && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                          <ImageIcon className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
                      <div className="relative z-10 text-center">
                        <div
                          className={`w-32 h-32 bg-gradient-to-r ${themeConfig.accent} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl`}
                        >
                          <ImageIcon className="w-16 h-16 text-white" />
                        </div>
                        <p className={`${themeConfig.textSecondary} text-lg`}>Professional Visual Content</p>
                      </div>
                    </>
                  )}
                </motion.div>

                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex flex-col justify-center space-y-6"
                >
                  {slide.content && (
                    <p className={`text-lg ${themeConfig.textSecondary} leading-relaxed`}>{slide.content}</p>
                  )}

                  {slide.metrics && (
                    <div className="grid grid-cols-2 gap-4">
                      {slide.metrics.map((metric, index) => {
                        const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || Globe
                        return (
                          <motion.div
                            key={index}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                            className={`bg-white/5 backdrop-blur-lg rounded-lg p-4 text-center ${themeConfig.border}`}
                          >
                            <IconComponent className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <div className={`text-lg font-bold ${themeConfig.textPrimary}`}>{metric.value}</div>
                            <div className={`text-xs ${themeConfig.textSecondary}`}>{metric.label}</div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.4 },
        rotateY: { duration: 0.4 },
      }}
      className="w-full h-full"
    >
      <Card
        className={`w-full h-full bg-gradient-to-br ${themeConfig.cardBackground} backdrop-blur-lg ${themeConfig.border} shadow-2xl overflow-hidden`}
      >
        <CardContent className="p-0 h-full relative">
          {/* Enhanced background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500"></div>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full">{renderSlideContent()}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
