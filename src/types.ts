export interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Battlefield {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  mechanics: string;
  dangerLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface Fighter {
  rank: number;
  username: string;
  title: string;
  punches: number;
  winRate: string;
  avatarSeed: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
