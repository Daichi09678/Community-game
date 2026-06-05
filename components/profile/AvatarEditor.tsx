'use client';

import { useRef } from 'react';
import { clipWidget, clipBadge } from './clipStyles';

export function AvatarEditor({ initials, color, isEditing, onInitialsChange, onColorChange, photoUrl, onPhotoChange }: {
  initials: string; color: string; isEditing: boolean;
  onInitialsChange: (v: string) => void; onColorChange: (v: string) => void;
  photoUrl: string | null; onPhotoChange: (url: string | null) => void;
}) {
  const colors = ['#C8A96E', '#4ECDC4', '#6DD18A', '#A855F7', '#E05C7A', '#F59E0B', '#60A5FA'];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    onPhotoChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="relative">
      <div className="w-28 h-28 relative">
        <svg viewBox="0 0 112 112" className="absolute inset-0 w-full h-full">
          <polygon points="56,4 104,28 104,84 56,108 8,84 8,28"
            fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
          <polygon points="56,10 98,32 98,80 56,102 14,80 14,32"
            fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
        </svg>
        <div className="absolute inset-4 rounded-full flex items-center justify-center font-['Cinzel',serif] text-[1.5rem] font-bold border-2 overflow-hidden"
          style={{ background: photoUrl ? `url(${photoUrl}) center/cover` : `radial-gradient(circle at 40% 40%, ${color}22, ${color}08)`, borderColor: color, color }}>
          {!photoUrl && (initials.slice(0, 2).toUpperCase() || 'TB')}
        </div>
        <div className="absolute inset-4 rounded-full pointer-events-none" style={{ boxShadow: `0 0 20px ${color}33` }} />
      </div>

      {isEditing && (
        <div className="absolute -right-2 -bottom-2">
          <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.3)] p-2" style={clipWidget}>
            <div className="mb-2 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="block text-[0.65rem] text-[#C8A96E] border border-[rgba(200,169,110,0.3)] px-2 py-1 mb-1 cursor-pointer hover:bg-[rgba(200,169,110,0.1)] transition-all duration-200"
                style={clipBadge}
              >
                📷 Upload Photo
              </label>
              {photoUrl && (
                <button
                  onClick={removePhoto}
                  className="text-[0.6rem] text-[#E05C7A] border border-[rgba(224,92,122,0.3)] px-2 py-1 mb-2 cursor-pointer hover:bg-[rgba(224,92,122,0.1)] transition-all duration-200"
                  style={clipBadge}
                >
                  ✕ Remove Photo
                </button>
              )}
            </div>
            
            <input
              type="text"
              value={initials}
              maxLength={2}
              onChange={e => onInitialsChange(e.target.value)}
              placeholder="Initials"
              className="w-full bg-transparent border border-[rgba(200,169,110,0.2)] text-[#C8A96E] text-center text-[0.7rem] font-['Cinzel',serif] outline-none px-1 py-[2px] mb-2"
            />
            
            <div className="flex gap-1 flex-wrap justify-center">
              {colors.map(c => (
                <button key={c} onClick={() => onColorChange(c)}
                  className="w-4 h-4 rounded-full border-none cursor-pointer transition-transform hover:scale-110"
                  style={{ background: c, outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: '2px' }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}