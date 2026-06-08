import { Suspense } from 'react';
import ProfileClient from '../../../components/dashboard-admin/ProfileClient';
import { LoadingAnimation } from '../../../components/ui';

export const metadata = {
  title: 'Admin Profile - Hoyoverse Hub',
  description: 'Administrator profile and platform statistics.',
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING PROFILE..." />}>
      <ProfileClient />
    </Suspense>
  );
}