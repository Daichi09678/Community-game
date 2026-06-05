import { Suspense } from 'react';
import { SettingsClient } from '@/components/settings';
import { LoadingAnimation } from '@/components/ui';

export const metadata = {
  title: 'Settings - Hoyoverse Hub',
  description: 'Manage your account, notification preferences, privacy settings, and linked game accounts.',
};

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING SETTINGS..." />}>
      <SettingsClient />
    </Suspense>
  );
}