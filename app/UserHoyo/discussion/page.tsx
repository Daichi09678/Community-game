import { Suspense } from 'react';
import { DiscussionClient } from '@/components/discussion';
import { LoadingAnimation } from '@/components/ui';

export const metadata = {
  title: 'Discussion - Hoyoverse Hub',
  description: 'Join discussions about Hoyoverse games including Honkai Star Rail, Genshin Impact, Zenless Zone Zero, and Honkai Impact 3rd',
};

export default function DiscussionPage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING DISCUSSION BOARD..." />}>
      <DiscussionClient />
    </Suspense>
  );
}