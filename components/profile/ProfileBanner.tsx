'use client';

import { clipBadge } from './clipStyles';

export const bgOptions = [
  { id: 'default',   label: 'Astral Night',  style: { background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(123,79,166,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(78,205,196,0.1) 0%, transparent 50%), #050810' } },
  { id: 'xianzhou',  label: 'Xianzhou Glow', style: { background: 'radial-gradient(ellipse 70% 50% at 40% 30%, rgba(200,169,110,0.15) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 70% 70%, rgba(78,205,196,0.08) 0%, transparent 50%), #070910' } },
  { id: 'natlan',    label: 'Natlan Ember',  style: { background: 'radial-gradient(ellipse 80% 50% at 30% 40%, rgba(224,92,50,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(200,100,60,0.1) 0%, transparent 50%), #080608' } },
  { id: 'penacony',  label: 'Penacony Dream',style: { background: 'radial-gradient(ellipse 90% 60% at 60% 30%, rgba(180,120,255,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(100,80,200,0.1) 0%, transparent 50%), #060510' } },
  { id: 'fontaine',  label: 'Fontaine Blue', style: { background: 'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(60,140,220,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(80,180,255,0.08) 0%, transparent 50%), #050A12' } },
  { id: 'hollow',    label: 'Hollow Static', style: { background: 'repeating-linear-gradient(0deg, rgba(168,85,247,0.03) 0px, transparent 2px, transparent 40px), repeating-linear-gradient(90deg, rgba(168,85,247,0.02) 0px, transparent 2px, transparent 40px), radial-gradient(ellipse 80% 60% at 50% 30%, rgba(168,85,247,0.12) 0%, transparent 60%), #050508' } },
];

export function ProfileBanner({ bgId, isEditing, onBgChange }: {
  bgId: string; isEditing: boolean; onBgChange: (id: string) => void;
}) {
  const bg = bgOptions.find(b => b.id === bgId) || bgOptions[0];

  return (
    <div className="relative h-44 overflow-hidden border-b border-[rgba(200,169,110,0.15)]" style={bg.style}>
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hexBanner" x="0" y="0" width="40" height="46" patternUnits="userSpaceOnUse">
            <polygon points="20,2 38,12 38,34 20,44 2,34 2,12" fill="none" stroke="#C8A96E" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexBanner)" />
      </svg>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
              background: '#C8A96E', opacity: 0.3 + (i % 3) * 0.1,
              left: `${10 + i * 12}%`, top: `${20 + (i % 4) * 18}%`,
              animation: `float-${i % 3} ${3 + i}s ease-in-out infinite`,
            }} />
        ))}
      </div>

      <div className="absolute top-4 right-5 font-['Space_Mono',monospace] text-[0.6rem] text-[#5A5248]">
        v3.2 · Season Active
      </div>

      {isEditing && (
        <div className="absolute top-4 left-4">
          <div className="text-[0.6rem] font-['Space_Mono',monospace] text-[#C8A96E] bg-[rgba(5,8,16,0.6)] px-2 py-1 border border-[rgba(200,169,110,0.2)]" style={clipBadge}>
            ✎ Edit background below
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-16"
        style={{ background: 'linear-gradient(to bottom, transparent, #0C1220)' }} />
    </div>
  );
}