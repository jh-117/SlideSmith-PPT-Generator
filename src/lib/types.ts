export interface Slide {
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
