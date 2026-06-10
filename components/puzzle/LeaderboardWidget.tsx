import { clipWidget, clipBadge } from './clipStyles';

export function LeaderboardWidget({ leaderboardData, userPoints }: 
  { leaderboardData: any[]; userPoints: number }) {
  
  const rankColors = ['#C8A96E', '#9A8F78', '#8B6A4E'];
  
  // Find user's rank
  const userRank = leaderboardData.findIndex(u => u.name === 'Trailblazer_01') + 1;
  
  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-5" style={clipWidget}>
      <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
        <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
        Top Solvers
      </div>
      {leaderboardData.slice(0, 5).map((u, i) => (
        <div key={i} className={`flex items-center gap-3 py-[9px] ${i < leaderboardData.length - 1 ? 'border-b border-[rgba(200,169,110,0.06)]' : ''}`}>
          <span className="font-['Space_Mono',monospace] text-[0.72rem] w-5 text-center font-bold"
            style={{ color: rankColors[i] ?? '#5A5248' }}>
            {u.rank || i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[0.8rem] text-[#9A8F78] truncate flex items-center gap-1">
              {u.badge && <span style={{ color: rankColors[i] }}>{u.badge}</span>}
              {u.name}
              {(u.name === 'Trailblazer_01' || (userRank === i + 1 && !leaderboardData.find(u => u.name === 'Trailblazer_01'))) && (
                <span className="text-[0.6rem] px-1 py-[1px] ml-1"
                  style={{ ...clipBadge, background: 'rgba(78,205,196,0.12)', color: '#4ECDC4', border: '1px solid rgba(78,205,196,0.3)' }}>
                  You
                </span>
              )}
            </div>
            <div className="text-[0.65rem] text-[#5A5248] mt-[1px]">{u.solved || 0} puzzles</div>
          </div>
          <span className="font-['Space_Mono',monospace] text-[0.78rem] font-bold"
            style={{ color: rankColors[i] ?? '#5A5248' }}>
            {u.pts?.toLocaleString() || 0}
          </span>
        </div>
      ))}
    </div>
  );
}