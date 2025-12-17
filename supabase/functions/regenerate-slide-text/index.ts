import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

interface RegenerateRequest {
  title: string;
  bullets: string[];
  notes: string;
  context?: string;
}

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

    const { title, bullets, notes, context }: RegenerateRequest = await req.json();

    const prompt = `You are an expert presentation designer. Regenerate and improve the following slide content to make it more impactful and professional.

Current Slide:
Title: ${title}
Bullets:
${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}
Speaker Notes: ${notes}
${context ? `\nAdditional Context: ${context}` : ''}

Create improved content with:
- A compelling title (max 8 words)
- 4 bullet points that are concise and impactful (each max 15 words)
- Enhanced speaker notes with delivery guidance

Return ONLY valid JSON in this exact format:
{
  "title": "improved title",
  "bullets": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"],
  "notes": "improved speaker notes"
}`;

    console.log("Calling OpenAI API for text regeneration...");

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
            content: "You are a professional presentation designer. You create executive-level slide content. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      throw new Error(error.error?.message || "Failed to regenerate text");
    }

    const data = await openaiResponse.json();
    const content = data.choices[0].message.content;
    const parsedContent = JSON.parse(content);

    console.log("Text regenerated successfully");

    return new Response(JSON.stringify(parsedContent), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to regenerate text" 
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