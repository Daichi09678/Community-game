import { Suspense } from 'react';
import AdminReportDetailClient from '@/components/dashboard-admin/AdminReportDetailClient';
import { LoadingAnimation } from '@/components/ui';

export const metadata = {
  title: 'Report Detail - Admin Panel',
  description: 'View and review detailed report information.',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminReportDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING REPORT DETAIL..." />}>
      <AdminReportDetailClient reportId={id} />
    </Suspense>
  );
}