import { RankMedal } from './RankMedal';
import { ChangeIndicator } from './ChangeIndicator';
import { GameBadge } from './GameBadge';
import { clipHexSm } from './clipStyles';

type SortMode = 'votes' | 'reports' | 'streak' | 'level';

interface User {
  rank: number;
  name: string;
  initials: string;
  game: string;
  level: number;
  reports: number;
  votes: number;
  streak: number;
  badges: string[];
  title: string;
  change: number;
}

// Definisikan langsung di sini agar tidak perlu import
const gameAccentMap: Record<string, string> = {
  all: '#C8A96E', hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A',
};

export function LeaderboardRow({ user, sortMode, accentColor, isMe }: {
  user: User; sortMode: SortMode; accentColor: string; isMe?: boolean;
}) {
  const gc = gameAccentMap[user.game as any] ?? '#C8A96E';

  return (
    <tr className={`group transition-all duration-150 ${isMe ? 'bg-[rgba(200,169,110,0.05)]' : 'hover:[&>td]:bg-[rgba(200,169,110,0.02)]'}`}>
      <td className={`px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle ${isMe ? 'border-l-2 border-l-[#C8A96E]' : ''}`}>
        <RankMedal rank={user.rank} />
      </td>
      <td className="px-2 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle text-center">
        <ChangeIndicator change={user.change} />
      </td>
      <td className="px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-['Cinzel',serif] text-[0.65rem] font-bold shrink-0"
            style={{ background: `${gc}18`, borderColor: `${gc}80`, color: gc }}>
            {user.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-[0.88rem] font-['Rajdhani',sans-serif] ${isMe ? 'text-[#C8A96E]' : 'text-[#E8E0CC]'} cursor-pointer hover:text-[#C8A96E] transition-colors`}>
                {user.name} {isMe && <span className="text-[0.6rem] text-[#C8A96E] ml-1">(You)</span>}
              </span>
              {user.badges.map((b, i) => <span key={i} className="text-[0.72rem]">{b}</span>)}
            </div>
            <div className="text-[0.67rem] text-[#5A5248]">{user.title}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle">
        <GameBadge game={user.game} />
      </td>
      <td className="px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle">
        <div className="flex items-center gap-2">
          <div className="h-[4px] w-[52px] bg-[rgba(255,255,255,0.05)] overflow-hidden" style={clipHexSm}>
            <div className="h-full transition-[width] duration-500" style={{ width: `${(user.level / 100) * 100}%`, background: gc }} />
          </div>
          <span className="font-['Space_Mono',monospace] text-[0.72rem] text-[#9A8F78]">LV.{user.level}</span>
        </div>
      </td>
      <td className="px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle">
        <span className={`font-['Space_Mono',monospace] text-[0.78rem] ${sortMode === 'reports' ? 'text-[#C8A96E]' : 'text-[#9A8F78]'}`}>
          {user.reports}
        </span>
      </td>
      <td className="px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle">
        <span className={`font-['Space_Mono',monospace] text-[0.78rem] ${sortMode === 'votes' ? 'text-[#4ECDC4]' : 'text-[#9A8F78]'}`}>
          {user.votes.toLocaleString()}
        </span>
      </td>
      <td className="px-4 py-3 border-b border-[rgba(200,169,110,0.07)] align-middle">
        <div className="flex items-center gap-1">
          <span className="text-[0.75rem]">{user.streak >= 10 ? '🔥' : '📅'}</span>
          <span className={`font-['Space_Mono',monospace] text-[0.72rem] ${sortMode === 'streak' ? 'text-[#E05C7A]' : 'text-[#9A8F78]'}`}>
            {user.streak}d
          </span>
        </div>
      </td>
    </tr>
  );
}