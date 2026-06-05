// Definisikan gameAccentMap langsung di file ini
const gameAccentMap: Record<string, string> = {
  all: '#C8A96E', hsr: '#4ECDC4', gi: '#6DD18A', zzz: '#A855F7', hi3: '#E05C7A',
};

interface User {
  rank: number;
  name: string;
  initials: string;
  game: string;
  title: string;
  badges: string[];
  votes: number;
}

export function Podium({ top3, accentColor }: { top3: User[]; accentColor: string }) {
  const order = [top3[1], top3[0], top3[2]];
  const heights = ['h-20', 'h-28', 'h-14'];
  const podiumRanks = [2, 1, 3];
  const medColors = ['#9AA0AA', '#F0D080', '#CD7F32'];
  const avatarSize = ['w-12 h-12', 'w-16 h-16', 'w-10 h-10'];
  const avatarBorder = ['border-[#9AA0AA]', 'border-[#F0D080]', 'border-[#CD7F32]'];
  const nameSize = ['text-[0.78rem]', 'text-[0.9rem]', 'text-[0.72rem]'];

  return (
    <div className="flex items-end justify-center gap-3 mb-8 px-4 pt-6">
      {order.map((user, i) => {
        if (!user) return null;
        const gc = gameAccentMap[user.game as any] ?? '#C8A96E';
        return (
          <div key={user.rank} className="flex flex-col items-center gap-2" style={{ flex: podiumRanks[i] === 1 ? '0 0 160px' : '0 0 130px' }}>
            {podiumRanks[i] === 1 && (
              <div className="mb-1">
                <svg width="28" height="18" viewBox="0 0 28 18">
                  <polygon points="2,16 6,4 14,12 22,4 26,16" fill="none" stroke="#F0D080" strokeWidth="1.2" strokeLinejoin="round"/>
                  <circle cx="2" cy="16" r="2" fill="#F0D080"/>
                  <circle cx="26" cy="16" r="2" fill="#F0D080"/>
                  <circle cx="14" cy="12" r="2" fill="#F0D080"/>
                </svg>
              </div>
            )}

            <div className={`${avatarSize[i]} rounded-full border-2 ${avatarBorder[i]} flex items-center justify-center font-['Cinzel',serif] font-bold shrink-0 relative`}
              style={{ background: `${gc}18`, color: gc, fontSize: podiumRanks[i] === 1 ? '0.9rem' : '0.7rem' }}>
              {user.initials}
              {podiumRanks[i] === 1 && (
                <div className="absolute inset-[-4px] rounded-full border border-[rgba(240,208,128,0.3)]" />
              )}
            </div>

            <div className="text-center">
              <div className={`font-['Rajdhani',sans-serif] font-bold ${nameSize[i]} text-[#E8E0CC]`}>{user.name}</div>
              <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">{user.title}</div>
              <div className="flex justify-center gap-1 mt-1">{user.badges.map((b, j) => <span key={j} className="text-[0.7rem]">{b}</span>)}</div>
            </div>

            <div className={`w-full ${heights[i]} relative border-t-2 flex flex-col items-center justify-start pt-2 overflow-hidden`}
              style={{ borderColor: medColors[i], background: `linear-gradient(180deg, ${medColors[i]}18 0%, transparent 100%)` }}>
              <span className="font-['Cinzel',serif] text-[1.1rem] font-bold" style={{ color: medColors[i] }}>#{podiumRanks[i]}</span>
              <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248] mt-[2px]">
                {user.votes.toLocaleString()} pts
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}