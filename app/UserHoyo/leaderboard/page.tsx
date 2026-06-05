import { Suspense } from 'react';
import { LeaderboardClient } from '@/components/leaderboard';
import { LoadingAnimation } from '@/components/ui';

export const metadata = {
  title: 'Leaderboard - Hoyoverse Hub',
  description: 'Top contributors ranking across all Hoyoverse games. See who leads in reports, votes, and streaks.',
};

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING LEADERBOARD..." />}>
      <LeaderboardClient />
    </Suspense>
  );
}