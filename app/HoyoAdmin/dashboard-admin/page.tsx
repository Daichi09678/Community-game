import { Suspense } from 'react';
import DashboardAdminClient from '../../../components/dashboard-admin/DashboardAdminClient';
import { LoadingAnimation } from '../../../components/ui';

export const metadata = {
  title: 'Dashboard Admin - Hoyoverse Hub',
  description: 'Admin control panel for managing users, reports, and platform activities.',
};

export default function DashboardAdminPage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING DASHBOARD..." />}>
      <DashboardAdminClient />
    </Suspense>
  );
}