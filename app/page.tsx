"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Presentation, Sparkles, CheckCircle, AlertCircle, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

export default function HomePage() {
  const [text, setText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contentAnalysis, setContentAnalysis] = useState<{
    companyName?: string
    personnel?: number
    sections?: string[]
    numbers?: number
  } | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setError(null)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setText(content)
        analyzeContent(content)
        console.log("Business content loaded successfully")
      }
      reader.readAsText(uploadedFile)
    }
  }

  const analyzeContent = (content: string) => {
    // Enhanced content analysis
    const companyPatterns = [
      /(?:company|startup|business|firm)(?:\s+name)?(?:\s+is)?:\s*([A-Z][a-zA-Z0-9\s&.-]+?)(?:\s*[,.\n]|$)/i,
      /(?:we are|introducing|presenting|about)\s+([A-Z][a-zA-Z0-9\s&.-]+?)(?:\s*[,.\n]|$)/i,
      /\b([A-Z][a-zA-Z0-9\s&.-]+?)\s+(?:Inc\.?|LLC|Corp\.?|Ltd\.?|Limited|Company|Co\.?)\b/i,
      /^([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+){0,3})\s+(?:is|was|has|will|provides|offers|develops|creates|builds)/m,
    ]

    let companyName = undefined
    for (const pattern of companyPatterns) {
      const match = content.match(pattern)
      if (match && match[1]) {
        const name = match[1].trim()
        const excludeWords = ["The", "This", "Our", "We", "Company", "Business", "Startup", "Executive", "Summary"]
        if (!excludeWords.includes(name) && name.length > 2 && name.length < 50) {
          companyName = name
          break
        }
      }
    }

    const personnelCount = (content.match(/(?:CEO|CTO|CFO|COO|Founder|Co-founder|Director|Manager|Lead|Head)/gi) || [])
      .length

    const numberCount = (content.match(/\$\d+|\d+%|\d+\s+(?:users|customers|employees)/gi) || []).length

    const sections = []
    if (content.toLowerCase().includes("problem") || content.toLowerCase().includes("challenge"))
      sections.push("Problem/Challenge")
    if (content.toLowerCase().includes("solution") || content.toLowerCase().includes("product"))
      sections.push("Solution/Product")
    if (content.toLowerCase().includes("market") || content.toLowerCase().includes("industry")) sections.push("Market")
    if (content.toLowerCase().includes("team") || content.toLowerCase().includes("founder")) sections.push("Team")
    if (content.toLowerCase().includes("financial") || content.toLowerCase().includes("revenue"))
      sections.push("Financials")
    if (content.toLowerCase().includes("competition") || content.toLowerCase().includes("competitor"))
      sections.push("Competition")
    if (content.toLowerCase().includes("funding") || content.toLowerCase().includes("investment"))
      sections.push("Funding")

    setContentAnalysis({
      companyName,
      personnel: personnelCount,
      sections,
      numbers: numberCount,
    })
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    if (newText.length > 100) {
      analyzeContent(newText)
    } else {
      setContentAnalysis(null)
    }
  }

  const generatePresentation = async () => {
    if (!text.trim()) {
      setError("Please upload a business document or enter your business information")
      return
    }

    if (!contentAnalysis?.companyName) {
      setError("Please ensure your content includes a clear company or startup name")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      console.log("Creating professional presentation for:", contentAnalysis.companyName)

      const response = await fetch("/api/generate-presentation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to generate presentation: ${errorText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text()
        throw new Error(`Invalid response format: ${responseText}`)
      }

      const data = await response.json()
      console.log("Professional presentation created successfully")

      if (data.success) {
        localStorage.setItem("presentationData", JSON.stringify(data.presentation))
        localStorage.removeItem("presentationNote")

        window.location.href = "/presentation"
      } else {
        throw new Error(data.error || "Failed to generate presentation")
      }
    } catch (error) {
      console.error("Error generating presentation:", error)
      setError(error instanceof Error ? error.message : "Failed to generate presentation")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Presentation className="w-16 h-16 text-purple-400" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            PitchCraft AI
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your business information into a professional, investor-ready presentation with AI-powered content
            integration, real charts, and stunning visuals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* File Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Business Document
                  </h3>
                  <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      accept=".txt,.md,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300 mb-2">
                        {file ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            {file.name}
                          </span>
                        ) : (
                          "Upload your business plan, pitch deck, or company overview"
                        )}
                      </p>
                      <p className="text-sm text-gray-500">Supports .txt, .md, .doc, .docx files</p>
                    </label>
                  </div>
                  {file && (
                    <div className="text-sm text-green-400 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                      ✓ Business document loaded: {Math.round(file.size / 1024)}KB ready for processing
                    </div>
                  )}
                </div>

                {/* Text Input Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Or Enter Business Information</h3>
                  <Textarea
                    placeholder="Enter your business plan, company overview, product description, market analysis, team information, financial data, or any business content..."
                    value={text}
                    onChange={handleTextChange}
                    className="min-h-[200px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 resize-none"
                  />
                  {text && (
                    <div className="text-sm text-blue-400 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                      ✓ Business information ready: {text.length} characters loaded
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Content Analysis Feedback */}
              {contentAnalysis && (
                <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <h4 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Content Analysis
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400">Company:</span>{" "}
                        <span
                          className={`font-medium ${contentAnalysis.companyName ? "text-green-400" : "text-red-400"}`}
                        >
                          {contentAnalysis.companyName || "Not detected"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Team Members:</span>{" "}
                        <span
                          className={`font-medium ${contentAnalysis.personnel ? "text-green-400" : "text-yellow-400"}`}
                        >
                          {contentAnalysis.personnel ? `${contentAnalysis.personnel} detected` : "Not detected"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Business Sections:</span>{" "}
                        <span className="text-white font-medium">{contentAnalysis.sections?.length || 0} detected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Data Points:</span>{" "}
                        <span
                          className={`font-medium ${contentAnalysis.numbers ? "text-green-400" : "text-yellow-400"}`}
                        >
                          {contentAnalysis.numbers ? `${contentAnalysis.numbers} metrics` : "None detected"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {contentAnalysis.sections && contentAnalysis.sections.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {contentAnalysis.sections.map((section, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                          {section}
                        </span>
                      ))}
                    </div>
                  )}
                  {!contentAnalysis.companyName && (
                    <div className="mt-3 text-yellow-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Please include your company or startup name clearly in the content for best results.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="mt-8 text-center">
                <Button
                  onClick={generatePresentation}
                  disabled={!text.trim() || isProcessing || !contentAnalysis?.companyName}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Professional Presentation...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Create Investor Presentation
                      {contentAnalysis?.companyName && (
                        <span className="text-purple-200">for {contentAnalysis.companyName}</span>
                      )}
                    </div>
                  )}
                </Button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-400">
                Your business information will be seamlessly integrated with AI-generated images and real data charts
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            {
              icon: "🏢",
              title: "Company-Specific",
              description: "Accurately extracts and prominently features your company name throughout",
            },
            {
              icon: "🖼️",
              title: "AI-Generated Images",
              description: "Creates professional, relevant images using OpenAI's DALL-E for every slide",
            },
            {
              icon: "📊",
              title: "Real Data Charts",
              description: "Generates meaningful charts and graphs from your actual business metrics",
            },
          ].map((feature, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-lg border-white/20 text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
