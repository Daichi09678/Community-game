import { Suspense } from 'react';
import { PuzzleClient } from '@/components/puzzle';
import { LoadingAnimation } from '@/components/ui';

export const metadata = {
  title: 'Puzzle & Riddles - Hoyoverse Hub',
  description: 'Test your lore knowledge across all Hoyoverse titles. Solve riddles, ciphers, lore quizzes, and sequence challenges.',
};

export default function PuzzlePage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING PUZZLES & RIDDLES..." />}>
      <PuzzleClient />
    </Suspense>
  );
}