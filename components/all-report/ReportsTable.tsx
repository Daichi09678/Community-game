'use client';

import Link from 'next/link';
import { GameBadge } from './GameBadge';
import { TypeBadge } from './TypeBadge';
import { clipHexSm } from '@/components/common/clipStyles';

type TypeFilter = 'all' | 'guide' | 'event' | 'puzzle' | 'build';

interface Report {
  id: number;
  title: string;
  type: string;
  game: string;
  author: string;
  initials: string;
  rating: number;
  votes: number;
  date: string;
  version: string;
}

const renderStars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

export function ReportsTable({
  filteredReports,
  filterType,
  setFilterType,
  loading = false,
}: {
  filteredReports: Report[];
  filterType: TypeFilter;
  setFilterType: (f: TypeFilter) => void;
  loading?: boolean;
}) {
  const typeFilters: TypeFilter[] = ['all', 'guide', 'event', 'puzzle', 'build'];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'guide': return 'Guides';
      case 'event': return 'Events';
      case 'puzzle': return 'Puzzles';
      case 'build': return 'Builds';
      default: return 'All';
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-8 text-center">
        <div className="animate-pulse text-[#5A5248]">Loading reports...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="font-['Cinzel'] text-[0.95rem] font-semibold text-[#E8E0CC]">Reports Library</div>
        <div className="text-[#5A5248] text-[0.75rem] font-['Space_Mono',monospace]">{filteredReports.length} reports found</div>
      </div>

      <div className="flex gap-[6px] mb-5 flex-wrap">
        {typeFilters.map(f => (
          <button
            key={f}
            style={clipHexSm}
            onClick={() => setFilterType(f)}
            className={`px-[14px] py-[6px] text-[0.78rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif]
              ${filterType === f
                ? 'bg-[rgba(200,169,110,0.1)] border-[#C8A96E] text-[#C8A96E]'
                : 'bg-transparent border-[rgba(200,169,110,0.15)] text-[#9A8F78] hover:border-[rgba(200,169,110,0.35)] hover:text-[#E8E0CC]'
              }`}
          >
            {getTypeLabel(f)}
          </button>
        ))}
      </div>

      <table className="w-full border-collapse bg-[#0C1220] border border-[rgba(200,169,110,0.15)]">
        <thead>
          <tr>
            {['Report Title', 'Game', 'Type', 'Author', 'Rating', 'Votes', 'Date'].map((h, idx) => (
              <th
                key={idx}
                className="px-4 py-[10px] text-left text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] border-b border-[rgba(200,169,110,0.15)] bg-[rgba(200,169,110,0.03)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredReports.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-8 text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
                No reports found for this filter.
              </td>
            </tr>
          ) : (
            filteredReports.map((report) => (
              <tr key={report.id} className="group hover:[&>td]:bg-[rgba(200,169,110,0.03)]">
                <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle">
                  <Link 
                    href={`/UserHoyo/report/${report.id}`}
                    className="font-semibold text-[#E8E0CC] cursor-pointer transition-colors duration-200 hover:text-[#C8A96E] no-underline"
                  >
                    {report.title}
                  </Link>
                </td>
                <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle">
                  <GameBadge game={report.game} />
                </td>
                <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle">
                  <TypeBadge type={report.type} />
                </td>
                <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle">
                  <div className="flex items-center gap-2">
                    <div className="w-[26px] h-[26px] rounded-full bg-[rgba(200,169,110,0.08)] border border-[#8B6A2E] flex items-center justify-center font-['Cinzel',serif] text-[0.6rem] text-[#C8A96E] font-bold shrink-0">
                      {report.initials}
                    </div>
                    <span className="text-[0.82rem] text-[#9A8F78]">{report.author}</span>
                  </div>
                </td>
                <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle">
                  <span className="text-[0.75rem] text-[#C8A96E] tracking-[1px]">{renderStars(report.rating)}</span>
                </td>
                <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle">
                  <span className="font-['Space_Mono',monospace] text-[0.78rem] text-[#4ECDC4]">↑ {report.votes.toLocaleString()}</span>
                </td>
                <td className="px-4 py-[14px] text-[0.88rem] border-b border-[rgba(200,169,110,0.07)] align-middle text-[#5A5248] text-[0.78rem] font-['Space_Mono',monospace]">
                  {report.date}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}