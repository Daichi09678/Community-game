// types/puzzle.ts

export type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type PuzzleType = 'riddle' | 'cipher' | 'lore-quiz' | 'sequence';

export interface Puzzle {
  id: number;
  title: string;
  game: GameKey;
  difficulty: Difficulty;
  type: PuzzleType;
  question: string;
  options?: string[];
  answer: string;
  hint: string;
  lore: string;
  points: number;
  solvedBy: number;
  timeLimit?: number;
  orderIndex?: number;
  createdAt?: string;
}