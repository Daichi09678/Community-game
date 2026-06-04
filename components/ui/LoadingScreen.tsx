'use client';

import { LoadingSpinner } from './LoadingSpinner';

export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#050810] z-50">
      <div className="text-center">
        <div className="mb-4">
          <svg width="48" height="48" viewBox="0 0 28 28" className="mx-auto animate-pulse">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
            <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="14" y1="8"    x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="14" y1="17.5" x2="14" y2="20"   stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="8"  y1="14"   x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
            <line x1="17.5" y1="14" x2="20"   y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
          </svg>
        </div>
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-[#C8A96E] font-['Rajdhani',sans-serif] text-sm tracking-wider animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}