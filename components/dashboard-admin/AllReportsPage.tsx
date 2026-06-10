'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clipBadge, clipBtn } from '@/components/common/clipStyles';

interface Report {
  id: string;
  title: string;
  authorName: string;
  game: string;
  type: string;
  votes: number;
  date: string;
  status: string;
  createdAt: string;
}

const gameColor: Record<string, string> = {
  hsr: '#4ECDC4',
  gi: '#6DD18A',
  zzz: '#A855F7',
  hi3: '#E05C7A',
  'honkai-star-rail': '#4ECDC4',
  'genshin-impact': '#6DD18A',
  'zenless-zone-zero': '#A855F7',
  'honkai-impact-3rd': '#E05C7A',
};

const typeColor: Record<string, string> = {
  guide: '#C8A96E',
  event: '#4ECDC4',
  puzzle: '#A855F7',
  build: '#6DD18A',
  report: '#C8A96E',
  bug: '#E05C7A',
};

// ✅ Status mapping untuk tampilan user-friendly
const statusStyle: Record<string, { label: string; color: string; bg: string; border: string }> = {
  published: { label: 'Approved ✓', color: '#6DD18A', bg: 'rgba(109,209,138,0.08)', border: 'rgba(109,209,138,0.3)' },
  pending: { label: 'Pending', color: '#C8A96E', bg: 'rgba(200,169,110,0.08)', border: 'rgba(200,169,110,0.3)' },
  archived: { label: 'Rejected ✗', color: '#E05C7A', bg: 'rgba(224,92,122,0.08)', border: 'rgba(224,92,122,0.3)' },
  draft: { label: 'Draft', color: '#5A5248', bg: 'rgba(90,82,72,0.08)', border: 'rgba(90,82,72,0.3)' },
};

export default function AllReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      const response = await fetch('/api/dashboard/reports', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.reports) {
          setReports(data.reports);
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.authorName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = gameFilter === 'all' || report.game === gameFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesGame && matchesType;
  });

  const games = [
    { id: 'all', label: 'All Games', color: '#C8A96E' },
    { id: 'hsr', label: 'Star Rail', color: '#4ECDC4' },
    { id: 'gi', label: 'Genshin', color: '#6DD18A' },
    { id: 'zzz', label: 'Zenless', color: '#A855F7' },
    { id: 'hi3', label: 'Honkai 3rd', color: '#E05C7A' },
  ];

  const types = [
    { id: 'all', label: 'All Types', color: '#C8A96E' },
    { id: 'guide', label: 'Guide', color: '#C8A96E' },
    { id: 'event', label: 'Event', color: '#4ECDC4' },
    { id: 'puzzle', label: 'Puzzle', color: '#A855F7' },
    { id: 'build', label: 'Build', color: '#6DD18A' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5A5248]">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-['Cinzel',serif] text-[1.1rem] font-semibold text-[#E8E0CC]">All Reports</h2>
          <p className="text-[0.75rem] text-[#5A5248] mt-1">Full report archive across all games and categories.</p>
        </div>
        <div className="font-['Space_Mono',monospace] text-[0.7rem] text-[#5A5248]">{filteredReports.length} shown</div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div
          className="flex items-center gap-2 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] px-4 py-2 w-80 transition-colors duration-200 focus-within:border-[#C8A96E]"
          style={clipBtn}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/>
            <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search reports by title or author..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-[#E8E0CC] flex-1 placeholder-[#5A5248] text-[0.85rem]"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-[#5A5248] hover:text-[#E05C7A] transition-colors">✕</button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <div className="text-[0.6rem] uppercase tracking-[0.12em] text-[#5A5248] mb-2">Game</div>
          <div className="flex flex-wrap gap-2">
            {games.map(g => (
              <button
                key={g.id}
                onClick={() => setGameFilter(g.id)}
                className={`px-3 py-[5px] text-[0.7rem] font-bold uppercase tracking-[0.06em] transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif] ${gameFilter === g.id ? 'border-[var(--color)] text-[var(--color)] bg-[rgba(200,169,110,0.08)]' : 'border-[rgba(200,169,110,0.15)] text-[#5A5248] hover:border-[var(--color)] hover:text-[var(--color)]'}`}
                style={{ ...clipBadge, '--color': g.color } as React.CSSProperties}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[0.6rem] uppercase tracking-[0.12em] text-[#5A5248] mb-2">Type</div>
          <div className="flex flex-wrap gap-2">
            {types.map(t => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id)}
                className={`px-3 py-[5px] text-[0.7rem] font-bold uppercase tracking-[0.06em] transition-all duration-200 border cursor-pointer font-['Rajdhani',sans-serif] ${typeFilter === t.id ? 'border-[var(--color)] text-[var(--color)] bg-[rgba(200,169,110,0.08)]' : 'border-[rgba(200,169,110,0.15)] text-[#5A5248] hover:border-[var(--color)] hover:text-[var(--color)]'}`}
                style={{ ...clipBadge, '--color': t.color } as React.CSSProperties}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Title', 'Author', 'Game', 'Type', 'Votes', 'Date', 'Status', 'Action'].map(h => (
                <th key={h} className="px-4 py-[10px] text-left text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] border-b border-[rgba(200,169,110,0.15)] bg-[rgba(200,169,110,0.03)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => {
              const game = report.game?.toLowerCase() || '';
              const type = report.type?.toLowerCase() || '';
              const status = report.status || 'pending';
              const s = statusStyle[status] || statusStyle.pending;
              
              return (
                <tr key={report.id} className="hover:[&>td]:bg-[rgba(200,169,110,0.02)]">
                  <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)]">
                    <span className="text-[0.85rem] font-semibold text-[#E8E0CC]">{report.title}</span>
                  </td>
                  <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)] text-[0.75rem] text-[#9A8F78]">{report.authorName || 'Anonymous'}</td>
                  <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)]">
                    <span
                      className="text-[0.65rem] font-bold px-2 py-[2px] border uppercase"
                      style={{ ...clipBadge, color: gameColor[game] || '#C8A96E', borderColor: `${gameColor[game] || '#C8A96E'}40`, background: `${gameColor[game] || '#C8A96E'}10` }}
                    >
                      {game === 'hsr' ? 'STAR RAIL' : game === 'gi' ? 'GENSHIN' : game === 'zzz' ? 'ZENLESS' : game === 'hi3' ? 'HONKAI 3RD' : game.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)]">
                    <span
                      className="text-[0.65rem] font-bold px-2 py-[2px] border uppercase"
                      style={{ ...clipBadge, color: typeColor[type] || '#C8A96E', borderColor: `${typeColor[type] || '#C8A96E'}40`, background: `${typeColor[type] || '#C8A96E'}10` }}
                    >
                      {type}
                    </span>
                  </td>
                  <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)]">
                    <span className="font-['Space_Mono',monospace] text-[0.75rem] text-[#4ECDC4]">
                      ↑ {report.votes || 0}
                    </span>
                  </td>
                  <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)] text-[#5A5248] text-[0.72rem] font-['Space_Mono',monospace]">
                    {report.date || (report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '-')}
                  </td>
                  <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)]">
                    <span
                      className="text-[0.6rem] font-bold px-2 py-[2px] border uppercase"
                      style={{
                        ...clipBadge,
                        color: s.color,
                        borderColor: s.border,
                        background: s.bg,
                      }}
                    >
                      {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)]">
                    <Link
                      href={`/HoyoAdmin/report/${report.id}`}
                      className="text-[0.65rem] px-3 py-1 rounded border border-[rgba(78,205,196,0.3)] text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.1)] transition-all"
                      style={clipBtn}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12 text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
          No reports found.
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}