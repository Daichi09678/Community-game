// components/all-report/GamePills.tsx
'use client';

import { clipHex } from '@/components/utils/styles';
import { GameFilter, gameLabels } from '@/components/utils/constants';

interface GamePillsProps {
  activeGame: GameFilter;
  onGameChange: (game: GameFilter) => void;
}

export function GamePills({ activeGame, onGameChange }: GamePillsProps) {
  const gamePillCls = (g: GameFilter) => {
    const base = 'px-[14px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border';
    
    // Warna untuk masing-masing game
    const activeBorder: Record<string, string> = {
      all: 'border-[#C8A96E]',
      hsr: 'border-[#4ECDC4]',
      gi: 'border-[#6DD18A]',
      zzz: 'border-[#A855F7]',
      hi3: 'border-[#E05C7A]',
    };
    
    const activeText: Record<string, string> = {
      all: 'text-[#C8A96E]',
      hsr: 'text-[#4ECDC4]',
      gi: 'text-[#6DD18A]',
      zzz: 'text-[#A855F7]',
      hi3: 'text-[#E05C7A]',
    };
    
    const activeBg: Record<string, string> = {
      all: 'bg-[rgba(200,169,110,0.08)]',
      hsr: 'bg-[rgba(78,205,196,0.08)]',
      gi: 'bg-[rgba(109,209,138,0.08)]',
      zzz: 'bg-[rgba(168,85,247,0.08)]',
      hi3: 'bg-[rgba(224,92,122,0.08)]',
    };
    
    // Warna hover untuk non-active
    const hoverBorder: Record<string, string> = {
      all: 'hover:border-[#C8A96E]',
      hsr: 'hover:border-[#4ECDC4]',
      gi: 'hover:border-[#6DD18A]',
      zzz: 'hover:border-[#A855F7]',
      hi3: 'hover:border-[#E05C7A]',
    };
    
    const hoverText: Record<string, string> = {
      all: 'hover:text-[#C8A96E]',
      hsr: 'hover:text-[#4ECDC4]',
      gi: 'hover:text-[#6DD18A]',
      zzz: 'hover:text-[#A855F7]',
      hi3: 'hover:text-[#E05C7A]',
    };
    
    const hoverBg: Record<string, string> = {
      all: 'hover:bg-[rgba(200,169,110,0.04)]',
      hsr: 'hover:bg-[rgba(78,205,196,0.04)]',
      gi: 'hover:bg-[rgba(109,209,138,0.04)]',
      zzz: 'hover:bg-[rgba(168,85,247,0.04)]',
      hi3: 'hover:bg-[rgba(224,92,122,0.04)]',
    };
    
    if (activeGame === g) {
      // Active state: border + text + background berwarna
      return `${base} ${activeBorder[g]} ${activeText[g]} ${activeBg[g]}`;
    } else {
      // Non-active state: default warna abu-abu, hover berwarna
      return `${base} border-transparent text-[#5A5248] bg-[rgba(255,255,255,0.03)] ${hoverBorder[g]} ${hoverText[g]} ${hoverBg[g]}`;
    }
  };

  const games: GameFilter[] = ['all', 'hsr', 'gi', 'zzz', 'hi3'];

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {games.map(g => (
        <span 
          key={g} 
          style={clipHex} 
          className={gamePillCls(g)} 
          onClick={() => onGameChange(g)}
        >
          {gameLabels[g]}
        </span>
      ))}
    </div>
  );
}