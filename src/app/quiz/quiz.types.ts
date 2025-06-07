export interface Answer {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  title: string;
  answers: Answer[];
  correctAnswerId: number;
  hint?: string;
  imageUrl?: string;
}

export interface Quiz {
  id: number;
  name: string;
  description: string;
  questions: Question[];
} 