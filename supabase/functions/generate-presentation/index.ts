import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const UNSPLASH_ACCESS_KEY = Deno.env.get("UNSPLASH_ACCESS_KEY");

interface Brief {
  topic: string;
  audience: string;
  objective: string;
  situation: string;
  insights: string;
}

interface Slide {
  id: string;
  title: string;
  bullets: string[];
  notes: string;
  imageKeyword: string;
  imageUrl?: string;
  imageAttribution?: {
    photographerName: string;
    photographerUrl: string;
    unsplashUrl: string;
  };
}

interface UnsplashImage {
  urls: {
    regular: string;
  };
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
  };
}

interface ImageData {
  url: string;
  attribution: {
    photographerName: string;
    photographerUrl: string;
    unsplashUrl: string;
  };
}

const fetchUnsplashImage = async (keyword: string): Promise<ImageData | null> => {
  try {
    if (!UNSPLASH_ACCESS_KEY) {
      console.error("Unsplash API key not configured");
      return null;
    }

    console.log(`Fetching image for keyword: "${keyword}"`);

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    console.log(`Unsplash API status for "${keyword}":`, response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Unsplash API error:", errorData);
      return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const image = data.results[0] as UnsplashImage;
      const imageUrl = image.urls.regular;
      
      console.log(`Image found for "${keyword}":`, imageUrl);
      
      // Add UTM parameters for Unsplash API guidelines
      const photographerUrl = `${image.user.links.html}?utm_source=your_app_name&utm_medium=referral`;
      const unsplashUrl = `${image.links.html}?utm_source=your_app_name&utm_medium=referral`;
      
      return {
        url: imageUrl,
        attribution: {
          photographerName: image.user.name,
          photographerUrl: photographerUrl,
          unsplashUrl: unsplashUrl,
        },
      };
    }

    console.log(`No images found for keyword: "${keyword}"`);
    return null;
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
    return null;
  }
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    if (!UNSPLASH_ACCESS_KEY) {
      console.warn("Unsplash API key is not configured - images will be skipped");
    }

    const brief: Brief = await req.json();

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

    console.log("Calling OpenAI API...");

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      throw new Error(error.error?.message || "Failed to generate presentation");
    }

    const data = await openaiResponse.json();
    const content = data.choices[0].message.content;
    const parsedContent = JSON.parse(content);

    console.log("Generated slides, fetching images...");

    const slidesWithImages = await Promise.all(
      parsedContent.slides.map(async (slide: any, index: number) => {
        console.log(`Processing slide ${index + 1}: ${slide.title}`);
        const imageData = await fetchUnsplashImage(slide.imageKeyword);
        
        return {
          id: crypto.randomUUID(),
          title: slide.title,
          bullets: slide.bullets,
          notes: slide.notes,
          imageKeyword: slide.imageKeyword,
          imageUrl: imageData?.url || undefined,
          imageAttribution: imageData?.attribution || undefined,
        };
      })
    );

    const deck = {
      id: crypto.randomUUID(),
      topic: brief.topic,
      audience: brief.audience,
      createdAt: new Date().toISOString(),
      slides: slidesWithImages,
    };

    console.log("Presentation generated successfully");

    return new Response(JSON.stringify(deck), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to generate presentation" 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});