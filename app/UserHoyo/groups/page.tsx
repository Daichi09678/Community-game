import { Suspense } from 'react';
import GroupClient from '@/components/discussion/groups/GroupClient';
import { LoadingAnimation } from '@/components/ui';

export const metadata = {
  title: 'Groups - Hoyoverse Hub',
  description: 'Join communities based on your favorite Hoyoverse games. Connect with fellow Travelers, Trailblazers, and Agents!',
};

export default function GroupsPage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING GROUPS..." />}>
      <GroupClient />
    </Suspense>
  );
}