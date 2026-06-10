'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import { clipBadge, clipBtn } from '@/components/common/clipStyles';

const GAME_MAP: Record<string, { label: string; color: string }> = {
  hsr: { label: 'Honkai: Star Rail', color: '#4ECDC4' },
  gi:  { label: 'Genshin Impact',    color: '#6DD18A' },
  zzz: { label: 'Zenless Zone Zero', color: '#A855F7' },
  hi3: { label: 'Honkai Impact 3rd', color: '#E05C7A' },
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: 'Approved ✓', color: '#6DD18A', bg: 'rgba(109,209,138,0.08)' },
  pending:   { label: 'Pending',   color: '#C8A96E', bg: 'rgba(200,169,110,0.08)' },
  archived:  { label: 'Rejected ✗', color: '#E05C7A', bg: 'rgba(224,92,122,0.08)' },
  draft:     { label: 'Draft',     color: '#5A5248', bg: 'rgba(90,82,72,0.08)' },
};

interface Report {
  id: string | number;
  title: string;
  type: string;
  game: string;
  content: string;
  status: string;
  version: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  username?: string;
  views?: number;
  votes?: number;
}

interface AdminReportDetailClientProps {
  reportId: string;
}

const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7L5.5 10.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const getReportIdDisplay = (id: string | number): string => {
  const idStr = String(id);
  return idStr.slice(-8).toUpperCase();
};

const getShortId = (id: string | number): string => {
  const idStr = String(id);
  return idStr.slice(0, 8);
};

export default function AdminReportDetailClient({ reportId }: AdminReportDetailClientProps) {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/dashboard/reports/${reportId}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Report not found');
        const data = await res.json();
        setReport(data.report || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    if (reportId) fetchReport();
  }, [reportId]);

  const handleReview = async (action: 'accept' | 'reject') => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}/review`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, note: '' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Action failed');
      
      showToast(action === 'accept' ? '✓ Report accepted successfully!' : '✗ Report rejected', 'ok');
      
      // Redirect ke All Reports setelah 1 detik
      setTimeout(() => {
        router.push('/HoyoAdmin/all-reports');
      }, 1000);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Action failed', 'err');
      setActionLoading(false);
    }
  };

  const game = report ? GAME_MAP[report.game] : null;
  const status = report ? STATUS_MAP[report.status] : STATUS_MAP.pending;
  const isReviewed = report && (report.status === 'published' || report.status === 'archived');

  if (loading) {
    return (
      <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(224,92,122,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.03) 0%, transparent 50%)`,
        }} />

        <AdminSidebar activePage="all-reports" />

        <main className="flex-1 flex flex-col min-h-screen relative z-10" style={{ marginLeft: '260px' }}>
          <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.85)' }}>
            <div>
              <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
                Hoyoverse Hub — <span className="text-[#C8A96E]">Report Detail</span>
              </div>
              <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">
                Viewing report details
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-[7px] text-[0.75rem] font-bold tracking-[0.08em] uppercase font-['Rajdhani',sans-serif]" style={{ background: 'rgba(224,92,122,0.1)', border: '1px solid rgba(224,92,122,0.3)', color: '#E05C7A', ...clipBtn }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L11.5 3.5V7.5C11.5 10 7 12 7 12C7 12 2.5 10 2.5 7.5V3.5L7 1.5Z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 7L6.5 8.5L9 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Admin Mode
            </div>
          </div>

          <div style={{ padding: '32px', flex: 1 }}>
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
                    <div className="w-16 h-16 border-2 border-[#C8A96E] border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
                <p className="mt-6 text-[#C8A96E] font-['Rajdhani',sans-serif] text-sm tracking-wider animate-pulse">
                  LOADING REPORT...
                </p>
              </div>
            </div>
          </div>
        </main>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
          .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(224,92,122,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.03) 0%, transparent 50%)`,
        }} />

        <AdminSidebar activePage="all-reports" />

        <main className="flex-1 flex flex-col min-h-screen relative z-10" style={{ marginLeft: '260px' }}>
          <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.85)' }}>
            <div>
              <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
                Hoyoverse Hub — <span className="text-[#C8A96E]">Report Detail</span>
              </div>
              <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">
                Viewing report details
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-[7px] text-[0.75rem] font-bold tracking-[0.08em] uppercase font-['Rajdhani',sans-serif]" style={{ background: 'rgba(224,92,122,0.1)', border: '1px solid rgba(224,92,122,0.3)', color: '#E05C7A', ...clipBtn }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L11.5 3.5V7.5C11.5 10 7 12 7 12C7 12 2.5 10 2.5 7.5V3.5L7 1.5Z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 7L6.5 8.5L9 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Admin Mode
            </div>
          </div>

          <div style={{ padding: '32px', flex: 1 }}>
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4 opacity-20">📄</div>
              <h1 className="font-['Cinzel',serif] text-xl text-[#C8A96E] mb-2">Report Not Found</h1>
              <p className="text-[#5A5248] mb-6">{error || 'The report you are looking for does not exist.'}</p>
              <button onClick={() => router.push('/HoyoAdmin/all-reports')} className="text-[#C8A96E] border border-[rgba(200,169,110,0.3)] px-6 py-2 rounded hover:bg-[rgba(200,169,110,0.1)] transition-all" style={clipBtn}>
                ← Back to Reports
              </button>
            </div>
          </div>
        </main>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          padding: '10px 20px', borderRadius: '8px',
          background: toast.type === 'ok' ? 'rgba(109,209,138,0.2)' : 'rgba(224,92,122,0.2)',
          border: `1px solid ${toast.type === 'ok' ? '#6DD18A' : '#E05C7A'}`,
          color: toast.type === 'ok' ? '#6DD18A' : '#E05C7A',
          fontFamily: "'Space Mono', monospace", fontSize: '0.75rem',
          animation: 'fadein 0.2s ease',
        }}>
          {toast.msg}
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(224,92,122,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.03) 0%, transparent 50%)`,
      }} />

      <AdminSidebar activePage="all-reports" />

      <main className="flex-1 flex flex-col min-h-screen relative z-10" style={{ marginLeft: '260px' }}>
        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.85)' }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">
              Hoyoverse Hub — <span className="text-[#C8A96E]">Report Detail</span>
            </div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">
              Viewing report #{getReportIdDisplay(report.id)}
            </div>
          </div>
          <div className="flex gap-[10px] items-center">
            <button onClick={() => router.push('/HoyoAdmin/all-reports')} className="flex items-center gap-2 px-4 py-[7px] text-[0.75rem] font-bold tracking-[0.08em] uppercase font-['Rajdhani',sans-serif] bg-[rgba(200,169,110,0.1)] border border-[rgba(200,169,110,0.3)] text-[#C8A96E] rounded transition-all hover:bg-[rgba(200,169,110,0.2)]" style={clipBtn}>
              <BackIcon /> All Reports
            </button>
            <div className="flex items-center gap-2 px-4 py-[7px] text-[0.75rem] font-bold tracking-[0.08em] uppercase font-['Rajdhani',sans-serif]" style={{ background: 'rgba(224,92,122,0.1)', border: '1px solid rgba(224,92,122,0.3)', color: '#E05C7A', ...clipBtn }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L11.5 3.5V7.5C11.5 10 7 12 7 12C7 12 2.5 10 2.5 7.5V3.5L7 1.5Z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 7L6.5 8.5L9 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Admin Mode
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {/* Header */}
          <div className="mb-6">
            {game && (
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-0.5" style={{ background: game.color }} />
                <span className="text-[0.65rem] font-['Space_Mono',monospace] tracking-wider" style={{ color: game.color }}>{game.label}</span>
                <span className="text-[0.6rem] text-[#3A3028]">· #{getReportIdDisplay(report.id)}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-[0.6rem] px-3 py-1 rounded bg-[rgba(200,169,110,0.08)] border border-[rgba(200,169,110,0.2)] text-[#C8A96E]" style={clipBadge}>{report.type}</span>
              <span className="text-[0.6rem] px-3 py-1 rounded" style={{ ...clipBadge, color: status.color, background: status.bg, border: `1px solid ${status.color}30` }}>{status.label}</span>
            </div>

            <h1 className="font-['Cinzel',serif] text-2xl font-bold text-[#E8E0CC] mb-4">{report.title}</h1>

            {report.tags && report.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {report.tags.map((tag, i) => (
                  <span key={i} className="text-[0.6rem] px-2 py-1 rounded bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.1)] text-[#5A5248]" style={clipBadge}>#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Author', value: report.username || 'Anonymous' },
              { label: 'Submitted', value: new Date(report.createdAt).toLocaleDateString() },
              { label: 'Version', value: `v${report.version || '1.0'}` },
              { label: 'Status', value: status.label, color: status.color },
            ].map((item, i) => (
              <div key={i} className="bg-[#0C1220] border border-[rgba(200,169,110,0.1)] p-4 rounded-lg">
                <div className="text-[0.55rem] font-['Space_Mono',monospace] text-[#5A5248] uppercase tracking-wider mb-1">{item.label}</div>
                <div className="text-[0.85rem] font-semibold" style={{ color: item.color || '#9A8F78' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Views', value: report.views || 0, icon: '👁', color: '#4ECDC4' },
              { label: 'Votes', value: report.votes || 0, icon: '👍', color: '#6DD18A' },
              { label: 'Report ID', value: getShortId(report.id), icon: '🆔', color: '#C8A96E' },
            ].map((s, i) => (
              <div key={i} className="bg-[#0C1220] border border-[rgba(200,169,110,0.1)] p-4 rounded-lg flex items-center gap-3">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <div className="text-[0.55rem] font-['Space_Mono',monospace] text-[#5A5248] uppercase">{s.label}</div>
                  <div className="font-['Cinzel',serif] text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] rounded-lg overflow-hidden mb-8">
            <div className="border-b border-[rgba(200,169,110,0.1)] px-6 py-3">
              <span className="font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] uppercase tracking-wider">Report Content</span>
            </div>
            <div className="p-6">
              <div 
                className="prose prose-invert max-w-none"
                style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.88rem', lineHeight: 1.7, color: '#C8C0B0' }}
                dangerouslySetInnerHTML={{ __html: report.content || '<p class="text-[#5A5248]">No content provided.</p>' }}
              />
            </div>
          </div>

          {/* Admin Actions - Hanya tampil jika belum direview */}
          {!isReviewed && (
            <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] rounded-lg overflow-hidden">
              <div className="border-b border-[rgba(200,169,110,0.1)] px-6 py-3">
                <span className="font-['Cinzel',serif] text-[0.75rem] text-[#C8A96E] uppercase tracking-wider">Admin Actions</span>
              </div>
              <div className="p-6">
                <div className="flex gap-3">
                  <button onClick={() => handleReview('accept')} disabled={actionLoading} className="px-6 py-2 text-[0.75rem] font-bold uppercase tracking-wider rounded bg-[rgba(109,209,138,0.1)] border border-[#6DD18A] text-[#6DD18A] hover:bg-[rgba(109,209,138,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed" style={clipBtn}>
                    {actionLoading ? 'Processing...' : <span className="flex items-center gap-1"><CheckIcon /> Accept</span>}
                  </button>
                  <button onClick={() => handleReview('reject')} disabled={actionLoading} className="px-6 py-2 text-[0.75rem] font-bold uppercase tracking-wider rounded bg-[rgba(224,92,122,0.1)] border border-[#E05C7A] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed" style={clipBtn}>
                    {actionLoading ? 'Processing...' : <span className="flex items-center gap-1"><XIcon /> Reject</span>}
                  </button>
                  <button className="px-6 py-2 text-[0.75rem] font-bold uppercase tracking-wider rounded bg-[rgba(168,85,247,0.08)] border border-[rgba(168,85,247,0.3)] text-[#A855F7] hover:bg-[rgba(168,85,247,0.15)] transition-all ml-auto" style={clipBtn}>
                    🚩 Flag
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Jika sudah direview, tampilkan pesan */}
          {isReviewed && (
            <div className="bg-[#0C1220] border border-[rgba(109,209,138,0.3)] rounded-lg overflow-hidden">
              <div className="border-b border-[rgba(109,209,138,0.1)] px-6 py-3 bg-[rgba(109,209,138,0.05)]">
                <span className="font-['Cinzel',serif] text-[0.75rem] text-[#6DD18A] uppercase tracking-wider flex items-center gap-2">
                  <CheckIcon /> Report Already Reviewed
                </span>
              </div>
              <div className="p-6">
                <p className="text-[0.85rem] text-[#9A8F78]">
                  This report has been <span style={{ color: report.status === 'published' ? '#6DD18A' : '#E05C7A' }} className="font-bold">
                    {report.status === 'published' ? 'ACCEPTED ✓' : 'REJECTED ✗'}
                  </span> and is visible to the user as <span className="font-bold text-[#6DD18A]">"Approved"</span>.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
        @keyframes fadein { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}