'use client';

export function LoadingSpinner({ size = 'md', color = '#C8A96E' }: { size?: 'sm' | 'md' | 'lg'; color?: string }) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeMap[size]} border-2 border-t-transparent rounded-full animate-spin`}
        style={{ borderColor: color, borderTopColor: 'transparent' }}
      />
    </div>
  );
}