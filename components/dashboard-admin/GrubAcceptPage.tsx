'use client';

import { useState, useEffect } from 'react';
import { clipBadge, clipBtn, clipWidget } from '@/components/common/clipStyles';

interface PendingReport {
  id: number;
  title: string;
  author: string;
  game: string;
  type: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const PENDING_REPORTS: PendingReport[] = [
  { id: 101, title: 'Arlecchino Phase 3 Strategy', author: 'AetherVoyager', game: 'gi', type: 'guide', submittedAt: '2025-06-07 14:30', status: 'pending' },
  { id: 102, title: 'HSR Ruan Mei Build v2.6', author: 'StarRailCrafter', game: 'hsr', type: 'build', submittedAt: '2025-06-07 12:10', status: 'pending' },
  { id: 103, title: 'ZZZ Hollow Zero Season 2', author: 'LunarWatcher', game: 'zzz', type: 'event', submittedAt: '2025-06-06 22:45', status: 'pending' },
  { id: 104, title: 'HI3 Starfall Emblem Puzzle', author: 'NightOwlGamer', game: 'hi3', type: 'puzzle', submittedAt: '2025-06-06 18:00', status: 'pending' },
];

const gameColor: Record<string, string> = {
  hsr: '#4ECDC4',
  gi: '#6DD18A',
  zzz: '#A855F7',
  hi3: '#E05C7A',
};

export default function GrubAcceptPage() {
  const [reports, setReports] = useState<PendingReport[]>(PENDING_REPORTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi fetch data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (id: number, action: 'accepted' | 'rejected') => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mb-6 relative">
            <svg width="80" height="80" viewBox="0 0 28 28" className="mx-auto">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2">
                <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
              </polygon>
              <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="y2" values="10.5;9;10.5" dur="1.5s" repeatCount="indefinite" />
              </line>
              <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="y1" values="17.5;19;17.5" dur="1.5s" repeatCount="indefinite" />
              </line>
              <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="x2" values="10.5;9;10.5" dur="1.5s" repeatCount="indefinite" />
              </line>
              <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8">
                <animate attributeName="x1" values="17.5;19;17.5" dur="1.5s" repeatCount="indefinite" />
              </line>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
          <p className="text-[#C8A96E] font-['Rajdhani',sans-serif] text-xs tracking-wider animate-pulse">
            LOADING PENDING REPORTS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-['Cinzel',serif] text-[1.1rem] font-semibold text-[#E8E0CC]">Grub Accept</h2>
          <p className="text-[0.75rem] text-[#5A5248] mt-1">Review and approve submitted reports before they go live.</p>
        </div>
        <div
          className="text-[0.7rem] font-['Space_Mono',monospace] px-3 py-1 border"
          style={{ ...clipBadge, color: '#4ECDC4', borderColor: 'rgba(78,205,196,0.3)', background: 'rgba(78,205,196,0.08)' }}
        >
          {pendingCount} Pending
        </div>
      </div>

      <div className="space-y-3">
        {reports.map(report => (
          <div
            key={report.id}
            className="bg-[#0C1220] border p-5 transition-all"
            style={{
              ...clipWidget,
              borderColor: report.status === 'accepted'
                ? 'rgba(78,205,196,0.3)'
                : report.status === 'rejected'
                ? 'rgba(224,92,122,0.3)'
                : 'rgba(200,169,110,0.15)',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[0.6rem] font-bold px-2 py-[2px] border uppercase"
                    style={{ ...clipBadge, color: gameColor[report.game], borderColor: `${gameColor[report.game]}40`, background: `${gameColor[report.game]}10` }}
                  >
                    {report.game.toUpperCase()}
                  </span>
                  <span
                    className="text-[0.6rem] font-bold px-2 py-[2px] border uppercase"
                    style={{ ...clipBadge, color: '#C8A96E', borderColor: 'rgba(200,169,110,0.3)', background: 'rgba(200,169,110,0.05)' }}
                  >
                    {report.type}
                  </span>
                  {report.status !== 'pending' && (
                    <span
                      className="text-[0.6rem] font-bold px-2 py-[2px] border uppercase"
                      style={{
                        ...clipBadge,
                        color: report.status === 'accepted' ? '#4ECDC4' : '#E05C7A',
                        borderColor: report.status === 'accepted' ? 'rgba(78,205,196,0.4)' : 'rgba(224,92,122,0.4)',
                        background: report.status === 'accepted' ? 'rgba(78,205,196,0.08)' : 'rgba(224,92,122,0.08)',
                      }}
                    >
                      {report.status === 'accepted' ? '✓ Accepted' : '✕ Rejected'}
                    </span>
                  )}
                </div>
                <div className="font-semibold text-[0.9rem] text-[#E8E0CC] mb-1">{report.title}</div>
                <div className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">
                  by <span className="text-[#9A8F78]">{report.author}</span> · {report.submittedAt}
                </div>
              </div>

              {report.status === 'pending' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAction(report.id, 'accepted')}
                    className="px-4 py-[6px] text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#050810] transition-all hover:brightness-110 font-['Rajdhani',sans-serif]"
                    style={{ background: 'linear-gradient(135deg, #2A7A4A, #4ECDC4)', ...clipBtn }}
                  >
                    ✓ Accept
                  </button>
                  <button
                    onClick={() => handleAction(report.id, 'rejected')}
                    className="px-4 py-[6px] text-[0.72rem] font-bold uppercase tracking-[0.08em] border border-[rgba(224,92,122,0.4)] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.1)] transition-all font-['Rajdhani',sans-serif]"
                    style={clipBtn}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {pendingCount === 0 && reports.length > 0 && (
        <div className="text-center py-12 text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
          All reports have been reviewed.
        </div>
      )}

      {reports.length === 0 && (
        <div className="text-center py-12 text-[#5A5248] font-['Space_Mono',monospace] text-[0.8rem]">
          No pending reports to review.
        </div>
      )}
    </div>
  );
}