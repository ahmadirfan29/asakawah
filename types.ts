export enum ReadingLevel {
  Pemula = 'Pemula',     // Beginner
  Menengah = 'Menengah', // Intermediate
  Mahir = 'Mahir',       // Advanced
}

export interface Profile {
  name: string;
  age: number;
  classLevel: number;
  level: ReadingLevel;
  interests: string[];
}

export interface Story {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  illustrationPrompt: string;
  level: ReadingLevel;
  interest: string;
  isRead: boolean;
  timestamp: number;
}

export interface Reward {
  id: string;
  name: string;
  type: 'sticker' | 'avatar' | 'badge';
  cost: number;
  unlocked: boolean;
  emoji: string;
}

export interface QAndA {
    id: string;
    question: string;
    answer: string;
    imageUrl?: string;
    timestamp: number;
}