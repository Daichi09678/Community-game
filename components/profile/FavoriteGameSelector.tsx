'use client';

import { clipBadge, GameBadge, gameBadgeMap } from './GameBadge';

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';

export function FavoriteGameSelector({ selected, onChange, isEditing }: {
  selected: GameKey[]; onChange: (v: GameKey[]) => void; isEditing: boolean;
}) {
  const games: GameKey[] = ['hsr', 'gi', 'zzz', 'hi3'];
  const toggle = (g: GameKey) => {
    if (selected.includes(g)) onChange(selected.filter(x => x !== g));
    else onChange([...selected, g]);
  };
  if (!isEditing) return (
    <div className="flex gap-2 flex-wrap">
      {selected.map(g => <GameBadge key={g} game={g} />)}
    </div>
  );
  return (
    <div className="flex gap-2 flex-wrap">
      {games.map(g => {
        const info = gameBadgeMap[g];
        const active = selected.includes(g);
        return (
          <button key={g} onClick={() => toggle(g)} style={clipBadge}
            className={`px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all border
              ${active ? info.className : 'bg-transparent border-[rgba(200,169,110,0.1)] text-[#5A5248] hover:border-[rgba(200,169,110,0.3)]'}`}>
            {active ? '✓ ' : '+ '}{info.label}
          </button>
        );
      })}
    </div>
  );
}