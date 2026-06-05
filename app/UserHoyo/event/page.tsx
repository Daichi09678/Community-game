// app/UserHoyo/event/page.tsx
import { Suspense } from 'react';
import { EventSeasonalClient } from '@/components/event-seasonal';
import { LoadingAnimation } from '@/components/ui';

export const metadata = {
  title: 'Event Seasonal - Hoyoverse Hub',
  description: 'Track live, upcoming, and concluded events across Honkai Star Rail, Genshin Impact, Zenless Zone Zero, and Honkai Impact 3rd',
};

export default function EventSeasonalPage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING EVENTS..." />}>
      <EventSeasonalClient />
    </Suspense>
  );
}