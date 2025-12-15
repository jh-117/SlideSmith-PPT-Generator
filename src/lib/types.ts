export interface Slide {
  id: string;
  title: string;
  bullets: string[];
  notes: string;
  imageKeyword: string; // Used to fetch image or placeholder
  imageUrl?: string;
}

export interface Deck {
  id: string;
  topic: string;
  audience: string;
  slides: Slide[];
  createdAt: string;
}

export interface Brief {
  topic: string;
  audience: string;
  objective: string;
  situation: string;
  insights: string;
}
