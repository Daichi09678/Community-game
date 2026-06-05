// app/UserHoyo/mission&quest/page.tsx
import { Suspense } from 'react';
import { MissionQuestClient } from '@/components/mission-quest/MissionQuestClient';
import { LoadingAnimation } from '@/components/ui';

export const metadata = {
  title: 'Mission & Quest - Hoyoverse Hub',
  description: 'Complete guides for main quests, companion quests, side missions and world quests across all Hoyoverse games',
};

export default function MissionQuestPage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING QUESTS & MISSIONS..." />}>
      <MissionQuestClient />
    </Suspense>
  );
}