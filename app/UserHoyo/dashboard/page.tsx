import { Suspense } from 'react';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { LoadingAnimation } from '@/components/ui';

export const metadata = {
  title: 'Dashboard - Hoyoverse Hub',
  description: 'Track your progress, reports, and community activities in Hoyoverse games',
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING DASHBOARD..." />}>
      <DashboardClient />
    </Suspense>
  );
}