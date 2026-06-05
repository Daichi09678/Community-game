'use client';

export function Toggle({ checked, onChange, color = '#C8A96E' }: { checked: boolean; onChange: () => void; color?: string }) {
  return (
    <button
      onClick={onChange}
      className="relative w-10 h-5 transition-all duration-300 shrink-0"
      style={{
        background: checked ? `${color}33` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${checked ? color : 'rgba(255,255,255,0.1)'}`,
        clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)',
      }}
    >
      <span
        className="absolute top-[2px] w-[14px] h-[14px] transition-all duration-300"
        style={{
          left: checked ? 'calc(100% - 16px)' : '2px',
          background: checked ? color : '#5A5248',
          clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)',
        }}
      />
    </button>
  );
}