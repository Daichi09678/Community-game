'use client';

import { useState } from 'react';
import { clipBadge, clipBtn } from '@/components/common/clipStyles';

interface Report {
  id: number;
  title: string;
  author: string;
  game: string;
  type: string;
  votes: number;
  date: string;
  status: 'live' | 'removed';
}

const ALL_REPORTS: Report[] = [
  { id: 1, title: 'Kafka Max Build — v2.5', author: 'StarRailCrafter', game: 'hsr', type: 'build', votes: 671, date: '2025-06-07', status: 'live' },
  { id: 2, title: 'Penacony Dreamscape Full Guide', author: 'AetherVoyager', game: 'hsr', type: 'guide', votes: 342, date: '2025-06-06', status: 'live' },
  { id: 3, title: 'Silver Wolf S1 Guide', author: 'StarRailCrafter', game: 'hsr', type: 'guide', votes: 430, date: '2025-06-03', status: 'live' },
  { id: 4, title: 'Genshin Fontaine Puzzle Compendium', author: 'LunarWatcher', game: 'gi', type: 'puzzle', votes: 89, date: '2025-06-01', status: 'live' },
  { id: 5, title: 'Memory of Chaos P12 Guide', author: 'StarRailCrafter', game: 'hsr', type: 'event', votes: 510, date: '2025-05-28', status: 'live' },
  { id: 6, title: 'HI3 Elysian Realm Survival Tips', author: 'NightOwlGamer', game: 'hi3', type: 'guide', votes: 34, date: '2025-04-29', status: 'live' },
  { id: 7, title: '[SPAM] Click here for primos', author: 'ZZZHackerX', game: 'zzz', type: 'guide', votes: -5, date: '2025-05-31', status: 'removed' },
];

const gameColor: Record<string, string> = {
  hsr: '#4ECDC4',
  gi: '#6DD18A',
  zzz: '#A855F7',
  hi3: '#E05C7A',
};

const typeColor: Record<string, string> = {
  guide: '#C8A96E',
  event: '#4ECDC4',
  puzzle: '#A855F7',
  build: '#6DD18A',
};

export default function AllReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredReports = ALL_REPORTS.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.author.toLowerCase().includes(searchTerm.toLowerCase());
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
              {['#', 'Title', 'Author', 'Game', 'Type', 'Votes', 'Date', 'Status'].map(h => (
                <th key={h} className="px-4 py-[10px] text-left text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] border-b border-[rgba(200,169,110,0.15)] bg-[rgba(200,169,110,0.03)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, i) => (
              <tr key={report.id} className="hover:[&>td]:bg-[rgba(200,169,110,0.02)]">
                <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)] text-[#5A5248] font-['Space_Mono',monospace] text-[0.72rem]">{report.id}</td>
                <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)]">
                  <span className="text-[0.85rem] font-semibold text-[#E8E0CC]">{report.title}</span>
                </td>
                <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)] text-[0.75rem] text-[#9A8F78]">{report.author}</td>
                <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)]">
                  <span
                    className="text-[0.65rem] font-bold px-2 py-[2px] border uppercase"
                    style={{ ...clipBadge, color: gameColor[report.game], borderColor: `${gameColor[report.game]}40`, background: `${gameColor[report.game]}10` }}
                  >
                    {report.game.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)]">
                  <span
                    className="text-[0.65rem] font-bold px-2 py-[2px] border uppercase"
                    style={{ ...clipBadge, color: typeColor[report.type], borderColor: `${typeColor[report.type]}40`, background: `${typeColor[report.type]}10` }}
                  >
                    {report.type}
                  </span>
                </td>
                <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)]">
                  <span className={`font-['Space_Mono',monospace] text-[0.75rem] ${report.votes < 0 ? 'text-[#E05C7A]' : 'text-[#4ECDC4]'}`}>
                    {report.votes >= 0 ? '↑' : '↓'} {Math.abs(report.votes)}
                  </span>
                </td>
                <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)] text-[#5A5248] text-[0.72rem] font-['Space_Mono',monospace]">{report.date}</td>
                <td className="px-4 py-[12px] border-b border-[rgba(200,169,110,0.07)]">
                  <span
                    className="text-[0.6rem] font-bold px-2 py-[2px] border uppercase"
                    style={{
                      ...clipBadge,
                      color: report.status === 'live' ? '#4ECDC4' : '#E05C7A',
                      borderColor: report.status === 'live' ? 'rgba(78,205,196,0.3)' : 'rgba(224,92,122,0.3)',
                      background: report.status === 'live' ? 'rgba(78,205,196,0.08)' : 'rgba(224,92,122,0.08)',
                    }}
                  >
                    {report.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}