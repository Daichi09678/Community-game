import { Suspense } from 'react';
import UserProfileDetailClient from '@/components/dashboard-admin/UserProfileDetailClient';
import { LoadingAnimation } from '@/components/ui';

export const metadata = {
  title: 'User Profile - Admin Panel',
  description: 'View detailed user profile information, activity, and reports.',
};

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  // ✅ await params karena berupa Promise di Next.js 15
  const { userId } = await params;
  
  return (
    <Suspense fallback={<LoadingAnimation message="LOADING USER PROFILE..." />}>
      <UserProfileDetailClient userId={userId} />
    </Suspense>
  );
}