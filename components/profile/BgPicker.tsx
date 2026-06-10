// components/profile/BgPicker.tsx
'use client';

import { useRef, useState } from 'react';
import { clipWidget, clipBadge } from './clipStyles';
import { bgOptions } from './ProfileBanner';

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
      <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
      {children}
    </div>
  );
}

export function BgPicker({ 
  current, 
  onChange, 
  onPhotoUpload, 
  onPhotoRemove, 
  photoUrl 
}: { 
  current: string; 
  onChange: (id: string) => void;
  onPhotoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove?: () => void;
  photoUrl?: string | null;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onPhotoUpload) {
      onPhotoUpload(e);
    }
    setUploading(false);
  };

  const handleRemovePhoto = () => {
    if (onPhotoRemove) {
      onPhotoRemove();
    }
  };

  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
      <WidgetTitle>Background Theme</WidgetTitle>
      
      {/* Custom Photo Upload */}
      <div className="mb-4">
        <div className="text-[0.65rem] text-[#5A5248] mb-2 font-['Space_Mono',monospace]">Custom Banner</div>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 py-2 text-[0.7rem] font-bold uppercase tracking-wider rounded bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.2)] transition-all disabled:opacity-50"
            style={clipBadge}
          >
            {uploading ? 'Uploading...' : '📷 Upload Photo Banner'}
          </button>
          {photoUrl && (
            <button
              onClick={handleRemovePhoto}
              className="px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider rounded bg-[rgba(224,92,122,0.1)] border border-[rgba(224,92,122,0.3)] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.2)] transition-all"
              style={clipBadge}
            >
              ✕ Remove
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileUpload}
          className="hidden"
        />
        {photoUrl && (
          <div className="mt-2 text-[0.6rem] text-[#4ECDC4] font-['Space_Mono',monospace]">
            ✓ Custom banner active
          </div>
        )}
      </div>

      <div className="text-[0.65rem] text-[#5A5248] mb-2 font-['Space_Mono',monospace]">Preset Themes</div>
      <div className="grid grid-cols-3 gap-2">
        {bgOptions.map(bg => (
          <button 
            key={bg.id} 
            onClick={() => {
              onChange(bg.id);
              if (photoUrl && onPhotoRemove) {
                onPhotoRemove();
              }
            }}
            className={`relative h-14 border cursor-pointer transition-all duration-200 overflow-hidden text-[0.58rem] font-['Space_Mono',monospace] flex items-end pb-[5px] px-[5px]
              ${current === bg.id && !photoUrl ? 'border-[#C8A96E] text-[#C8A96E]' : 'border-[rgba(200,169,110,0.1)] text-[#5A5248] hover:border-[rgba(200,169,110,0.3)]'}`}
            style={{ ...bg.style, clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
          >
            <span className="relative z-10" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
              {bg.label}
            </span>
            {current === bg.id && !photoUrl && (
              <span className="absolute top-1 right-1 text-[#C8A96E] text-[0.7rem]">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}