import { Suspense } from 'react';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const metadata = {
  title: 'Dashboard - Hoyoverse Hub',
  description: 'Track your progress, reports, and community activities in Hoyoverse games',
};

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#050810' }}>
        <div className="text-[#C8A96E] font-['Cinzel',serif] text-xl">Loading Dashboard...</div>
      </div>
    }>
      <DashboardClient />
    </Suspense>
  );
}