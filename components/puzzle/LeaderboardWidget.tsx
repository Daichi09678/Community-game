import { clipWidget, clipBadge } from './clipStyles';

const leaderboard = [
  { rank: 1, name: 'AeonWalker_X', pts: 4820, solved: 16, badge: '◆' },
  { rank: 2, name: 'Stelle_Dream', pts: 4200, solved: 14, badge: '◆' },
  { rank: 3, name: 'HerrsRaiden',  pts: 3950, solved: 13, badge: '◆' },
  { rank: 4, name: 'PhaetonXX',    pts: 3400, solved: 11, badge: '' },
  { rank: 5, name: 'Trailblazer_01', pts: 2680, solved: 9, badge: '' },
];

const rankColors = ['#C8A96E', '#9A8F78', '#8B6A4E'];

export function LeaderboardWidget() {
  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
      <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
        <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
        Top Solvers
      </div>
      {leaderboard.map((u, i) => (
        <div key={i} className={`flex items-center gap-3 py-[9px] ${i < leaderboard.length - 1 ? 'border-b border-[rgba(200,169,110,0.06)]' : ''}`}>
          <span className="font-['Space_Mono',monospace] text-[0.72rem] w-5 text-center font-bold"
            style={{ color: rankColors[i] ?? '#5A5248' }}>
            {u.rank}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[0.8rem] text-[#9A8F78] truncate flex items-center gap-1">
              {u.badge && <span style={{ color: rankColors[i] }}>{u.badge}</span>}
              {u.name}
              {u.name === 'Trailblazer_01' && (
                <span className="text-[0.6rem] px-1 py-[1px] ml-1"
                  style={{ ...clipBadge, background: 'rgba(78,205,196,0.12)', color: '#4ECDC4', border: '1px solid rgba(78,205,196,0.3)' }}>
                  You
                </span>
              )}
            </div>
            <div className="text-[0.65rem] text-[#5A5248] mt-[1px]">{u.solved} puzzles</div>
          </div>
          <span className="font-['Space_Mono',monospace] text-[0.78rem] font-bold"
            style={{ color: rankColors[i] ?? '#5A5248' }}>
            {u.pts.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}