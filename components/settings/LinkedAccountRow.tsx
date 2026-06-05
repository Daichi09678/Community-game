'use client';

import { useState } from 'react';
import { GameBadge } from './GameBadge';
import { clipBadge } from './clipStyles';

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';

export function LinkedAccountRow({ game, uid, linked, color }: {
  game: GameKey; uid?: string; linked: boolean; color: string;
}) {
  const [isLinked, setIsLinked] = useState(linked);
  const [inputUid, setInputUid] = useState(uid || '');
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex items-center gap-4 py-4 border-b border-[rgba(200,169,110,0.06)] last:border-0">
      <div className="w-9 h-9 shrink-0 flex items-center justify-center border" style={{
        borderColor: color, background: `${color}10`,
        clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)',
      }}>
        <span className="text-[0.6rem] font-bold font-['Space_Mono',monospace]" style={{ color }}>{game.toUpperCase()}</span>
      </div>
      <div className="flex-1">
        <GameBadge game={game} />
        <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] mt-[3px]">
          {isLinked ? `UID: ${inputUid}` : 'Not linked'}
        </div>
      </div>
      {editing && isLinked && (
        <input
          value={inputUid}
          onChange={e => setInputUid(e.target.value)}
          placeholder="Enter UID"
          className="bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.25)] text-[#C8A96E] text-[0.7rem] font-['Space_Mono',monospace] outline-none px-2 py-1 w-28"
          style={clipBadge}
        />
      )}
      <div className="flex gap-2">
        {isLinked && (
          <button
            onClick={() => setEditing(!editing)}
            className="px-3 py-[5px] text-[0.65rem] font-['Space_Mono',monospace] border border-[rgba(200,169,110,0.2)] text-[#9A8F78] hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.4)] transition-all duration-200 bg-transparent cursor-pointer"
            style={clipBadge}
          >
            {editing ? 'Save' : 'Edit'}
          </button>
        )}
        <button
          onClick={() => {
            if (isLinked) { setIsLinked(false); setInputUid(''); setEditing(false); }
            else { setIsLinked(true); }
          }}
          className="px-3 py-[5px] text-[0.65rem] font-['Rajdhani',sans-serif] font-bold border transition-all duration-200 cursor-pointer bg-transparent"
          style={{
            ...clipBadge,
            borderColor: isLinked ? 'rgba(224,92,122,0.3)' : `${color}44`,
            color: isLinked ? '#E05C7A' : color,
            background: isLinked ? 'rgba(224,92,122,0.05)' : `${color}0D`,
          }}
        >
          {isLinked ? 'Unlink' : '+ Link'}
        </button>
      </div>
    </div>
  );
}