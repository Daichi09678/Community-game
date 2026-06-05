'use client';

import { GameBadge } from './GameBadge';

interface Report {
  id: string;
  title: string;
  game: string;
  votes: number;
  type: string;
  date: string;
  status: string;
}

export function ReportRow({ report }: { report: Report }) {
  return (
    <div className="flex items-center gap-4 p-3 border-b border-[rgba(200,169,110,0.07)] hover:bg-[rgba(200,169,110,0.03)] transition-all duration-200 cursor-pointer group">
      <div className="font-['Space_Mono',monospace] text-[0.58rem] text-[#5A5248] shrink-0 w-12">{report.id}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[0.82rem] font-semibold text-[#E8E0CC] group-hover:text-[#C8A96E] transition-colors duration-200 truncate font-['Rajdhani',sans-serif]">
          {report.title}
        </div>
        <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">{report.type}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <GameBadge game={report.game} />
        <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#4ECDC4]">↑ {report.votes}</span>
        <span className="text-[#5A5248] text-[0.62rem] font-['Space_Mono',monospace]">{report.date}</span>
      </div>
    </div>
  );
}