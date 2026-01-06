# SlideSmith - AI Presentation Generator

## Table of Contents
1. [Overview](#overview)
2. [Workflow](#workflow)
3. [Architecture](#architecture)
4. [Features](#features)
5. [Edge Functions](#edge-functions)
6. [Technical Stack](#technical-stack)
7. [API Integrations](#api-integrations)
8. [Test Cases](#test-cases)
9. [Known Issues](#known-issues)
10. [Environment Setup](#environment-setup)

---

## Overview

SlideSmith is an AI-powered presentation generator that creates professional 5-slide PowerPoint decks based on user-provided project briefs. The application uses OpenAI's GPT-4 for content generation, Unsplash for stock imagery, and exports presentations in PowerPoint format.

### Key Capabilities
- AI-generated presentation content using OpenAI GPT-4
- Automatic image selection from Unsplash
- Real-time slide editing
- Version control for presentations
- PowerPoint export functionality
- Dark-themed professional interface

---

## Workflow

### 1. Landing Page
**Component:** `Hero.tsx`
- User arrives at the landing page
- Displays application branding and value proposition
- Provides "Start" button to begin presentation creation
- Includes privacy policy link

### 2. Brief Submission
**Component:** `BriefForm.tsx`
- User fills out a project brief with 5 fields:
  - **Topic/Title:** Main subject of the presentation
  - **Target Audience:** Who will view the presentation
  - **Objective/Decision Needed:** Goal of the presentation
  - **Current Situation/Problem:** Context and challenges
  - **Key Insights/Evidence:** Supporting data and arguments
- Features quick-pick suggestions for each field
- Includes "Autofill Example" button for demo purposes
- All fields except "insights" are required

### 3. AI Generation
**Component:** `LoadingState.tsx`
- Displays animated loading state
- Calls `generate-presentation` edge function
- OpenAI GPT-4 generates 5 slides with:
  - Compelling titles
  - 4 bullet points per slide
  - Speaker notes
  - Image keywords
- Unsplash API fetches images for each slide
- Takes approximately 15-30 seconds

### 4. Deck Editor
**Component:** `DeckEditor.tsx`
- Displays generated presentation in a 3-panel layout:
  - **Left Panel:** Slide thumbnails for navigation
  - **Center Canvas:** Full-size slide preview
  - **Right Panel:** Editing controls

**Editing Features:**
- Edit slide titles
- Modify bullet points (one per line)
- Update speaker notes
- Change image keywords and fetch new images
- Regenerate slide text with AI
- Switch between versions
- Save new versions

### 5. Export
**Function:** `pptxGenerator.ts`
- Exports deck as PowerPoint file (.pptx)
- Includes all slides with:
  - Dark theme design
  - Images with attribution
  - Speaker notes
  - Professional formatting

---

## Architecture

### Frontend Structure

```
src/
├── App.tsx                          # Main application component with state management
├── main.tsx                         # Application entry point
├── index.css                        # Global styles
├── components/
│   ├── Hero.tsx                     # Landing page
│   ├── BriefForm.tsx                # Brief submission form
│   ├── LoadingState.tsx             # Loading animation
│   ├── DeckEditor.tsx               # Main editor interface
│   ├── SlidePreview.tsx             # Slide rendering component
│   ├── SlideEditorPanel.tsx         # Right panel editing controls
│   ├── EditorHelpPanel.tsx          # Contextual help guide with scrollable content
│   ├── PrivacyPolicy.tsx            # Privacy policy page
│   ├── BackgroundMusic.tsx          # Optional background audio
│   └── ui/                          # Reusable UI components (Radix UI)
├── lib/
│   ├── types.ts                     # TypeScript interfaces
│   ├── openai.ts                    # OpenAI API integration
│   ├── pptxGenerator.ts             # PowerPoint export logic
│   ├── utils.ts                     # Utility functions
│   └── mockAI.ts                    # Mock data for testing
└── guidelines/
    └── Guidelines.md                # Design and content guidelines
```

### Backend Structure (Supabase Edge Functions)

```
supabase/functions/
├── generate-presentation/
│   └── index.ts                     # Main presentation generation endpoint
├── fetch-unsplash-image/
│   └── index.ts                     # Unsplash image proxy
└── regenerate-slide-text/
    └── index.ts                     # AI text regeneration endpoint
```

### Data Flow

1. **Brief Submission:**
   ```
   User Input → BriefForm → App.tsx → openai.ts → generate-presentation edge function
   ```

2. **AI Generation:**
   ```
   Edge Function → OpenAI API (GPT-4) → Unsplash API → Response with Deck
   ```

3. **Slide Editing:**
   ```
   User Edit → SlideEditorPanel → DeckEditor → App.tsx (State Update) → Re-render
   ```

4. **Image Fetch:**
   ```
   Image Keyword → fetch-unsplash-image edge function → Unsplash API → Image URL
   ```

5. **Text Regeneration:**
   ```
   Slide Content → regenerate-slide-text edge function → OpenAI API → Improved Content
   ```

6. **Export:**
   ```
   Deck State → pptxGenerator.ts → PptxGenJS → Download .pptx File
   ```

---

## Features

### 1. AI-Powered Content Generation
- **Technology:** OpenAI GPT-4 Turbo
- **Model:** `gpt-4-turbo-preview`
- **Temperature:** 0.7 (balanced creativity)
- **Response Format:** JSON structured output
- **Slide Structure:**
  - Slide 1: Title/Opening
  - Slide 2: Problem/Situation
  - Slide 3: Analysis/Insights
  - Slide 4: Solution/Recommendations
  - Slide 5: Next Steps/Conclusion

### 2. Smart Image Integration
- **Source:** Unsplash API
- **Orientation:** Landscape only
- **Selection:** AI-generated keywords
- **Attribution:** Proper credit with photographer name and Unsplash link
- **UTM Tracking:** Includes source attribution per Unsplash guidelines

### 3. Real-Time Editing
- **Title Editing:** Direct input field
- **Bullet Points:** Multi-line textarea (one bullet per line)
- **Speaker Notes:** Rich text area for presentation notes
- **Live Preview:** Changes reflect immediately on canvas
- **No Autosave:** Manual version control only

### 4. Version Control
- **Save Versions:** Create snapshots of current state
- **Switch Versions:** Dropdown selector to navigate between versions
- **Version Numbering:** Automatic sequential numbering
- **Version Isolation:** Each version maintains independent state
- **Timestamp:** Creation timestamp for each version

### 5. AI Text Regeneration
- **Functionality:** Improve existing slide content
- **Preserves:** General topic and context
- **Enhances:**
  - Title clarity and impact
  - Bullet point conciseness
  - Speaker notes quality
- **Temperature:** 0.8 (higher creativity for variations)

### 6. PowerPoint Export
- **Library:** PptxGenJS
- **Format:** .pptx (PowerPoint 2007+)
- **Layout:** 16:9 widescreen
- **Theme:** Custom dark theme with blue accent
- **Features:**
  - Master slide with top accent bar
  - Professional typography
  - Embedded images
  - Speaker notes
  - Image attribution

### 7. User Interface
- **Theme:** Dark mode (slate/blue palette)
- **Layout:** Three-panel editor
- **Animations:** Smooth transitions (Framer Motion)
- **Responsive:** Adapts to screen sizes
- **Toast Notifications:** User feedback for all actions
- **Loading States:** Visual feedback during async operations
- **Help Panel:** Contextual help guide with scrollable content providing quick tips and feature explanations

---

## Edge Functions

### 1. generate-presentation

**Endpoint:** `/functions/v1/generate-presentation`

**Purpose:** Generates complete 5-slide presentation deck

**Method:** POST

**Request Body:**
```json
{
  "topic": "Q3 Marketing Review",
  "audience": "Board of Directors",
  "objective": "Secure approval for budget increase",
  "situation": "Competitors lowered prices by 15%",
  "insights": "Customer surveys show 80% demand"
}
```

**Response:**
```json
{
  "id": "uuid",
  "topic": "Q3 Marketing Review",
  "audience": "Board of Directors",
  "createdAt": "2024-01-01T00:00:00Z",
  "slides": [
    {
      "id": "uuid",
      "title": "Navigating 2024: A Strategic Shift",
      "bullets": ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"],
      "notes": "Speaker notes...",
      "imageKeyword": "strategy",
      "imageUrl": "https://...",
      "imageAttribution": {
        "photographerName": "John Doe",
        "photographerUrl": "https://...",
        "unsplashUrl": "https://..."
      }
    }
  ]
}
```

**Process:**
1. Validates OpenAI and Unsplash API keys
2. Constructs detailed prompt with brief details
3. Calls OpenAI GPT-4 with JSON response format
4. Parses response and extracts 5 slides
5. For each slide, fetches image from Unsplash
6. Returns complete deck with images and attributions

**Error Handling:**
- Missing API keys: 500 error with descriptive message
- OpenAI API failure: Returns error message from OpenAI
- Unsplash failure: Continues without images (optional)
- Invalid JSON: Parsing error returned

**Performance:** ~15-30 seconds

---

### 2. fetch-unsplash-image

**Endpoint:** `/functions/v1/fetch-unsplash-image`

**Purpose:** Proxy for Unsplash API to fetch images securely

**Method:** POST

**Request Body:**
```json
{
  "keyword": "business meeting"
}
```

**Response:**
```json
{
  "imageUrl": "https://images.unsplash.com/...",
  "attribution": {
    "photographerName": "Jane Smith",
    "photographerUrl": "https://unsplash.com/@jane?utm_source=slidesmith&utm_medium=referral",
    "unsplashUrl": "https://unsplash.com/photos/abc123?utm_source=slidesmith&utm_medium=referral"
  }
}
```

**Process:**
1. Validates keyword input
2. Checks for Unsplash API key
3. Queries Unsplash search API with:
   - Orientation: landscape
   - Per page: 1 (first result only)
4. Extracts image URL and attribution data
5. Adds UTM parameters for tracking

**Error Handling:**
- Missing keyword: 400 error
- Missing API key: 500 error
- Unsplash API error: Returns status code in error
- No results: 404 error with "No images found"

**Rate Limiting:** Subject to Unsplash API limits (50 requests/hour demo, 5000/hour production)

---

### 3. regenerate-slide-text

**Endpoint:** `/functions/v1/regenerate-slide-text`

**Purpose:** Uses AI to improve existing slide content

**Method:** POST

**Request Body:**
```json
{
  "title": "Current Title",
  "bullets": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "notes": "Current speaker notes",
  "context": "Optional additional context"
}
```

**Response:**
```json
{
  "title": "Improved Title",
  "bullets": ["Better Point 1", "Better Point 2", "Better Point 3", "Better Point 4"],
  "notes": "Enhanced speaker notes with delivery tips"
}
```

**Process:**
1. Validates OpenAI API key
2. Constructs prompt with current content
3. Requests improved version from GPT-4
4. Returns enhanced content while preserving meaning

**AI Parameters:**
- Model: gpt-4-turbo-preview
- Temperature: 0.8 (higher for creative variations)
- Response format: JSON object

**Error Handling:**
- Missing API key: 500 error
- OpenAI API failure: Returns error from API
- Invalid response: JSON parsing error

---

## Technical Stack

### Frontend
- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.3.5
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI (headless components)
- **Animations:** Framer Motion
- **Notifications:** Sonner
- **Icons:** Lucide React
- **PowerPoint Export:** PptxGenJS

### Backend
- **Platform:** Supabase Edge Functions
- **Runtime:** Deno
- **Language:** TypeScript
- **APIs:**
  - OpenAI API (GPT-4)
  - Unsplash API

### Development Tools
- **Package Manager:** npm
- **Type Checking:** TypeScript strict mode
- **Code Bundling:** Vite SWC plugin

---

## API Integrations

### OpenAI API
- **Base URL:** `https://api.openai.com/v1/chat/completions`
- **Model:** gpt-4-turbo-preview
- **Authentication:** Bearer token (environment variable)
- **Rate Limits:** Depends on account tier
- **Cost:** ~$0.03 per presentation generation

**Configuration:**
```typescript
{
  model: "gpt-4-turbo-preview",
  messages: [...],
  temperature: 0.7, // or 0.8 for regeneration
  response_format: { type: "json_object" }
}
```

### Unsplash API
- **Base URL:** `https://api.unsplash.com`
- **Endpoint:** `/search/photos`
- **Authentication:** Client-ID header
- **Rate Limits:**
  - Demo: 50 requests/hour
  - Production: 5000 requests/hour
- **Cost:** Free

**Configuration:**
```typescript
{
  query: "keyword",
  per_page: 1,
  orientation: "landscape"
}
```

**Attribution Requirements:**
- Display photographer name
- Link to photographer profile with UTM parameters
- Link to photo on Unsplash with UTM parameters
- UTM source: "slidesmith"
- UTM medium: "referral"

---

## Test Cases

### Test Case 1: Brief Form Validation

**Scenario:** Submit form with missing required fields

**Steps:**
1. Navigate to brief form
2. Leave topic field empty
3. Fill other fields
4. Click "Generate 5-Slide Deck"

**Expected Result:** ✅ PASS
- Form shows browser validation error
- Submission blocked
- No API call made

**Actual Result:** ✅ PASS

---

### Test Case 2: Successful Presentation Generation

**Scenario:** Generate presentation with valid brief

**Steps:**
1. Fill all required fields with valid data
2. Click "Generate 5-Slide Deck"
3. Wait for generation to complete

**Expected Result:** ✅ PASS
- Loading state appears
- API call to generate-presentation succeeds
- 5 slides are generated
- Images are fetched and embedded
- Redirects to deck editor

**Actual Result:** ✅ PASS (when API keys configured)

**Dependencies:**
- OpenAI API key configured
- Unsplash API key configured

---

### Test Case 3: Image Fetching

**Scenario:** Fetch new image for a slide

**Steps:**
1. Open deck editor
2. Select a slide
3. Change image keyword to "mountains"
4. Click image refresh button

**Expected Result:** ✅ PASS (after fix)
- Loading spinner appears
- API call to fetch-unsplash-image succeeds
- Image updates in preview
- Attribution displayed
- Success toast notification

**Previous Result:** ❌ FAIL
- Error: "Unsplash API error: 401"
- Reason: Hardcoded invalid API key

**Fix Applied:**
- Changed to use environment variable: `Deno.env.get("UNSPLASH_ACCESS_KEY")`
- Redeployed edge function

**Current Result:** ✅ PASS

---

### Test Case 4: Text Regeneration

**Scenario:** Regenerate slide text with AI

**Steps:**
1. Open deck editor
2. Select a slide
3. Click "Regenerate Text with AI" button
4. Wait for completion

**Expected Result:** ✅ PASS
- Loading spinner appears
- API call to regenerate-slide-text succeeds
- Title, bullets, and notes update
- Content is improved but maintains context
- Success toast notification

**Actual Result:** ✅ PASS (when OpenAI API key configured)

---

### Test Case 5: Manual Slide Editing

**Scenario:** Manually edit slide content

**Steps:**
1. Open deck editor
2. Change slide title
3. Modify bullet points
4. Update speaker notes
5. Observe preview

**Expected Result:** ✅ PASS
- All changes reflect immediately
- Preview updates in real-time
- No API calls made
- State persists across slide navigation

**Actual Result:** ✅ PASS

---

### Test Case 6: Version Control

**Scenario:** Save and switch between versions

**Steps:**
1. Open deck editor
2. Make edits to current deck
3. Click save version button
4. Continue editing
5. Switch back to previous version via dropdown

**Expected Result:** ✅ PASS
- New version created with unique ID
- Version dropdown shows "Version 1", "Version 2", etc.
- Switching versions loads correct state
- Each version maintains independent changes
- Success toast on save

**Actual Result:** ✅ PASS

---

### Test Case 7: PowerPoint Export

**Scenario:** Export presentation as PPTX file

**Steps:**
1. Generate or open a deck
2. Click "Export PPTX" button
3. Wait for download

**Expected Result:** ✅ PASS
- Toast shows "Preparing PowerPoint file..."
- File downloads with format: "SlideSmith - [Topic].pptx"
- File opens correctly in PowerPoint/LibreOffice
- All slides present with:
  - Dark theme
  - Titles and bullets
  - Images (if available)
  - Speaker notes
  - Image attribution
- Success toast on completion

**Actual Result:** ✅ PASS

---

### Test Case 8: Autofill Example

**Scenario:** Use autofill feature to populate brief

**Steps:**
1. Navigate to brief form
2. Click "Autofill Example" button
3. Observe form fields

**Expected Result:** ✅ PASS
- All 5 fields populate with example data
- Example data is coherent
- User can still edit after autofill
- Can generate presentation from autofilled data

**Actual Result:** ✅ PASS

---

### Test Case 9: Navigation and Back Button

**Scenario:** Navigate through application states

**Steps:**
1. Start from landing
2. Click "Start"
3. Click "Back" from brief form
4. Start again and generate deck
5. Click "Start Over" from editor

**Expected Result:** ⚠️ PARTIAL PASS
- Back button returns to previous state
- "Start Over" shows warning toast
- Must confirm before leaving editor
- State resets appropriately

**Actual Result:** ⚠️ PARTIAL PASS
- Warning appears but requires explicit "Leave" action
- Clicking away dismisses warning
- Could lose work if user misunderstands

**Recommendation:** Add unsaved changes indicator

---

### Test Case 10: Error Handling - API Failure

**Scenario:** API returns error during generation

**Steps:**
1. Simulate API failure (invalid API key)
2. Submit brief form
3. Observe error handling

**Expected Result:** ✅ PASS
- Error toast appears
- Descriptive error message shown
- Returns to brief form
- User can retry
- No partial/corrupt data saved

**Actual Result:** ✅ PASS

---

### Test Case 11: Image Fetch - No Results

**Scenario:** Search for image with obscure keyword

**Steps:**
1. Open deck editor
2. Enter obscure keyword (e.g., "xyzabc123")
3. Click fetch image

**Expected Result:** ✅ PASS
- API returns 404 error
- Error toast: "No images found"
- Original image preserved
- User can try different keyword

**Actual Result:** ✅ PASS

---

### Test Case 12: Long Content Handling

**Scenario:** Enter very long text in fields

**Steps:**
1. Enter 500+ characters in bullet points
2. Preview slide

**Expected Result:** ⚠️ PARTIAL PASS
- Text overflows slide preview
- No hard limit enforced
- Export may have formatting issues

**Actual Result:** ⚠️ PARTIAL PASS

**Recommendation:** Add character limits or text truncation

---

## Known Issues

### 1. Unsplash API Rate Limiting
**Severity:** Medium
**Status:** Known Limitation

**Description:**
Unsplash free tier limits to 50 requests/hour. Heavy usage can hit limits.

**Workaround:**
- Upgrade to Unsplash production account (5000 req/hour)
- Cache image results (not implemented)
- Implement request queuing

---

### 2. PowerPoint File Size
**Severity:** Low
**Status:** By Design

**Description:**
Exported PPTX files can be large (5-10MB) due to embedded high-res images.

**Workaround:**
- Images are fetched at "regular" quality (not "full")
- Users can manually compress in PowerPoint
- Consider image optimization pipeline

---

### 3. No Persistence
**Severity:** Medium
**Status:** Feature Gap

**Description:**
No database integration. All data lost on page refresh.

**Impact:**
- Users lose work if browser crashes
- Cannot share presentations
- No history beyond current session

**Recommendation:**
- Add Supabase database for persistence
- Implement user accounts
- Auto-save functionality

---

### 4. Limited Slide Count
**Severity:** Low
**Status:** By Design

**Description:**
Fixed at 5 slides. Cannot add or remove slides.

**Workaround:**
- Users can edit exported PPTX
- Future feature: customizable slide count

---

### 5. No Collaborative Editing
**Severity:** Low
**Status:** Feature Gap

**Description:**
Single-user application. No real-time collaboration.

**Recommendation:**
- Future feature: multi-user support
- Requires backend architecture changes

---

### 6. Browser Compatibility
**Severity:** Low
**Status:** Tested

**Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Issues:**
- IE 11: Not supported
- Older mobile browsers: Limited testing

---

### 7. Accessibility
**Severity:** Medium
**Status:** Partial Implementation

**Issues:**
- Keyboard navigation incomplete
- Screen reader support limited
- Insufficient ARIA labels

**Recommendation:**
- Full accessibility audit
- WCAG 2.1 AA compliance

---

## Environment Setup

### Required Environment Variables

**Frontend (.env):**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Backend (Supabase Secrets):**
```bash
OPENAI_API_KEY=sk-...
UNSPLASH_ACCESS_KEY=your-access-key
```

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Deployment

**Frontend:**
- Automatically deployed via hosting platform
- Build command: `npm run build`
- Output directory: `build/`

**Edge Functions:**
- Deployed via Supabase CLI or deployment tool
- Environment secrets configured in Supabase dashboard
- Automatic deployment on code changes

---

## Performance Metrics

- **Initial Load:** ~2-3 seconds
- **Brief to Generation:** ~15-30 seconds
- **Image Fetch:** ~1-3 seconds
- **Text Regeneration:** ~5-10 seconds
- **Export Time:** ~2-4 seconds
- **Bundle Size:** 824 KB (gzipped: 272 KB)

---

## Security Considerations

1. **API Keys:** Secured in environment variables, never exposed to client
2. **CORS:** Properly configured on edge functions
3. **Input Validation:** Basic validation on forms
4. **XSS Protection:** React's built-in escaping
5. **Attribution:** Proper Unsplash attribution implemented

---

## Future Enhancements

1. Database integration for persistence
2. User authentication
3. Custom slide count
4. Theme customization
5. Template library
6. Collaborative editing
7. Export to PDF
8. Slide animations
9. Chart/graph support
10. Video embedding

---

## Conclusion

SlideSmith is a functional AI presentation generator with robust features for creating professional slide decks. The application successfully integrates OpenAI and Unsplash APIs, provides real-time editing capabilities, and exports to PowerPoint format. Key areas for improvement include data persistence, accessibility, and advanced customization options.

**Version:** 0.1.0
**Last Updated:** December 2024
**Status:** Production Ready (with known limitations)
