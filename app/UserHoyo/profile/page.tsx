import { Suspense } from 'react';
import { ProfileClient } from '@/components/profile';
import { LoadingAnimation } from '@/components/ui';

export const metadata = {
  title: 'My Profile - Hoyoverse Hub',
  description: 'Manage your profile, view achievements, and track your contributions across all Hoyoverse games.',
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING PROFILE..." />}>
      <ProfileClient />
    </Suspense>
  );
}