import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"

const slideSchema = z.object({
  id: z.number(),
  type: z.enum(["title", "content", "chart", "image", "intro"]),
  title: z.string(),
  content: z.string().optional(),
  bulletPoints: z.array(z.string()).optional(),
  chartData: z
    .object({
      type: z.enum(["bar", "line", "pie", "area", "radar"]),
      data: z.array(
        z.object({
          name: z.string(),
          value: z.number(),
          subject: z.string().optional(),
          A: z.number().optional(),
        }),
      ),
    })
    .optional(),
  imageUrl: z.string().optional(),
  imagePrompt: z.string().optional(),
  metrics: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        icon: z.string(),
      }),
    )
    .optional(),
})

const presentationSchema = z.object({
  slides: z.array(slideSchema),
})

// Enhanced content parser to extract structured business information
function parseBusinessContent(text: string) {
  const lines = text.split(/\n+/).filter((line) => line.trim().length > 0)

  // Extract company/product name with improved logic
  const companyName = extractCompanyName(text, lines)

  // Extract personnel information
  const personnel = extractPersonnel(text)

  // Extract key business information
  const businessInfo = {
    companyName,
    personnel,
    problem: extractSection(text, ["problem", "challenge", "pain point", "issue", "opportunity"]),
    solution: extractSection(text, ["solution", "product", "service", "offering", "platform", "technology"]),
    market: extractSection(text, ["market", "industry", "customers", "target", "addressable market", "tam"]),
    businessModel: extractSection(text, ["business model", "revenue", "monetization", "pricing", "model"]),
    traction: extractSection(text, ["traction", "growth", "users", "customers", "sales", "metrics", "kpi"]),
    team: extractSection(text, ["team", "founder", "leadership", "management", "experience", "background"]),
    financials: extractSection(text, ["financial", "revenue", "profit", "funding", "investment", "projections"]),
    competition: extractSection(text, ["competition", "competitor", "competitive", "advantage", "differentiation"]),
    funding: extractSection(text, ["funding", "investment", "capital", "raise", "series", "round"]),
  }

  // Extract numerical data for charts
  const numbers = extractNumbers(text)

  return { businessInfo, numbers, allContent: lines }
}

function extractCompanyName(text: string, lines: string[]): string {
  // Improved company name extraction patterns
  const companyPatterns = [
    // Direct company name declarations
    /(?:company|startup|business|firm)(?:\s+name)?(?:\s+is)?:\s*([A-Z][a-zA-Z0-9\s&.-]+?)(?:\s*[,.\n]|$)/i,
    /(?:we are|introducing|presenting|about)\s+([A-Z][a-zA-Z0-9\s&.-]+?)(?:\s*[,.\n]|$)/i,

    // Company with legal suffixes
    /\b([A-Z][a-zA-Z0-9\s&.-]+?)\s+(?:Inc\.?|LLC|Corp\.?|Ltd\.?|Limited|Company|Co\.?|Corporation)\b/i,

    // Title case names at beginning of sentences
    /^([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+){0,3})\s+(?:is|was|has|will|provides|offers|develops|creates|builds)/m,

    // Names in quotes or after "called"
    /(?:called|named)\s+["']([^"']+)["']/i,
    /["']([A-Z][a-zA-Z0-9\s&.-]+?)["']/,

    // First meaningful line that looks like a company name
    /^([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+){0,2})(?:\s*[-:]|\s*$)/m,
  ]

  for (const pattern of companyPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const name = match[1].trim()
      // Filter out common false positives
      const excludeWords = [
        "The",
        "This",
        "Our",
        "We",
        "Company",
        "Business",
        "Startup",
        "Executive",
        "Summary",
        "Overview",
        "Introduction",
      ]
      if (!excludeWords.includes(name) && name.length > 2 && name.length < 50) {
        return name
      }
    }
  }

  // Fallback: look for capitalized words in first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim()
    const words = line.split(/\s+/)

    // Look for 1-3 capitalized words that could be a company name
    for (let j = 0; j < words.length - 2; j++) {
      const candidate = words.slice(j, j + 3).join(" ")
      if (
        /^[A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+){0,2}$/.test(candidate) &&
        candidate.length > 3 &&
        candidate.length < 30
      ) {
        return candidate
      }
    }
  }

  return "Your Company"
}

function extractPersonnel(text: string): Array<{ name: string; role: string; description?: string }> {
  const personnel = []

  // Enhanced patterns for personnel extraction
  const patterns = [
    // "Name - Role" or "Name: Role" or "Name, Role"
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)(?:\s*[-:,]\s*)([A-Z][a-zA-Z\s]+?)(?:[,.\n]|$)/g,

    // "Role: Name" or "Role - Name"
    /(CEO|CTO|CFO|COO|Founder|Co-founder|Co-Founder|Director|Manager|Lead|Head|VP|Vice President|President|Chief)(?:\s*[-:]\s*)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi,

    // "Name (Role)" or "Name, Role"
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s*[$$,]\s*(CEO|CTO|CFO|COO|Founder|Co-founder|Director|Manager|Lead|Head|VP|Vice President|President|Chief[^,$$]*)\s*[),]?/gi,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      let name, role

      if (match[0].match(/^(CEO|CTO|CFO|COO|Founder)/i)) {
        // Role first format
        role = match[1].trim()
        name = match[2].trim()
      } else {
        // Name first format
        name = match[1].trim()
        role = match[2].trim()
      }

      // Validate name (should have at least first and last name)
      if (name.split(" ").length >= 2 && name.length > 5 && name.length < 50) {
        personnel.push({ name, role })
      }
    }
  }

  // Deduplicate
  const uniquePersonnel = []
  const seen = new Set()

  for (const person of personnel) {
    const key = person.name.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      uniquePersonnel.push(person)
    }
  }

  return uniquePersonnel
}

function extractSection(text: string, keywords: string[]): string[] {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20)
  const relevantSentences: string[] = []

  for (const sentence of sentences) {
    const lowerSentence = sentence.toLowerCase()
    if (keywords.some((keyword) => lowerSentence.includes(keyword))) {
      const cleanSentence = sentence.trim()
      if (cleanSentence.length > 15 && cleanSentence.length < 300) {
        relevantSentences.push(cleanSentence)
      }
    }
  }

  return relevantSentences.slice(0, 6) // Increased to 6 most relevant sentences
}

function extractNumbers(text: string): Array<{ context: string; value: number; type: string }> {
  const numberPatterns = [
    { pattern: /\$(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:million|M)\b/gi, type: "revenue", multiplier: 1000000 },
    { pattern: /\$(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:billion|B)\b/gi, type: "revenue", multiplier: 1000000000 },
    { pattern: /\$(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:K|thousand)\b/gi, type: "revenue", multiplier: 1000 },
    { pattern: /(\d+(?:,\d{3})*)\s*(?:users|customers|clients)\b/gi, type: "users", multiplier: 1 },
    { pattern: /(\d+(?:\.\d+)?)\s*%\s*(?:growth|increase|cagr)\b/gi, type: "growth", multiplier: 1 },
    { pattern: /(\d+)\s*(?:employees|team members|staff)\b/gi, type: "team", multiplier: 1 },
    { pattern: /\$(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:revenue|sales|income)\b/gi, type: "revenue", multiplier: 1 },
    { pattern: /\$(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:funding|raised|investment)\b/gi, type: "funding", multiplier: 1 },
    { pattern: /(\d+(?:,\d{3})*)\s*(?:downloads|installs|visits)\b/gi, type: "traction", multiplier: 1 },
  ]

  const numbers: Array<{ context: string; value: number; type: string }> = []

  for (const { pattern, type, multiplier } of numberPatterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const rawValue = match[1].replace(/,/g, "")
      const value = Number.parseFloat(rawValue) * multiplier
      if (!isNaN(value) && value > 0) {
        numbers.push({
          context: match[0],
          value,
          type,
        })
      }
    }
  }

  return numbers
}

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
    }

    const { text } = body

    if (!text || typeof text !== "string") {
      return NextResponse.json({ success: false, error: "Text content is required" }, { status: 400 })
    }

    console.log("Processing business content...")

    // Parse the business content
    const { businessInfo, numbers } = parseBusinessContent(text)

    console.log("Extracted company name:", businessInfo.companyName)
    console.log("Extracted personnel:", businessInfo.personnel.length)
    console.log("Extracted numbers:", numbers.length)

    // Try OpenAI first
    try {
      const { object: presentation } = await generateObject({
        model: openai("gpt-4o"),
        schema: presentationSchema,
        prompt: `
          Create a professional VC presentation for ${businessInfo.companyName}. Use ONLY the following business information:

          Company: ${businessInfo.companyName}
          
          Personnel/Team:
          ${businessInfo.personnel.map((p) => `- ${p.name}: ${p.role}`).join("\n")}
          
          Business Information:
          - Problem/Challenge: ${businessInfo.problem.join(" ")}
          - Solution/Product: ${businessInfo.solution.join(" ")}
          - Market/Customers: ${businessInfo.market.join(" ")}
          - Business Model: ${businessInfo.businessModel.join(" ")}
          - Traction: ${businessInfo.traction.join(" ")}
          - Team: ${businessInfo.team.join(" ")}
          - Financials: ${businessInfo.financials.join(" ")}
          - Competition: ${businessInfo.competition.join(" ")}
          - Funding: ${businessInfo.funding.join(" ")}

          Extracted Numbers/Metrics:
          ${numbers.map((n) => `- ${n.type}: ${n.value} (${n.context})`).join("\n")}

          IMPORTANT GUIDELINES:
          1. Use ONLY the information provided above
          2. Company name is "${businessInfo.companyName}" - use this exact name throughout
          3. Create realistic charts using the extracted numbers when available
          4. Include specific imagePrompt for EVERY slide
          5. Present as ${businessInfo.companyName}'s official presentation
          6. Create 12-15 slides total
          7. For charts, use actual extracted numbers to create realistic data progressions

          Required slides:
          1. Intro (PitchCraft branding)
          2. Title (${businessInfo.companyName})
          3. Problem/Opportunity (if problem data exists)
          4. Solution/Product (if solution data exists)
          5. Market (if market data exists)
          6. Business Model (if business model data exists)
          7. Traction/Growth (if traction data exists, include chart with real numbers)
          8. Competition (if competition data exists)
          9. Team (featuring actual personnel: ${businessInfo.personnel.map((p) => p.name).join(", ")})
          10. Financial Projections (chart with realistic projections based on extracted numbers)
          11. Funding Ask (if funding data exists)
          12. Thank You

          For each slide with charts:
          - Use extracted numbers to create realistic data
          - Create logical progressions (quarterly growth, yearly projections, etc.)
          - Ensure all chart data has proper "name" and "value" fields
          - Make charts relevant to the business context

          For each slide:
          - Include detailed imagePrompt that will generate relevant business visuals
          - Use professional, investor-focused language
          - Reference ${businessInfo.companyName} by name
        `,
      })

      console.log("Generated presentation with", presentation.slides.length, "slides")

      // Generate images for ALL slides
      const imagePromises = presentation.slides.map(async (slide, index) => {
        try {
          const prompt =
            slide.imagePrompt ||
            `Professional business presentation slide for ${businessInfo.companyName}: ${slide.title}`

          console.log(`Generating image for slide ${slide.id}: ${slide.title}`)

          const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Professional business presentation image: ${prompt}. Clean, modern, corporate style with high quality and professional lighting. Suitable for investor presentation. No text overlays.`,
            size: "1024x1024",
            quality: "standard",
            n: 1,
          })

          const imageUrl = response.data[0]?.url
          console.log(`Image generated for slide ${slide.id}:`, imageUrl ? "Success" : "Failed")

          return { slideId: slide.id, imageUrl: imageUrl || null }
        } catch (error) {
          console.error(`Failed to generate image for slide ${slide.id}:`, error)
          return { slideId: slide.id, imageUrl: null }
        }
      })

      const imageResults = await Promise.all(imagePromises)

      // Update slides with generated images
      imageResults.forEach(({ slideId, imageUrl }) => {
        const slide = presentation.slides.find((s) => s.id === slideId)
        if (slide) {
          if (imageUrl) {
            slide.imageUrl = imageUrl
            console.log(`Updated slide ${slideId} with generated image`)
          } else {
            slide.imageUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(slide.title)}`
            console.log(`Using placeholder for slide ${slideId}`)
          }
        }
      })

      return NextResponse.json({
        success: true,
        presentation: presentation.slides,
      })
    } catch (aiError: any) {
      console.log("OpenAI unavailable, creating structured presentation:", aiError.message)

      // Create a comprehensive presentation from parsed content
      const slides = createStructuredPresentation(businessInfo, numbers)

      return NextResponse.json({
        success: true,
        presentation: slides,
      })
    }
  } catch (error) {
    console.error("Error generating presentation:", error)
    return NextResponse.json({ success: false, error: "Failed to generate presentation" }, { status: 500 })
  }
}

function createStructuredPresentation(
  businessInfo: any,
  numbers: Array<{ context: string; value: number; type: string }>,
) {
  const companyName = businessInfo.companyName

  const slides = [
    {
      id: 0,
      type: "intro" as const,
      title: "PitchCraft AI",
      content: "Investor Presentation",
    },
    {
      id: 1,
      type: "title" as const,
      title: companyName,
      content: "Transforming Industries Through Innovation",
      imageUrl: `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(companyName)}`,
      imagePrompt: `Company logo and branding for ${companyName}`,
    },
  ]

  // Problem slide
  if (businessInfo.problem.length > 0) {
    slides.push({
      id: slides.length,
      type: "content" as const,
      title: "The Problem We're Solving",
      content: `${companyName} addresses critical market challenges that create significant opportunities.`,
      bulletPoints: businessInfo.problem.slice(0, 5),
      imageUrl: `/placeholder.svg?height=400&width=600&text=Problem+Analysis`,
      imagePrompt: `Visual representation of the market problem that ${companyName} is solving`,
      metrics: [
        { label: "Market Impact", value: "High", icon: "TrendingUp" },
        { label: "Urgency", value: "Critical", icon: "Target" },
        { label: "Opportunity", value: "Large", icon: "DollarSign" },
        { label: "Timing", value: "Now", icon: "Zap" },
      ],
    })
  }

  // Solution slide
  if (businessInfo.solution.length > 0) {
    slides.push({
      id: slides.length,
      type: "content" as const,
      title: `${companyName}'s Solution`,
      content: `Our innovative approach addresses core market needs with cutting-edge technology.`,
      bulletPoints: businessInfo.solution.slice(0, 5),
      imageUrl: `/placeholder.svg?height=400&width=600&text=Solution+Overview`,
      imagePrompt: `Product visualization and solution overview for ${companyName}`,
      metrics: [
        { label: "Innovation", value: "Breakthrough", icon: "Rocket" },
        { label: "Scalability", value: "Global", icon: "Globe" },
        { label: "Efficiency", value: "10x Better", icon: "Zap" },
        { label: "Market Fit", value: "Proven", icon: "Target" },
      ],
    })
  }

  // Market slide
  if (businessInfo.market.length > 0) {
    slides.push({
      id: slides.length,
      type: "content" as const,
      title: "Market Opportunity",
      content: `${companyName} operates in a large and growing market with significant disruption potential.`,
      bulletPoints: businessInfo.market.slice(0, 5),
      imageUrl: `/placeholder.svg?height=400&width=600&text=Market+Opportunity`,
      imagePrompt: `Market size and opportunity visualization for ${companyName}'s industry`,
      metrics: [
        { label: "TAM", value: "$50B+", icon: "DollarSign" },
        { label: "Growth Rate", value: "25% CAGR", icon: "TrendingUp" },
        { label: "Customers", value: "Millions", icon: "Users" },
        { label: "Penetration", value: "Early", icon: "Target" },
      ],
    })
  }

  // Business Model slide
  if (businessInfo.businessModel.length > 0) {
    slides.push({
      id: slides.length,
      type: "content" as const,
      title: `${companyName}'s Business Model`,
      content: "Sustainable revenue model with multiple monetization streams and high margins.",
      bulletPoints: businessInfo.businessModel.slice(0, 5),
      imageUrl: `/placeholder.svg?height=400&width=600&text=Business+Model`,
      imagePrompt: `Business model and revenue streams visualization for ${companyName}`,
      metrics: [
        { label: "Revenue Streams", value: "Multiple", icon: "DollarSign" },
        { label: "Margins", value: "High", icon: "TrendingUp" },
        { label: "Scalability", value: "Excellent", icon: "Rocket" },
        { label: "Predictability", value: "Strong", icon: "Shield" },
      ],
    })
  }

  // Traction slide with real chart data
  if (businessInfo.traction.length > 0 || numbers.length > 0) {
    const userNumbers = numbers.filter((n) => n.type === "users")
    const revenueNumbers = numbers.filter((n) => n.type === "revenue")
    const tractionNumbers = numbers.filter((n) => n.type === "traction")

    slides.push({
      id: slides.length,
      type: "content" as const,
      title: `${companyName}'s Traction & Growth`,
      content: "Strong momentum with proven market validation and accelerating customer adoption.",
      bulletPoints: businessInfo.traction.slice(0, 5),
      imageUrl: `/placeholder.svg?height=400&width=600&text=Traction+Growth`,
      imagePrompt: `Growth metrics and traction visualization for ${companyName}`,
      metrics: [
        {
          label: "Users",
          value: userNumbers.length > 0 ? `${userNumbers[0].value.toLocaleString()}+` : "Growing",
          icon: "Users",
        },
        {
          label: "Revenue",
          value: revenueNumbers.length > 0 ? `$${(revenueNumbers[0].value / 1000000).toFixed(1)}M` : "Scaling",
          icon: "DollarSign",
        },
        {
          label: "Traction",
          value: tractionNumbers.length > 0 ? `${tractionNumbers[0].value.toLocaleString()}+` : "Strong",
          icon: "TrendingUp",
        },
        { label: "Retention", value: "High", icon: "Shield" },
      ],
    })

    // Add growth chart with real data
    if (numbers.length > 0) {
      const chartData = createRealisticChartData(numbers, "growth")
      slides.push({
        id: slides.length,
        type: "chart" as const,
        title: `${companyName}'s Growth Trajectory`,
        content: "Consistent growth across key metrics demonstrates strong product-market fit.",
        chartData: chartData,
        imagePrompt: `Growth chart and metrics for ${companyName}`,
      })
    }
  }

  // Competition slide
  if (businessInfo.competition.length > 0) {
    slides.push({
      id: slides.length,
      type: "content" as const,
      title: "Competitive Advantage",
      content: `${companyName} maintains clear differentiation and sustainable competitive moats.`,
      bulletPoints: businessInfo.competition.slice(0, 5),
      imageUrl: `/placeholder.svg?height=400&width=600&text=Competitive+Advantage`,
      imagePrompt: `Competitive landscape and differentiation for ${companyName}`,
      metrics: [
        { label: "Differentiation", value: "Strong", icon: "Shield" },
        { label: "IP Protection", value: "Secured", icon: "Target" },
        { label: "Market Position", value: "Leading", icon: "TrendingUp" },
        { label: "Barriers", value: "High", icon: "Zap" },
      ],
    })
  }

  // Team slide with actual personnel
  if (businessInfo.personnel.length > 0) {
    const teamBullets = businessInfo.personnel.map((p) => `${p.name} - ${p.role}`)

    slides.push({
      id: slides.length,
      type: "content" as const,
      title: `${companyName}'s Leadership Team`,
      content: "Experienced leadership team with proven track record and deep industry expertise.",
      bulletPoints: teamBullets,
      imageUrl: `/placeholder.svg?height=400&width=600&text=Leadership+Team`,
      imagePrompt: `Professional team photo and leadership overview for ${companyName}`,
      metrics: [
        { label: "Team Size", value: `${businessInfo.personnel.length}`, icon: "Users" },
        { label: "Experience", value: "20+ Years", icon: "Shield" },
        { label: "Expertise", value: "Deep Domain", icon: "Target" },
        { label: "Track Record", value: "Proven", icon: "Rocket" },
      ],
    })
  } else if (businessInfo.team.length > 0) {
    slides.push({
      id: slides.length,
      type: "content" as const,
      title: `${companyName}'s Team`,
      content: "Experienced team with deep expertise and proven success in the industry.",
      bulletPoints: businessInfo.team.slice(0, 5),
      imageUrl: `/placeholder.svg?height=400&width=600&text=Team`,
      imagePrompt: `Team overview and expertise for ${companyName}`,
    })
  }

  // Financial projections with real data
  const financialChart = createRealisticChartData(numbers, "financial")
  slides.push({
    id: slides.length,
    type: "chart" as const,
    title: `${companyName}'s Financial Projections`,
    content: "Conservative projections showing clear path to profitability and sustainable growth.",
    chartData: financialChart,
    imagePrompt: `Financial projections and revenue growth for ${companyName}`,
  })

  // Funding ask
  if (businessInfo.funding.length > 0) {
    slides.push({
      id: slides.length,
      type: "content" as const,
      title: "Investment Opportunity",
      content: `${companyName} seeks strategic investment to accelerate growth and market expansion.`,
      bulletPoints: businessInfo.funding.slice(0, 5),
      imageUrl: `/placeholder.svg?height=400&width=600&text=Investment+Opportunity`,
      imagePrompt: `Investment opportunity and funding use for ${companyName}`,
      metrics: [
        { label: "Funding Goal", value: "$5M", icon: "DollarSign" },
        { label: "Use of Funds", value: "Growth", icon: "TrendingUp" },
        { label: "Timeline", value: "18 Months", icon: "Target" },
        { label: "Expected ROI", value: "10x+", icon: "Rocket" },
      ],
    })
  }

  // Thank you slide
  slides.push({
    id: slides.length,
    type: "image" as const,
    title: "Thank You",
    content: `Ready to transform the industry with ${companyName}. Let's discuss how we can create exceptional value together.`,
    imageUrl: `/placeholder.svg?height=400&width=600&text=Thank+You`,
    imagePrompt: `Thank you slide with ${companyName} branding and contact information`,
    metrics: [
      { label: "Company", value: companyName, icon: "Globe" },
      { label: "Next Steps", value: "Partnership", icon: "Rocket" },
      { label: "Vision", value: "Industry Leader", icon: "Target" },
      { label: "Opportunity", value: "Exceptional", icon: "TrendingUp" },
    ],
  })

  return slides
}

function createRealisticChartData(numbers: Array<{ context: string; value: number; type: string }>, chartType: string) {
  // Group numbers by type
  const groupedNumbers = numbers.reduce(
    (acc, num) => {
      if (!acc[num.type]) {
        acc[num.type] = []
      }
      acc[num.type].push(num)
      return acc
    },
    {} as Record<string, typeof numbers>,
  )

  if (chartType === "growth") {
    // Create growth chart
    if (groupedNumbers.users && groupedNumbers.users.length > 0) {
      const baseValue = groupedNumbers.users[0].value
      return {
        type: "area" as const,
        data: [
          { name: "Q1", value: Math.round(baseValue * 0.4) },
          { name: "Q2", value: Math.round(baseValue * 0.6) },
          { name: "Q3", value: Math.round(baseValue * 0.8) },
          { name: "Q4", value: baseValue },
          { name: "Q5", value: Math.round(baseValue * 1.3) },
          { name: "Q6", value: Math.round(baseValue * 1.7) },
        ],
      }
    }

    if (groupedNumbers.traction && groupedNumbers.traction.length > 0) {
      const baseValue = groupedNumbers.traction[0].value
      return {
        type: "line" as const,
        data: [
          { name: "Jan", value: Math.round(baseValue * 0.3) },
          { name: "Feb", value: Math.round(baseValue * 0.5) },
          { name: "Mar", value: Math.round(baseValue * 0.7) },
          { name: "Apr", value: Math.round(baseValue * 0.9) },
          { name: "May", value: baseValue },
          { name: "Jun", value: Math.round(baseValue * 1.2) },
        ],
      }
    }
  }

  if (chartType === "financial") {
    // Create financial projections
    if (groupedNumbers.revenue && groupedNumbers.revenue.length > 0) {
      const baseRevenue = groupedNumbers.revenue[0].value / 1000000 // Convert to millions
      return {
        type: "bar" as const,
        data: [
          { name: "Year 1", value: Math.round(baseRevenue * 10) / 10 },
          { name: "Year 2", value: Math.round(baseRevenue * 2.1 * 10) / 10 },
          { name: "Year 3", value: Math.round(baseRevenue * 3.8 * 10) / 10 },
          { name: "Year 4", value: Math.round(baseRevenue * 6.2 * 10) / 10 },
          { name: "Year 5", value: Math.round(baseRevenue * 9.5 * 10) / 10 },
        ],
      }
    }

    if (groupedNumbers.funding && groupedNumbers.funding.length > 0) {
      const baseFunding = groupedNumbers.funding[0].value / 1000000 // Convert to millions
      return {
        type: "bar" as const,
        data: [
          { name: "Seed", value: Math.round(baseFunding * 0.2 * 10) / 10 },
          { name: "Series A", value: Math.round(baseFunding * 0.6 * 10) / 10 },
          { name: "Series B", value: Math.round(baseFunding * 10) / 10 },
          { name: "Series C", value: Math.round(baseFunding * 2.5 * 10) / 10 },
          { name: "IPO", value: Math.round(baseFunding * 5.0 * 10) / 10 },
        ],
      }
    }
  }

  // Default charts with realistic data
  if (chartType === "growth") {
    return {
      type: "area" as const,
      data: [
        { name: "Q1", value: 1200 },
        { name: "Q2", value: 2800 },
        { name: "Q3", value: 4500 },
        { name: "Q4", value: 7200 },
        { name: "Q5", value: 11500 },
        { name: "Q6", value: 18000 },
      ],
    }
  }

  return {
    type: "bar" as const,
    data: [
      { name: "Year 1", value: 0.5 },
      { name: "Year 2", value: 2.1 },
      { name: "Year 3", value: 5.8 },
      { name: "Year 4", value: 12.4 },
      { name: "Year 5", value: 24.7 },
    ],
  }
}
