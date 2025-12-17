import { Brief, Deck } from "./types";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const UNSPLASH_ACCESS_KEY = "fZGZ5q-hGH9_PGU3k7vVeJd3NMQIiJXz_fOGH-_bZRw";

interface UnsplashImage {
  urls: {
    regular: string;
  };
}

const fetchUnsplashImage = async (keyword: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return (data.results[0] as UnsplashImage).urls.regular;
    }

    return "";
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
    return "";
  }
};

export const generateDeck = async (brief: Brief): Promise<Deck> => {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.");
  }

  const prompt = `You are an expert presentation designer. Create a compelling 5-slide presentation deck based on the following brief:

Topic: ${brief.topic}
Audience: ${brief.audience}
Objective: ${brief.objective}
Current Situation: ${brief.situation}
Key Insights: ${brief.insights || "Not provided"}

Create exactly 5 slides with the following structure:
1. Title/Opening slide - Set the stage and grab attention
2. Problem/Situation slide - Explain the current context
3. Analysis/Insights slide - Present key findings and data
4. Solution/Recommendations slide - Provide actionable recommendations
5. Next Steps/Conclusion slide - Clear action items and timeline

For each slide, provide:
- A compelling title (max 8 words)
- 4 bullet points that are concise and impactful (each max 15 words)
- Speaker notes with guidance on delivery
- An image keyword (1-3 words) for finding relevant stock photos

Return ONLY valid JSON in this exact format:
{
  "slides": [
    {
      "title": "slide title",
      "bullets": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"],
      "notes": "speaker notes",
      "imageKeyword": "keyword"
    }
  ]
}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a professional presentation designer. You create executive-level slide decks. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate presentation");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsedContent = JSON.parse(content);

    const slidesWithImages = await Promise.all(
      parsedContent.slides.map(async (slide: any) => {
        const imageUrl = await fetchUnsplashImage(slide.imageKeyword);
        return {
          id: crypto.randomUUID(),
          title: slide.title,
          bullets: slide.bullets,
          notes: slide.notes,
          imageKeyword: slide.imageKeyword,
          imageUrl: imageUrl || undefined,
        };
      })
    );

    return {
      id: crypto.randomUUID(),
      topic: brief.topic,
      audience: brief.audience,
      createdAt: new Date().toISOString(),
      slides: slidesWithImages,
    };
  } catch (error) {
    console.error("Error generating deck with OpenAI:", error);
    throw error;
  }
};
