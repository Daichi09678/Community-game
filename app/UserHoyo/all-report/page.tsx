import { Suspense } from 'react';
import AllReportClient from '../../../components/all-report/AllReportClient';
import { LoadingAnimation } from '@/components/ui';

export const metadata = {
  title: 'All Reports - Hoyoverse Hub',
  description: 'Browse all reports from Hoyoverse games community',
};

export default function AllReportPage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING REPORTS..." />}>
      <AllReportClient />
    </Suspense>
  );
}