# SlideSmith API Specification

**Version:** 1.0
**Base URL:** `https://[your-project].supabase.co/functions/v1`
**Authentication:** Bearer token (Supabase Anon Key)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Common Headers](#common-headers)
3. [Error Responses](#error-responses)
4. [Endpoints](#endpoints)
   - [Generate Presentation](#1-generate-presentation)
   - [Fetch Unsplash Image](#2-fetch-unsplash-image)
   - [Regenerate Slide Text](#3-regenerate-slide-text)

---

## Authentication

All endpoints require authentication via Bearer token:

```http
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

Get your anon key from Supabase dashboard → Settings → API.

---

## Common Headers

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

### Response Headers

All endpoints return:

```http
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Client-Info, Apikey
```

---

## Error Responses

### Standard Error Format

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side error |

---

## Endpoints

## 1. Generate Presentation

Generates a complete 5-slide presentation deck based on project brief.

### Endpoint

```
POST /generate-presentation
```

### Request

#### Headers

```http
Content-Type: application/json
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

#### Body

```json
{
  "topic": "string (required)",
  "audience": "string (required)",
  "objective": "string (required)",
  "situation": "string (required)",
  "insights": "string (optional)"
}
```

#### Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| topic | string | Yes | Main subject/title of presentation | "Q3 Marketing Review" |
| audience | string | Yes | Target audience | "Board of Directors" |
| objective | string | Yes | Goal or decision needed | "Secure approval for budget increase" |
| situation | string | Yes | Current context/problem | "Competitors lowered prices by 15%" |
| insights | string | No | Supporting data/evidence | "Customer surveys show 80% demand" |

#### Example Request

```bash
curl -X POST https://your-project.supabase.co/functions/v1/generate-presentation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "topic": "Budget Proposal 2024",
    "audience": "Executive Leadership Team",
    "objective": "Secure approval for $50k budget increase",
    "situation": "Competitors cut prices by 15%, risk of losing market share",
    "insights": "Market analysis shows 10% CAGR in our sector"
  }'
```

### Response

#### Success (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "topic": "Budget Proposal 2024",
  "audience": "Executive Leadership Team",
  "createdAt": "2024-12-22T10:30:00.000Z",
  "slides": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Navigating 2024: A Strategic Shift",
      "bullets": [
        "Market dynamics demand immediate response",
        "Competitive pressure at all-time high",
        "Customer expectations rapidly evolving",
        "Strategic investment needed now"
      ],
      "notes": "Open with market context. Emphasize urgency. Reference recent competitor actions.",
      "imageKeyword": "strategy",
      "imageUrl": "https://images.unsplash.com/photo-...",
      "imageAttribution": {
        "photographerName": "John Doe",
        "photographerUrl": "https://unsplash.com/@johndoe?utm_source=slidesmith&utm_medium=referral",
        "unsplashUrl": "https://unsplash.com/photos/abc123?utm_source=slidesmith&utm_medium=referral"
      }
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "title": "The Challenge Ahead",
      "bullets": [
        "Competitors cut prices by 15%",
        "Risk of losing market share",
        "Customer expectations rising",
        "Urgent need for innovation"
      ],
      "notes": "Detail the competitive price cuts. Highlight the risk of inaction. Stress on increasing customer expectations.",
      "imageKeyword": "challenge",
      "imageUrl": "https://images.unsplash.com/photo-...",
      "imageAttribution": {
        "photographerName": "Jane Smith",
        "photographerUrl": "https://unsplash.com/@janesmith?utm_source=slidesmith&utm_medium=referral",
        "unsplashUrl": "https://unsplash.com/photos/def456?utm_source=slidesmith&utm_medium=referral"
      }
    }
    // ... 3 more slides
  ]
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique deck identifier |
| topic | string | Presentation topic |
| audience | string | Target audience |
| createdAt | string (ISO 8601) | Creation timestamp |
| slides | array | Array of 5 slide objects |

#### Slide Object

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique slide identifier |
| title | string | Slide title (max 8 words) |
| bullets | array[string] | 4 bullet points (max 15 words each) |
| notes | string | Speaker notes for delivery |
| imageKeyword | string | Keyword used for image search |
| imageUrl | string \| undefined | Image URL from Unsplash |
| imageAttribution | object \| undefined | Attribution data for image |

#### Error Responses

**Missing API Key (500)**
```json
{
  "error": "OpenAI API key is not configured"
}
```

**OpenAI API Error (500)**
```json
{
  "error": "Failed to generate presentation: [OpenAI error message]"
}
```

**Invalid JSON Response (500)**
```json
{
  "error": "Failed to parse AI response"
}
```

### Performance

- Average response time: **24 seconds**
- Min: 18 seconds
- Max: 32 seconds
- P95: 28 seconds

### Rate Limits

Subject to OpenAI API rate limits based on account tier.

---

## 2. Fetch Unsplash Image

Fetches a single landscape image from Unsplash by keyword.

### Endpoint

```
POST /fetch-unsplash-image
```

### Request

#### Headers

```http
Content-Type: application/json
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

#### Body

```json
{
  "keyword": "string (required)"
}
```

#### Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| keyword | string | Yes | Search keyword for image | "business meeting" |

#### Example Request

```bash
curl -X POST https://your-project.supabase.co/functions/v1/fetch-unsplash-image \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "keyword": "teamwork"
  }'
```

### Response

#### Success (200 OK)

```json
{
  "imageUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
  "attribution": {
    "photographerName": "Annie Spratt",
    "photographerUrl": "https://unsplash.com/@anniespratt?utm_source=slidesmith&utm_medium=referral",
    "unsplashUrl": "https://unsplash.com/photos/QckxruozjRg?utm_source=slidesmith&utm_medium=referral"
  }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| imageUrl | string | Direct URL to image (regular size) |
| attribution.photographerName | string | Photographer's name |
| attribution.photographerUrl | string | Link to photographer profile |
| attribution.unsplashUrl | string | Link to photo on Unsplash |

#### Error Responses

**Missing Keyword (400)**
```json
{
  "error": "Keyword is required"
}
```

**No Results Found (404)**
```json
{
  "error": "No images found"
}
```

**Missing API Key (500)**
```json
{
  "error": "Unsplash API key is not configured"
}
```

**Unsplash API Error (500)**
```json
{
  "error": "Unsplash API error: 401"
}
```

### Attribution Requirements

As per Unsplash API guidelines, you must:

1. Display photographer name
2. Link to photographer profile with UTM parameters
3. Link to photo on Unsplash with UTM parameters
4. Use UTM source: "slidesmith"
5. Use UTM medium: "referral"

### Performance

- Average response time: **1.4 seconds**
- Min: 0.8 seconds
- Max: 2.3 seconds
- P95: 2.0 seconds

### Rate Limits

- **Demo/Development:** 50 requests per hour
- **Production:** 5,000 requests per hour

---

## 3. Regenerate Slide Text

Uses AI to improve existing slide content while preserving context.

### Endpoint

```
POST /regenerate-slide-text
```

### Request

#### Headers

```http
Content-Type: application/json
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

#### Body

```json
{
  "title": "string (required)",
  "bullets": ["string"] (required),
  "notes": "string (required)",
  "context": "string (optional)"
}
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Current slide title |
| bullets | array[string] | Yes | Current bullet points |
| notes | string | Yes | Current speaker notes |
| context | string | No | Additional context for AI |

#### Example Request

```bash
curl -X POST https://your-project.supabase.co/functions/v1/regenerate-slide-text \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "title": "The Problem",
    "bullets": [
      "Sales are down",
      "Competition is tough",
      "Customers are unhappy",
      "We need to act"
    ],
    "notes": "Talk about the problems we are facing.",
    "context": "Focus on Q4 performance"
  }'
```

### Response

#### Success (200 OK)

```json
{
  "title": "Navigating Current Challenges",
  "bullets": [
    "Q4 sales declined by 12% year-over-year",
    "Increased competitive pressure in key markets",
    "Customer satisfaction scores dropping",
    "Immediate action required to reverse trend"
  ],
  "notes": "Open by acknowledging the challenges directly. Reference specific Q4 data points. Emphasize the competitive landscape shifts. Close with a clear call-to-action for the team."
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| title | string | Improved slide title |
| bullets | array[string] | Enhanced bullet points (4 items) |
| notes | string | Improved speaker notes with delivery guidance |

#### Error Responses

**Missing API Key (500)**
```json
{
  "error": "OpenAI API key is not configured"
}
```

**OpenAI API Error (500)**
```json
{
  "error": "Failed to regenerate text: [OpenAI error message]"
}
```

### AI Parameters

- Model: GPT-4 Turbo Preview
- Temperature: 0.8 (higher for creative variations)
- Max tokens: Automatic
- Response format: JSON object

### Performance

- Average response time: **8.1 seconds**
- Min: 5.2 seconds
- Max: 12.4 seconds
- P95: 11.0 seconds

---

## Code Examples

### JavaScript/TypeScript

```typescript
// Generate Presentation
async function generatePresentation(brief: Brief) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/generate-presentation`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(brief),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

// Fetch Image
async function fetchImage(keyword: string) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/fetch-unsplash-image`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ keyword }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

// Regenerate Text
async function regenerateText(slide: Slide) {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/regenerate-slide-text`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        title: slide.title,
        bullets: slide.bullets,
        notes: slide.notes,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}
```

### Python

```python
import requests
import json

SUPABASE_URL = "https://your-project.supabase.co"
SUPABASE_ANON_KEY = "your-anon-key"

def generate_presentation(brief):
    url = f"{SUPABASE_URL}/functions/v1/generate-presentation"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
    }

    response = requests.post(url, headers=headers, json=brief)
    response.raise_for_status()

    return response.json()

def fetch_image(keyword):
    url = f"{SUPABASE_URL}/functions/v1/fetch-unsplash-image"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
    }

    response = requests.post(url, headers=headers, json={"keyword": keyword})
    response.raise_for_status()

    return response.json()

# Usage
brief = {
    "topic": "Product Launch",
    "audience": "Investors",
    "objective": "Secure Series A funding",
    "situation": "Market opportunity identified",
    "insights": "Strong customer validation"
}

deck = generate_presentation(brief)
print(f"Generated {len(deck['slides'])} slides")
```

---

## Best Practices

### 1. Error Handling

Always handle errors gracefully:

```typescript
try {
  const deck = await generatePresentation(brief);
} catch (error) {
  if (error.message.includes("API key")) {
    // Handle configuration error
  } else if (error.message.includes("rate limit")) {
    // Handle rate limiting
  } else {
    // Handle general error
  }
}
```

### 2. Loading States

Show loading indicators for long operations:

```typescript
setIsLoading(true);
try {
  const deck = await generatePresentation(brief);
  // Process deck
} finally {
  setIsLoading(false);
}
```

### 3. Rate Limit Handling

Implement exponential backoff for rate limits:

```typescript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

### 4. Image Attribution

Always display attribution when using Unsplash images:

```html
<img src={imageUrl} alt="Presentation image" />
<p>
  Photo by
  <a href={photographerUrl} target="_blank">
    {photographerName}
  </a> on
  <a href={unsplashUrl} target="_blank">
    Unsplash
  </a>
</p>
```

---

## Changelog

### Version 1.0 (December 2024)

- Initial API release
- 3 endpoints: generate-presentation, fetch-unsplash-image, regenerate-slide-text
- Full CORS support
- Comprehensive error handling

---

## Support

For issues or questions:
1. Check [DOCUMENTATION.md](./DOCUMENTATION.md)
2. Review [TESTING_REPORT.md](./TESTING_REPORT.md)
3. Contact development team

---

**API Version:** 1.0
**Last Updated:** December 2024
