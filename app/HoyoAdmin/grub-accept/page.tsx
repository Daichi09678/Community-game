import { Suspense } from 'react';
import GrubAcceptClient from '@/components/dashboard-admin/GrubAcceptClient';
import { LoadingAnimation } from '@/components/ui';

export const metadata = {
  title: 'Grub Accept - Admin Panel',
  description: 'Review and approve submitted reports before they go live.',
};

export default function GrubAcceptPage() {
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING GRUB ACCEPT..." />}>
      <GrubAcceptClient />
    </Suspense>
  );
}