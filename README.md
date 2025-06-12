# PitchCraft AI - Professional Presentation Generator

Transform your business information into stunning, investor-ready presentations with AI-powered content integration, real charts, and beautiful visuals.

![PitchCraft AI](https://img.shields.io/badge/PitchCraft-AI%20Powered-blue?style=for-the-badge&logo=openai)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## Features

- **AI-Powered Content Analysis**: Automatically extracts company information, personnel, and key business metrics from your documents
- **Professional Presentation Generation**: Creates structured, investor-ready presentations with proper flow
- **Interactive Charts**: Generates realistic charts and visualizations based on your business data
- **Multiple Themes**: Choose from various professional presentation themes
- **Real-time Preview**: View and navigate through your presentation with smooth animations
- **Auto-play Mode**: Present automatically with timed transitions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Export Functionality**: Download your presentations for offline use

## What It Does

PitchCraft AI analyzes your business documents (pitch decks, business plans, executive summaries) and automatically generates professional presentations that include:

- **Company Overview**: Extracts and highlights your company name and key information
- **Problem/Solution**: Identifies and structures your value proposition
- **Market Analysis**: Creates market opportunity slides with relevant data
- **Business Model**: Visualizes your revenue streams and business model
- **Team Information**: Highlights key personnel and their roles
- **Financial Projections**: Generates charts for revenue, growth, and financial metrics
- **Competitive Analysis**: Structures competitive landscape information
- **Funding Requirements**: Creates investment ask slides

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI, shadcn/ui
- **AI Integration**: OpenAI API, AI SDK
- **Charts**: Recharts
- **Form Handling**: React Hook Form, Zod validation
- **Icons**: Lucide React

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VCPresMaker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

### 1. Upload Your Business Document
- Click "Upload Business Document" to select a text file containing your business information
- Or paste your business content directly into the text area
- The system will automatically analyze your content and extract key information

### 2. Review Content Analysis
- The system will display detected company name, personnel count, and key sections
- Ensure your content includes a clear company name for best results

### 3. Generate Presentation
- Click "Generate Professional Presentation" to create your slides
- The AI will process your content and create a structured presentation

### 4. View and Customize
- Navigate through your presentation using arrow keys or navigation buttons
- Switch between different themes using the theme selector
- Use auto-play mode for hands-free presentation
- Export your presentation when ready

## Project Structure

```
VCPresMaker/
├── app/
│   ├── api/
│   │   ├── generate-presentation/    # AI presentation generation
│   │   └── generate-images/          # Image generation API
│   ├── presentation/                 # Presentation viewer
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
├── components/
│   ├── ui/                          # Reusable UI components
│   ├── presentation-slide.tsx        # Slide rendering component
│   ├── theme-provider.tsx           # Theme management
│   └── logo.tsx                     # Logo component
├── lib/                             # Utility functions
├── public/                          # Static assets
└── styles/                          # Additional styles
```

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key for AI-powered content generation

### Customization
- **Themes**: Modify themes in `components/theme-provider.tsx`
- **Slide Templates**: Customize slide layouts in `components/presentation-slide.tsx`
- **Content Analysis**: Adjust parsing logic in `app/api/generate-presentation/route.ts`

## Available Themes

- **Professional**: Clean, corporate design
- **Modern**: Contemporary with gradients
- **Minimal**: Simple and elegant
- **Creative**: Bold and colorful
- **Executive**: Formal business style

## Supported Chart Types

- Bar Charts
- Line Charts
- Pie Charts
- Area Charts
- Radar Charts

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- AI powered by [OpenAI](https://openai.com/)

## Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

**Made with ❤️ for entrepreneurs and investors** 