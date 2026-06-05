'use client';

import { clipWidget } from './clipStyles';
import { bgOptions } from './ProfileBanner';

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
      <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
      {children}
    </div>
  );
}

export function BgPicker({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
      <WidgetTitle>Background Theme</WidgetTitle>
      <div className="grid grid-cols-3 gap-2">
        {bgOptions.map(bg => (
          <button key={bg.id} onClick={() => onChange(bg.id)}
            className={`relative h-14 border cursor-pointer transition-all duration-200 overflow-hidden text-[0.58rem] font-['Space_Mono',monospace] flex items-end pb-[5px] px-[5px]
              ${current === bg.id ? 'border-[#C8A96E] text-[#C8A96E]' : 'border-[rgba(200,169,110,0.1)] text-[#5A5248] hover:border-[rgba(200,169,110,0.3)]'}`}
            style={{ ...bg.style, clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
          >
            <span className="relative z-10" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
              {bg.label}
            </span>
            {current === bg.id && (
              <span className="absolute top-1 right-1 text-[#C8A96E] text-[0.7rem]">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}