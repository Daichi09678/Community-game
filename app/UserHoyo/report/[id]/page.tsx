'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// ─── THEME CONSTANTS ────────────────────────────────────────────────────────
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' };
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' };
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const GAME_MAP: Record<string, { label: string; color: string }> = {
  hsr: { label: 'Honkai: Star Rail', color: '#4ECDC4' },
  gi:  { label: 'Genshin Impact',    color: '#6DD18A' },
  zzz: { label: 'Zenless Zone Zero', color: '#A855F7' },
  hi3: { label: 'Honkai Impact 3rd', color: '#E05C7A' },
};

const CATEGORY_MAP: Record<string, { label: string; icon: string }> = {
  guide:  { label: 'Guide',  icon: '📚' },
  event:  { label: 'Event',  icon: '🎪' },
  puzzle: { label: 'Puzzle', icon: '🧩' },
  build:  { label: 'Build',  icon: '⚔️' },
};

// Status map untuk menampilkan badge yang sesuai
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: 'APPROVED', color: '#6DD18A', bg: 'rgba(109,209,138,0.08)' },
  draft:     { label: 'DRAFT',    color: '#C8A96E', bg: 'rgba(200,169,110,0.08)' },
  archived:  { label: 'REJECTED', color: '#E05C7A', bg: 'rgba(224,92,122,0.08)'  },
  pending:   { label: 'PENDING',  color: '#C8A96E', bg: 'rgba(200,169,110,0.08)'  },
};

interface Report {
  id: string;
  title: string;
  type: string;
  game: string;
  content: string;
  severity?: string;
  status: string;
  version: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  username?: string;
  views?: number;
  votes?: number;
  authorName?: string;
}

const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Sk = ({ w = '100%', h = '14px' }: { w?: string; h?: string }) => (
  <div style={{ width: w, height: h, background: 'rgba(200,169,110,0.06)', borderRadius: '2px', animation: 'skpulse 1.6s ease-in-out infinite' }} />
);

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');`;

export default function ReportDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [me, setMe] = useState<{ id: string; role?: string } | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    try {
      const u = localStorage.getItem('user');
      if (u) setMe(JSON.parse(u));
    } catch {}
  }, []);

  const fetchReport = async () => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('🔍 Fetching report ID:', id);
      
      const res = await fetch(`${API_BASE_URL}/api/dashboard/reports/${id}`, {
        credentials: 'include'
      });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error('Report not found');
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log('📦 Response data:', data);
      
      let reportData;
      if (data.success && data.report) {
        reportData = data.report;
      } else if (data.report) {
        reportData = data.report;
      } else if (data.id) {
        reportData = data;
      } else {
        throw new Error('Invalid response format');
      }
      
      setReport(reportData);
      setLikesCount(reportData.votes || 0);
      
      // Record view
      fetch(`${API_BASE_URL}/api/dashboard/reports/${id}/view`, {
        method: 'POST',
        credentials: 'include',
      }).catch(err => console.error('Error recording view:', err));
      
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Report not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  // Auto refresh setiap 30 detik untuk cek status update dari admin
  useEffect(() => {
    if (!id) return;
    
    const interval = setInterval(() => {
      fetchReport();
    }, 30000); // Refresh setiap 30 detik
    
    return () => clearInterval(interval);
  }, [id]);

  const handleLike = async () => {
    if (liked) return;
    
    setLiked(true);
    setLikesCount(prev => prev + 1);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/reports/${id}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        setLiked(false);
        setLikesCount(prev => prev - 1);
        throw new Error('Failed to like');
      }
    } catch (error) {
      console.error('Error liking report:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleDelete = async () => {
    if (!report?.id) return;
    
    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        const res = await fetch(`${API_BASE_URL}/api/dashboard/reports/${report.id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user?.id }),
        });
        
        const data = await res.json();
        
        if (data.success) {
          alert('Report deleted successfully');
          window.location.href = '/UserHoyo/dashboard';
        } else {
          alert('Failed to delete report: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report');
      }
    }
  };

  const fmt = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  const game = report ? GAME_MAP[report.game] : null;
  const category = report ? CATEGORY_MAP[report.type] : null;
  const status = report ? (STATUS_MAP[report.status] ?? STATUS_MAP.pending) : null;
  
  // Cek apakah user adalah admin atau owner
  const isOwner = me && report && me.id === report.userId;
  const isAdmin = me?.role === 'admin';

  // Status message berdasarkan status report
  const getStatusMessage = () => {
    if (!report) return '';
    switch (report.status) {
      case 'published':
        return '✓ This report has been approved and published.';
      case 'archived':
        return '✗ This report has been rejected and archived.';
      case 'draft':
        return '⏳ This report is still in draft and awaiting admin review.';
      default:
        return '⏳ This report is pending admin approval.';
    }
  };

  if (!loading && error) {
    return (
      <div style={{ background: '#050810', color: '#E8E0CC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Rajdhani',sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '3rem', color: '#C8A96E', opacity: 0.15, marginBottom: '1rem' }}>404</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.1rem', color: '#E8E0CC', marginBottom: '0.5rem' }}>Report Not Found</div>
          <p style={{ fontSize: '0.85rem', color: '#5A5248', marginBottom: '1.5rem' }}>{error}</p>
          <Link href="/UserHoyo/dashboard" style={{ ...clipHexSm, display: 'inline-block', padding: '8px 20px', border: '1px solid rgba(200,169,110,0.25)', color: '#9A8F78', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}>
            ← Dashboard
          </Link>
        </div>
        <style>{fonts}</style>
      </div>
    );
  }

  return (
    <div style={{ background: '#050810', color: '#E8E0CC', minHeight: '100vh', fontFamily: "'Rajdhani',sans-serif", overflowX: 'hidden' }}>
      {/* AMBIENT BG */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse 60% 45% at 90% 5%, rgba(123,79,166,0.07) 0%, transparent 60%),
                     radial-gradient(ellipse 40% 35% at 5% 90%, rgba(78,205,196,0.04) 0%, transparent 55%)` }} />

      {/* TOPBAR */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 2rem', height: '56px',
        borderBottom: '1px solid rgba(200,169,110,0.12)', background: 'rgba(5,8,16,0.88)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Space Mono',monospace", fontSize: '0.72rem' }}>
          <Link href="/UserHoyo/dashboard" style={{ color: '#5A5248', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C8A96E')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5A5248')}>
            Dashboard
          </Link>
          <span style={{ color: '#3A3028' }}>/</span>
          <Link href="/UserHoyo/all-report" style={{ color: '#5A5248', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C8A96E')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5A5248')}>
            Reports
          </Link>
          <span style={{ color: '#3A3028' }}>/</span>
          <span style={{ color: '#C8A96E', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {loading ? '...' : (report?.title?.slice(0, 28) + (report && report.title && report.title.length > 28 ? '…' : ''))}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleShare} style={{ ...clipHexSm, display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', border: '1px solid rgba(200,169,110,0.2)', color: '#9A8F78',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none',
            textTransform: 'uppercase', fontFamily: "'Rajdhani',sans-serif", background: 'transparent',
            cursor: 'pointer', transition: 'color 0.2s, border-color 0.2s' }}>
            Share
          </button>
          <Link href="/UserHoyo/dashboard" style={{ ...clipHexSm, display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', border: '1px solid rgba(200,169,110,0.2)', color: '#9A8F78',
            fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none',
            textTransform: 'uppercase', fontFamily: "'Rajdhani',sans-serif" }}>
            <BackIcon /> Dashboard
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto', padding: '2.5rem 2rem 5rem' }}>
        {/* BLOCK 1 · HEADER */}
        <div style={{ marginBottom: '2rem', animation: 'fadein 0.35s ease both' }}>
          {loading ? <Sk w="140px" h="10px" /> : game && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ width: '28px', height: '2px', background: game.color, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase', color: game.color }}>
                {game.label}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
            {loading ? <><Sk w="70px" h="22px" /><Sk w="62px" h="22px" /><Sk w="80px" h="22px" /></> : (
              <>
                {category && (
                  <span style={{ ...clipBadge, display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '3px 10px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', fontFamily: "'Rajdhani',sans-serif",
                    color: '#C8A96E', background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)' }}>
                    {category.icon} {category.label}
                  </span>
                )}
                {status && (
                  <span style={{ ...clipBadge, display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '3px 10px', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', fontFamily: "'Rajdhani',sans-serif",
                    color: status.color, background: status.bg, border: `1px solid ${status.color}30` }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: status.color,
                      animation: 'dotpulse 2s ease-in-out infinite', flexShrink: 0 }} />
                    {status.label}
                  </span>
                )}
              </>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
              <Sk h="26px" /><Sk w="65%" h="26px" />
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: '1.55rem', fontWeight: 700,
                color: '#E8E0CC', lineHeight: 1.35, margin: '0 0 0.5rem 0' }}>
                {report?.title}
              </h1>
              
              {/* Status Message - Menampilkan informasi status dari admin */}
              <div style={{ 
                marginBottom: '1rem', 
                padding: '8px 12px', 
                borderRadius: '4px',
                background: report?.status === 'published' ? 'rgba(109,209,138,0.08)' :
                          report?.status === 'archived' ? 'rgba(224,92,122,0.08)' :
                          'rgba(200,169,110,0.08)',
                border: `1px solid ${report?.status === 'published' ? '#6DD18A30' :
                         report?.status === 'archived' ? '#E05C7A30' :
                         '#C8A96E30'}`,
                fontSize: '0.75rem',
                color: report?.status === 'published' ? '#6DD18A' :
                       report?.status === 'archived' ? '#E05C7A' :
                       '#C8A96E'
              }}>
                {getStatusMessage()}
              </div>
            </>
          )}

          {!loading && report?.tags && report.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '1rem' }}>
              {report.tags.map((t, i) => (
                <span key={i} style={{ ...clipBadge, display: 'inline-block', padding: '2px 8px',
                  fontSize: '0.6rem', fontWeight: 700, fontFamily: "'Space Mono',monospace",
                  color: 'rgba(200,169,110,0.5)', background: 'rgba(200,169,110,0.04)',
                  border: '1px solid rgba(200,169,110,0.12)' }}>
                  {t.startsWith('#') ? t : `#${t}`}
                </span>
              ))}
            </div>
          )}

          <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(200,169,110,0.2), transparent)' }} />
        </div>

        {/* BLOCK 2 · META */}
        <div style={{ marginBottom: '2rem', animation: 'fadein 0.35s ease 0.08s both' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            border: '1px solid rgba(200,169,110,0.1)', ...clipWidget, overflow: 'hidden' }}>
            {[
              { label: 'Author',    val: report?.username || report?.authorName || `User #${report?.userId?.slice(0,6)}` },
              { label: 'Submitted', val: fmt(report?.createdAt || '') },
              { label: 'Version',   val: `v${report?.version || '1.0'}` },
            ].map((item, i) => (
              <div key={i} style={{ padding: '14px 18px', background: '#070C18',
                borderRight: i < 2 ? '1px solid rgba(200,169,110,0.08)' : 'none' }}>
                <div style={{ fontSize: '0.58rem', fontFamily: "'Space Mono',monospace",
                  letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5A5248', marginBottom: '5px' }}>
                  {item.label}
                </div>
                {loading
                  ? <Sk w="80px" h="13px" />
                  : <div style={{ fontSize: '0.8rem', fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, color: '#9A8F78' }}>
                      {item.val}
                    </div>
                }
              </div>
            ))}
          </div>
        </div>

        {/* BLOCK 3 · CONTENT */}
        <div style={{ marginBottom: '2rem', animation: 'fadein 0.35s ease 0.16s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ width: '3px', height: '14px', background: '#C8A96E', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: '0.78rem', fontWeight: 700,
              color: '#E8E0CC', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Report Content
            </span>
          </div>

          <div style={{ background: '#0C1220', border: '1px solid rgba(200,169,110,0.12)',
            ...clipWidget, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 1.75rem', minHeight: '180px' }}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[1, 0.9, 1, 0.75, 0.95, 0.6].map((w, i) => <Sk key={i} w={`${w * 100}%`} h="13px" />)}
                </div>
              ) : (
                <div className="report-body"
                  dangerouslySetInnerHTML={{ __html: report?.content || '<p style="color:#3A3028">No content provided.</p>' }} />
              )}
            </div>

            <div style={{ padding: '10px 1.75rem', borderTop: '1px solid rgba(200,169,110,0.06)',
              background: 'rgba(5,8,16,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <button onClick={handleLike} disabled={liked}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none',
                    color: liked ? '#4ECDC4' : '#3A3028', fontSize: '0.6rem', fontFamily: "'Space Mono',monospace",
                    cursor: liked ? 'default' : 'pointer', transition: 'color 0.2s' }}>
                  👍 {likesCount}
                </button>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6rem', fontFamily: "'Space Mono',monospace", color: '#3A3028' }}>
                  👁️ {report?.views || 0}
                </span>
              </div>
              {!loading && game && (
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.58rem',
                  letterSpacing: '0.08em', color: `${game.color}50`, textTransform: 'uppercase' }}>
                  {game.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* BLOCK 4 · ACTIONS */}
        <div style={{ animation: 'fadein 0.35s ease 0.24s both', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '1.25rem', borderTop: '1px solid rgba(200,169,110,0.08)' }}>
          <Link href="/UserHoyo/dashboard" style={{ ...clipHexSm, display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 18px', border: '1px solid rgba(200,169,110,0.18)', color: '#9A8F78',
            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none',
            textTransform: 'uppercase', fontFamily: "'Rajdhani',sans-serif" }}>
            <BackIcon /> Back to Dashboard
          </Link>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/UserHoyo/all-report" style={{ ...clipHexSm, display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px', border: '1px solid rgba(200,169,110,0.18)', color: '#9A8F78',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none',
              textTransform: 'uppercase', fontFamily: "'Rajdhani',sans-serif" }}>
              All Reports
            </Link>

            {isOwner && !loading && report?.status === 'draft' && (
              <button onClick={handleDelete} style={{ ...clipHexSm, display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', border: '1px solid #E05C7A', color: '#E05C7A',
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none',
                textTransform: 'uppercase', fontFamily: "'Rajdhani',sans-serif",
                background: 'rgba(224,92,122,0.08)', cursor: 'pointer' }}>
                🗑️ Delete Report
              </button>
            )}
          </div>
        </div>

        {/* INFO: Status update otomatis */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.65rem', color: '#3A3028', fontFamily: "'Space Mono',monospace" }}>
          Page auto-refreshes every 30 seconds to show latest status
        </div>
      </main>

      <style>{`
        ${fonts}
        @keyframes fadein   { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes dotpulse { 0%,100% { opacity:1; } 50% { opacity:0.25; } }
        @keyframes skpulse  { 0%,100% { opacity:1; } 50% { opacity:0.35; } }

        .report-body {
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.88rem;
          color: #C8C0B0;
          line-height: 1.75;
        }
        .report-body h1 { font-family:'Cinzel',serif; font-size:1.2rem; font-weight:700; color:#E8E0CC; margin:1.2rem 0 0.4rem; }
        .report-body h2 { font-family:'Cinzel',serif; font-size:1rem; font-weight:700; color:#C8A96E; margin:1rem 0 0.35rem; }
        .report-body h3 { font-family:'Rajdhani',sans-serif; font-size:0.92rem; font-weight:700; color:#9A8F78; margin:0.8rem 0 0.3rem; }
        .report-body p  { margin:0 0 0.6rem; }
        .report-body ul { list-style:none; padding-left:1rem; margin-bottom:0.6rem; }
        .report-body ul li::before { content:'·'; color:#C8A96E; margin-right:0.5rem; }
        .report-body ol { padding-left:1.5rem; color:#9A8F78; margin-bottom:0.6rem; }
        .report-body blockquote {
          border-left: 2px solid #C8A96E;
          padding: 0.5rem 1rem;
          color: #9A8F78;
          font-style: italic;
          margin: 0.8rem 0;
          background: rgba(200,169,110,0.04);
        }
        .report-body b, .report-body strong { color:#E8E0CC; }
        .report-body a { color:#4ECDC4; text-underline-offset:3px; }
        .report-body code {
          font-family:'Space Mono',monospace;
          font-size:0.75rem;
          background:rgba(200,169,110,0.08);
          color:#C8A96E;
          padding:1px 5px;
          border-radius:2px;
        }
      `}</style>
    </div>
  );
}