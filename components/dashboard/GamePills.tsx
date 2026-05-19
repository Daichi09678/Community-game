import { clipHex } from '@/components/utils/styles';
import { GameFilter, gameLabels } from '@/components/utils/constants';

interface GamePillsProps {
  activeGame: GameFilter;
  onGameChange: (game: GameFilter) => void;
}

export function GamePills({ activeGame, onGameChange }: GamePillsProps) {
  const gamePillCls = (g: GameFilter) => {
    const base = 'px-[14px] py-[5px] text-[0.75rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border border-transparent text-[#5A5248] bg-[rgba(255,255,255,0.03)]';
    const activeMap: Record<string, string> = {
      all: 'border-[#C8A96E] text-[#C8A96E] bg-[rgba(200,169,110,0.08)]',
      hsr: 'border-[#4ECDC4] text-[#4ECDC4] bg-[rgba(78,205,196,0.08)]',
      gi:  'border-[#6DD18A] text-[#6DD18A] bg-[rgba(109,209,138,0.08)]',
      zzz: 'border-[#A855F7] text-[#A855F7] bg-[rgba(168,85,247,0.08)]',
      hi3: 'border-[#E05C7A] text-[#E05C7A] bg-[rgba(224,92,122,0.08)]',
    };
    const hoverMap: Record<string, string> = {
      all: 'hover:border-[#C8A96E] hover:text-[#C8A96E]',
      hsr: 'hover:border-[#4ECDC4] hover:text-[#4ECDC4]',
      gi:  'hover:border-[#6DD18A] hover:text-[#6DD18A]',
      zzz: 'hover:border-[#A855F7] hover:text-[#A855F7]',
      hi3: 'hover:border-[#E05C7A] hover:text-[#E05C7A]',
    };
    return `${base} ${activeGame === g ? activeMap[g] : hoverMap[g]}`;
  };

  const games: GameFilter[] = ['all', 'hsr', 'gi', 'zzz', 'hi3'];

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {games.map(g => (
        <span key={g} style={clipHex} className={gamePillCls(g)} onClick={() => onGameChange(g)}>
          {gameLabels[g]}
        </span>
      ))}
    </div>
  );
}