export interface Flashcard {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
}

export interface FlashcardData {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
}