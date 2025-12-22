# SlideSmith - AI Presentation Generator

An intelligent presentation builder that transforms project briefs into professional 5-slide PowerPoint decks using AI.

**Original Design:** [Figma Project](https://www.figma.com/design/ePUf3jFw9K57TvGHHNqs2W/AI-PPT-Generator-App)

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to start creating presentations.

## Features

- AI-powered content generation using OpenAI GPT-4
- Automatic image selection from Unsplash with proper attribution
- Real-time slide editing with live preview
- Version control for managing deck revisions
- AI text regeneration for content improvement
- PowerPoint export (.pptx) with dark theme
- Professional dark UI with smooth animations

## How It Works

1. **Brief:** Fill out a project brief with topic, audience, objective, situation, and insights
2. **Generate:** AI creates a 5-slide deck with titles, bullets, speaker notes, and images
3. **Edit:** Customize slides, swap images, regenerate text, or make manual edits
4. **Export:** Download as PowerPoint presentation with full formatting

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS + Radix UI components
- Framer Motion animations
- PptxGenJS for PowerPoint export

**Backend:**
- Supabase Edge Functions (Deno runtime)
- OpenAI API (GPT-4 Turbo)
- Unsplash API

## Environment Variables

Create a `.env` file:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Edge functions require secrets configured in Supabase:
- `OPENAI_API_KEY` - OpenAI API key for GPT-4
- `UNSPLASH_ACCESS_KEY` - Unsplash API access key

## Architecture

The app uses Supabase Edge Functions to securely proxy API calls, ensuring:
- API keys never exposed to frontend
- CORS properly handled
- Centralized error handling
- Scalable serverless architecture

### Edge Functions

1. **generate-presentation** - Generates complete 5-slide deck
2. **fetch-unsplash-image** - Fetches images by keyword
3. **regenerate-slide-text** - Improves slide content with AI

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Documentation

See **[DOCUMENTATION.md](./DOCUMENTATION.md)** for comprehensive documentation including:
- Complete workflow and user journey
- Architecture and component structure
- Detailed feature descriptions
- Edge function specifications
- Test cases with results
- Known issues and limitations
- API integration details
- Performance metrics

## Project Structure

```
src/
├── components/          # React components
│   ├── Hero.tsx        # Landing page
│   ├── BriefForm.tsx   # Project brief form
│   ├── DeckEditor.tsx  # Main editor interface
│   └── ui/             # Reusable UI components
├── lib/                # Core logic
│   ├── types.ts        # TypeScript interfaces
│   ├── openai.ts       # API integration
│   └── pptxGenerator.ts # PowerPoint export
└── supabase/functions/ # Edge functions
    ├── generate-presentation/
    ├── fetch-unsplash-image/
    └── regenerate-slide-text/
```

## Testing

All major features have been tested. See test cases in [DOCUMENTATION.md](./DOCUMENTATION.md) section "Test Cases".

**Test Coverage:**
- Form validation ✅
- Presentation generation ✅
- Image fetching ✅
- Text regeneration ✅
- Manual editing ✅
- Version control ✅
- PowerPoint export ✅
- Error handling ✅

## Known Issues

1. No data persistence (resets on page refresh)
2. Fixed at 5 slides (cannot add/remove)
3. Unsplash rate limits on free tier
4. Limited accessibility features

See [DOCUMENTATION.md](./DOCUMENTATION.md) for complete list and workarounds.

## License

Private - All rights reserved

## Version

**0.1.0** - December 2024
