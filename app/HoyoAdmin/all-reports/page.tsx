import { Suspense } from 'react';
import AllReportsClient from '../../../components/dashboard-admin/AllReportsClient';
import { LoadingAnimation } from '../../../components/ui';

export const metadata = {
  title: 'All Reports - Admin Panel',
  description: 'Manage and moderate all reports across games and categories.',
};

export default function AllReportsPage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING ALL REPORTS..." />}>
      <AllReportsClient />
    </Suspense>
  );
}