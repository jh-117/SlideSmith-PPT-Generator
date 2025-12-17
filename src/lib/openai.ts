import { Brief, Deck } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const generateDeck = async (brief: Brief): Promise<Deck> => {
  const apiUrl = `${SUPABASE_URL}/functions/v1/generate-presentation`;

  const headers = {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(brief),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate presentation");
    }

    const deck = await response.json();
    return deck;
  } catch (error) {
    console.error("Error generating deck:", error);
    throw error;
  }
};
