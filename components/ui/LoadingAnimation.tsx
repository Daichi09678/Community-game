'use client';

interface LoadingAnimationProps {
  message?: string;
}

export function LoadingAnimation({ message = 'LOADING...' }: LoadingAnimationProps) {
  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6 relative">
          <svg width="80" height="80" viewBox="0 0 28 28" className="mx-auto">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2">
              <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
            </polygon>
            <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8">
              <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8">
              <animate attributeName="y2" values="10.5;9;10.5" dur="1.5s" repeatCount="indefinite" />
            </line>
            <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8">
              <animate attributeName="y1" values="17.5;19;17.5" dur="1.5s" repeatCount="indefinite" />
            </line>
            <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8">
              <animate attributeName="x2" values="10.5;9;10.5" dur="1.5s" repeatCount="indefinite" />
            </line>
            <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8">
              <animate attributeName="x1" values="17.5;19;17.5" dur="1.5s" repeatCount="indefinite" />
            </line>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-48 bg-[rgba(200,169,110,0.1)] rounded-full mx-auto animate-pulse" />
          <div className="h-2 w-32 bg-[rgba(200,169,110,0.05)] rounded-full mx-auto animate-pulse delay-150" />
        </div>
        <p className="mt-6 text-[#C8A96E] font-['Rajdhani',sans-serif] text-sm tracking-wider animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}