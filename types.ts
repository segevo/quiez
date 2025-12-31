export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  text: string;
  correctAnswer: string;
  wrongAnswers: [string, string, string];
}

export const CORRECT_LETTERS_MAP: Record<number, string> = {
  1: 'F',
  2: 'L',
  3: 'B',
  4: 'S',
  5: 'GG',
  6: 'E',
  7: 'G',
  8: 'E',
  9: 'D',
  10: 'G',
};