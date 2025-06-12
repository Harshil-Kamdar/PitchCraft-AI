import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompts } = await request.json()

    if (!prompts || !Array.isArray(prompts)) {
      return NextResponse.json({ success: false, error: "Invalid prompts array" }, { status: 400 })
    }

    console.log("Generating images for prompts:", prompts)

    try {
      // Generate images using DALL-E
      const imagePromises = prompts.map(async (prompt: string, index: number) => {
        try {
          console.log(`Generating image ${index + 1}:`, prompt)

          const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Professional business presentation image: ${prompt}. Clean, modern, corporate style with high quality and professional lighting. Suitable for investor presentation.`,
            size: "1024x1024",
            quality: "standard",
            n: 1,
          })

          const imageUrl = response.data[0]?.url
          console.log(`Image ${index + 1} generated:`, imageUrl ? "Success" : "Failed")
          return imageUrl
        } catch (error) {
          console.error(`Failed to generate image ${index + 1}:`, error)
          return null
        }
      })

      const imageUrls = await Promise.all(imagePromises)
      const successfulImages = imageUrls.filter(Boolean)

      console.log(`Generated ${successfulImages.length} out of ${prompts.length} images`)

      if (successfulImages.length > 0) {
        return NextResponse.json({
          success: true,
          images: imageUrls.map((url, index) => url || `/placeholder.svg?height=400&width=600&text=Image+${index + 1}`),
        })
      } else {
        throw new Error("No images were generated successfully")
      }
    } catch (aiError: any) {
      console.log("DALL-E unavailable, using placeholder images:", aiError.message)

      // Fallback to enhanced placeholder images
      const placeholderImages = prompts.map((prompt: string, index: number) => {
        const encodedPrompt = encodeURIComponent(prompt.substring(0, 50))
        return `/placeholder.svg?height=400&width=600&text=${encodedPrompt}`
      })

      return NextResponse.json({
        success: true,
        images: placeholderImages,
        note: "Using placeholder images. DALL-E integration will work when API quota is available.",
      })
    }
  } catch (error) {
    console.error("Error in image generation API:", error)
    return NextResponse.json({ success: false, error: "Failed to generate images" }, { status: 500 })
  }
}
