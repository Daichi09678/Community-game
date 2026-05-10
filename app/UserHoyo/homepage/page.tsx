'use client';

import { useState } from 'react';

// Report data
const reportsData = [
  { title: "Deep Dive: 'Where the Stairway Leads' Quest Analysis", type: "mission", game: "hsr", author: "AstreaN_7", initials: "AN", rating: 5, votes: 248, date: "2h ago", version: "3.2" },
  { title: "Natlan Archon Quest Act II — Full Story Recap", type: "mission", game: "gi", author: "VoidHunter_X", initials: "VH", rating: 4, votes: 186, date: "5h ago", version: "5.3" },
  { title: "Complete Simulated Universe World 10 Guide", type: "puzzle", game: "hsr", author: "QuantumGale", initials: "QG", rating: 5, votes: 412, date: "1h ago", version: "3.1" },
  { title: "HoloFest Event — All Stages & Reward Breakdown", type: "event", game: "zzz", author: "Mei_Stellaron", initials: "MS", rating: 5, votes: 334, date: "2h ago", version: "1.4" },
  { title: "Honkai Impact 3rd: Elysian Realm Full Clear Tips", type: "puzzle", game: "hi3", author: "TrailBossKai", initials: "TK", rating: 3, votes: 92, date: "1h ago", version: "7.4" },
  { title: "Genshin: Hidden Achievement Guide — Liyue Region", type: "puzzle", game: "gi", author: "SilverWolf_Fan", initials: "SW", rating: 4, votes: 178, date: "3h ago", version: "5.2" },
  { title: "Robin Companion Quest — Character Analysis", type: "mission", game: "hsr", author: "Cocolia_Arc", initials: "CA", rating: 5, votes: 521, date: "4h ago", version: "3.1" },
  { title: "ZZZ: Hollow Zero District 6 — Fastest Clear Path", type: "puzzle", game: "zzz", author: "ImaginaryRift", initials: "IR", rating: 4, votes: 67, date: "6h ago", version: "1.3" },
  { title: "'Clouded Sanctuary' Event — Full Content Review", type: "event", game: "hsr", author: "QuantumGale", initials: "QG", rating: 4, votes: 143, date: "8h ago", version: "3.2" },
  { title: "Genshin Impact: Chasca Hangout Quest — All Endings", type: "mission", game: "gi", author: "AstreaN_7", initials: "AN", rating: 5, votes: 298, date: "1h ago", version: "5.3" },
];

const topItemsData = [
  { title: "Robin Companion Quest — Character Analysis", score: "521 votes" },
  { title: "Simulated Universe World 10 — Full Guide", score: "412 votes" },
  { title: "HoloFest Event — All Stages & Rewards", score: "334 votes" },
  { title: "Chasca Hangout Quest — All Endings", score: "298 votes" },
  { title: "Where the Stairway Leads — Review", score: "248 votes" },
];

const tagsData = [
  { label: 'Natlan', cls: '', game: 'gi' },
  { label: 'Robin', cls: 'gold', game: 'hsr' },
  { label: 'HSR 3.2', cls: 'cyan', game: 'hsr' },
  { label: 'Simulated Universe', cls: 'purple', game: 'hsr' },
  { label: 'Liyue Lore', cls: '', game: 'gi' },
  { label: 'Acheron', cls: '', game: 'hsr' },
  { label: 'Hollow Zero', cls: 'purple', game: 'zzz' },
  { label: 'Elysian Realm', cls: 'cyan', game: 'hi3' },
  { label: 'Zenless 1.4', cls: '', game: 'zzz' },
  { label: 'Hidden Achievement', cls: '', game: 'gi' },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const vals = [24, 38, 31, 52, 44, 67, 48];
const maxVal = Math.max(...vals);

const gameBadgeMap: Record<string, { label: string; cls: string }> = {
  hsr: { label: 'Star Rail', cls: 'badge-hsr' },
  gi:  { label: 'Genshin', cls: 'badge-gi' },
  zzz: { label: 'Zenless', cls: 'badge-zzz' },
  hi3: { label: 'Honkai 3rd', cls: 'badge-hi3' },
};

type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
type TypeFilter = 'all' | 'mission' | 'event' | 'puzzle';

const rankClasses = ['gold', 'gold', 'silver', 'silver', 'bronze'];

function ReportsSection({ filteredReports, activeFilter, setActiveFilter, getTypeBadge, getGameBadge, renderStars }: {
  filteredReports: typeof reportsData;
  activeFilter: TypeFilter;
  setActiveFilter: (f: TypeFilter) => void;
  getTypeBadge: (t: string) => React.ReactElement;
  getGameBadge: (g: string) => React.ReactElement | null;
  renderStars: (r: number) => string;
}) {
  return (
    <div>
      <div className="section-header">
        <div className="section-heading">Latest Reports</div>
        <a className="see-all">View all →</a>
      </div>
      <div className="filter-tabs">
        {(['all', 'mission', 'event', 'puzzle'] as const).map(f => (
          <button key={f} className={`filter-tab ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <table className="reports-table">
        <thead>
          <tr>
            <th>Report Title</th>
            <th>Game</th>
            <th>Type</th>
            <th>Author</th>
            <th>Rating</th>
            <th>Votes</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.length === 0 ? (
            <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem' }}>No reports found for this filter.</td></tr>
          ) : filteredReports.map((report, idx) => (
            <tr key={idx}>
              <td><span className="report-title-cell">{report.title}</span></td>
              <td>{getGameBadge(report.game)}</td>
              <td>{getTypeBadge(report.type)}</td>
              <td>
                <div className="author-cell">
                  <div className="author-av">{report.initials}</div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{report.author}</span>
                </div>
               </td>
              <td><span className="rating-stars">{renderStars(report.rating)}</span></td>
              <td><span className="votes-cell votes-up">↑ {report.votes}</span></td>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: "'Space Mono', monospace" }}>{report.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RightWidgets({ accentColor }: { accentColor: string }) {
  return (
    <div>
      <div className="side-widget">
        <div className="widget-title">Top Reports</div>
        {topItemsData.map((item, i) => (
          <div className="top-item" key={i}>
            <span className={`top-rank ${rankClasses[i]}`}>#{i + 1}</span>
            <span className="top-text">{item.title}</span>
            <span className="top-score">{item.score}</span>
          </div>
        ))}
      </div>
      <div className="side-widget">
        <div className="widget-title">Trending Tags</div>
        <div style={{ marginTop: '-0.25rem' }}>
          {tagsData.map((tag, i) => (
            <span key={i} className={`trending-tag ${tag.cls}`}>{tag.label}</span>
          ))}
        </div>
      </div>
      <div className="side-widget">
        <div className="widget-title">Activity This Week</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '64px' }}>
            {days.map((day, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '100%',
                  background: i === 5 ? accentColor : 'rgba(200,169,110,0.25)',
                  borderTop: `0.5px solid ${i === 5 ? accentColor : 'rgba(200,169,110,0.4)'}`,
                  height: `${Math.round((vals[i] / maxVal) * 52) + 8}px`,
                  transition: 'height 0.3s'
                }}></div>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{day}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: "'Space Mono', monospace" }}>
            304 total reports this week
          </div>
        </div>
      </div>
      <div className="side-widget">
        <div className="widget-title">Game Coverage</div>
        {[
          { label: 'Honkai: Star Rail', pct: 42, cls: 'bar-hsr' },
          { label: 'Genshin Impact',    pct: 35, cls: 'bar-gi' },
          { label: 'Zenless Zone Zero', pct: 15, cls: 'bar-zzz' },
          { label: 'Honkai Impact 3rd', pct: 8,  cls: 'bar-hi3' },
        ].map((g, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{g.label}</span>
              <span style={{ fontSize: '0.7rem', fontFamily: "'Space Mono', monospace", color: 'var(--text-muted)' }}>{g.pct}%</span>
            </div>
            <div className="bar-track">
              <div className={`bar-fill ${g.cls}`} style={{ width: `${g.pct}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<TypeFilter>('all');
  const [activeGame, setActiveGame] = useState<GameFilter>('all');

  const filteredReports = reportsData.filter(r => {
    const matchGame = activeGame === 'all' || r.game === activeGame;
    const matchType = activeFilter === 'all' || r.type === activeFilter;
    return matchGame && matchType;
  });

  const handleGameNav = (game: GameFilter) => {
    setActiveGame(game);
    setActiveFilter('all');
  };

  const gameAccentMap: Record<GameFilter, string> = {
    all: 'var(--gold)',
    hsr: 'var(--cyan)',
    gi: '#6DD18A',
    zzz: 'var(--purple-bright)',
    hi3: 'var(--rose)',
  };
  const accentColor = gameAccentMap[activeGame];

  const renderStars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const getTypeBadge = (type: string) => {
    if (type === 'mission') return <span className="report-type-badge badge-mission">Mission</span>;
    if (type === 'event')   return <span className="report-type-badge badge-event">Event</span>;
    return <span className="report-type-badge badge-puzzle">Puzzle</span>;
  };

  const getGameBadge = (game: string) => {
    const g = gameBadgeMap[game];
    return g ? <span className={`game-badge ${g.cls}`}>{g.label}</span> : null;
  };

  return (
    <>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <a className="sidebar-logo" href="#">
            <svg width="28" height="28" viewBox="0 0 28 28">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2"/>
              <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
              <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8"/>
            </svg>
            Hoyoverse Hub
          </a>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-label">Main</div>
          <a className="nav-item active" href="/">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/></svg>
            Dashboard
          </a>
          <a className="nav-item" href="/UserHoyo/all-report">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>
            All Reports
            <span className="nav-badge">1.2K</span>
          </a>

          <div className="nav-group-label">Category</div>
          <a className="nav-item" onClick={() => handleGameNav('all')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>
            Mission &amp; Quest
            <span className="nav-badge">482</span>
          </a>
          <a className="nav-item" onClick={() => handleGameNav('all')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/></svg>
            Event Seasonal
            <span className="nav-badge new">New</span>
          </a>
          <a className="nav-item" onClick={() => handleGameNav('all')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="11" y2="8" stroke="currentColor" strokeWidth="0.8"/><line x1="11" y1="8" x2="8" y2="11" stroke="currentColor" strokeWidth="0.8"/><line x1="8" y1="11" x2="5" y2="8" stroke="currentColor" strokeWidth="0.8"/><line x1="5" y1="8" x2="8" y2="5" stroke="currentColor" strokeWidth="0.8"/></svg>
            Puzzle &amp; Riddles
            <span className="nav-badge">324</span>
          </a>

          <div className="nav-group-label">Community</div>
          <a className="nav-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Discussion
          </a>
          <a className="nav-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/></svg>
            Leaderboard
          </a>
          <a className="nav-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            My Profile
          </a>
          <a className="nav-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/></svg>
            Settings
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">TB</div>
            <div>
              <div className="user-name">Trailblazer_01</div>
              <div className="user-level">LV.60 · 48 reports</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <div className="topbar">
          <div>
            <div className="topbar-title">Hoyoverse Hub — Dashboard</div>
            <div className="topbar-subtitle">All Games · Last updated: 3 hours ago</div>
          </div>
          <div className="topbar-actions">
            <div className="search-bar">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/><line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <input type="text" placeholder="Search reports, quests, events..."/>
            </div>
            <button className="btn-new">+ Write Report</button>
          </div>
        </div>

        <div className="content">
          {/* Stat Cards */}
          <div className="stat-grid">
            <div className="stat-card" style={{ '--card-accent': '#C8A96E' } as React.CSSProperties}>
              <div className="stat-label-sm">Total Reports</div>
              <div className="stat-value">12,480</div>
              <div className="stat-change">↑ +248 this week</div>
            </div>
            <div className="stat-card" style={{ '--card-accent': '#4ECDC4' } as React.CSSProperties}>
              <div className="stat-label-sm">Active Events</div>
              <div className="stat-value">7</div>
              <div className="stat-change">Across all games</div>
            </div>
            <div className="stat-card" style={{ '--card-accent': '#A855F7' } as React.CSSProperties}>
              <div className="stat-label-sm">Puzzles Solved</div>
              <div className="stat-value">4,230</div>
              <div className="stat-change">↑ +62 today</div>
            </div>
            <div className="stat-card" style={{ '--card-accent': '#C84040' } as React.CSSProperties}>
              <div className="stat-label-sm">Active Travelers</div>
              <div className="stat-value">31.6K</div>
              <div className="stat-change">↑ Online now: 420</div>
            </div>
          </div>

          {/* Game Pills */}
          <div className="game-pills">
            <span className={`game-pill pill-all ${activeGame === 'all' ? 'active' : ''}`} onClick={() => handleGameNav('all')}>All Games</span>
            <span className={`game-pill pill-hsr ${activeGame === 'hsr' ? 'active' : ''}`} onClick={() => handleGameNav('hsr')}>Honkai: Star Rail</span>
            <span className={`game-pill pill-gi ${activeGame === 'gi' ? 'active' : ''}`} onClick={() => handleGameNav('gi')}>Genshin Impact</span>
            <span className={`game-pill pill-zzz ${activeGame === 'zzz' ? 'active' : ''}`} onClick={() => handleGameNav('zzz')}>Zenless Zone Zero</span>
            <span className={`game-pill pill-hi3 ${activeGame === 'hi3' ? 'active' : ''}`} onClick={() => handleGameNav('hi3')}>Honkai Impact 3rd</span>
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            <ReportsSection
              filteredReports={filteredReports}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              getTypeBadge={getTypeBadge}
              getGameBadge={getGameBadge}
              renderStars={renderStars}
            />
            <RightWidgets accentColor={accentColor} />
          </div>
        </div>
      </main>

      <style jsx global>{`
        :root {
          --gold: #C8A96E;
          --gold-bright: #F0D080;
          --gold-dim: #8B6A2E;
          --cyan: #4ECDC4;
          --cyan-dim: #2A7A74;
          --purple: #7B4FA6;
          --purple-bright: #A855F7;
          --rose: #E05C7A;
          --amber: #F59E0B;
          --dark-bg: #050810;
          --dark-card: #0C1220;
          --dark-surface: #0F1A2E;
          --dark-border: rgba(200,169,110,0.15);
          --sidebar-width: 260px;
          --text-primary: #E8E0CC;
          --text-secondary: #9A8F78;
          --text-muted: #5A5248;
        }

        * { margin:0; padding:0; box-sizing:border-box; }
        body {
          background: var(--dark-bg);
          color: var(--text-primary);
          font-family: 'Rajdhani', sans-serif;
          display: flex;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Sidebar */
        .sidebar {
          width: var(--sidebar-width);
          flex-shrink: 0;
          background: var(--dark-card);
          border-right: 0.5px solid var(--dark-border);
          display: flex; flex-direction: column;
          position: fixed; top:0; bottom:0; left:0;
          z-index: 50;
          overflow-y: auto;
        }
        .sidebar-header {
          padding: 1.75rem 1.5rem;
          border-bottom: 0.5px solid var(--dark-border);
        }
        .sidebar-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Cinzel', serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--gold);
          text-decoration: none;
        }
        .sidebar-nav { flex: 1; padding: 1.25rem 1rem; }
        .nav-group-label {
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--text-muted);
          padding: 0 0.75rem;
          margin-bottom: 0.5rem; margin-top: 1.5rem;
        }
        .nav-group-label:first-child { margin-top: 0; }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.88rem; font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.2s; cursor: pointer;
          clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
          margin-bottom: 2px; position: relative;
        }
        .nav-item:hover { background: rgba(200,169,110,0.06); color: var(--text-primary); }
        .nav-item.active { background: rgba(200,169,110,0.1); color: var(--gold); }
        .nav-item.active::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 2px;
          background: var(--gold);
        }
        .nav-badge {
          margin-left: auto;
          background: rgba(200,169,110,0.15); color: var(--gold);
          font-family: 'Space Mono', monospace; font-size: 0.65rem;
          padding: 2px 8px;
          clip-path: polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%);
        }
        .nav-badge.new { background: rgba(78,205,196,0.15); color: var(--cyan); }
        .sidebar-footer { padding: 1.25rem; border-top: 0.5px solid var(--dark-border); }
        .user-card { display: flex; align-items: center; gap: 10px; }
        .user-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid var(--gold-dim);
          background: rgba(200,169,110,0.1);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif; font-size: 0.75rem; color: var(--gold);
          font-weight: 700; flex-shrink: 0;
        }
        .user-name { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
        .user-level { font-size: 0.7rem; color: var(--text-muted); font-family: 'Space Mono', monospace; }

        /* Main */
        .main { flex: 1; margin-left: var(--sidebar-width); display: flex; flex-direction: column; min-height: 100vh; }

        /* Topbar */
        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 2rem;
          border-bottom: 0.5px solid var(--dark-border);
          background: rgba(5,8,16,0.8); backdrop-filter: blur(10px);
          position: sticky; top:0; z-index: 40;
        }
        .topbar-title { font-family: 'Cinzel', serif; font-size: 1rem; font-weight: 600; color: var(--text-primary); }
        .topbar-subtitle { color: var(--text-muted); font-size: 0.75rem; margin-top: 2px; }
        .topbar-actions { display: flex; gap: 10px; align-items: center; }
        .btn-new {
          padding: 8px 18px;
          background: linear-gradient(135deg, var(--gold-dim), var(--gold));
          border: none; color: var(--dark-bg);
          font-family: 'Rajdhani', sans-serif; font-size: 0.8rem;
          font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer;
          clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
          transition: all 0.2s;
        }
        .btn-new:hover { filter: brightness(1.1); }
        .search-bar {
          display: flex; align-items: center; gap: 8px;
          background: var(--dark-card); border: 0.5px solid var(--dark-border);
          padding: 7px 14px; width: 240px;
          clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
          transition: border-color 0.2s;
        }
        .search-bar:focus-within { border-color: var(--gold); }
        .search-bar input {
          background: none; border: none; outline: none;
          color: var(--text-primary); font-family: 'Rajdhani', sans-serif;
          font-size: 0.88rem; flex: 1; width: 100%;
        }
        .search-bar input::placeholder { color: var(--text-muted); }

        /* Content */
        .content { padding: 2rem; flex: 1; }

        /* Game Pills */
        .game-pills { display: flex; gap: 8px; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .game-pill {
          padding: 5px 14px;
          font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s;
          clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
          border: 0.5px solid transparent;
          color: var(--text-muted);
          background: rgba(255,255,255,0.03);
        }
        .game-pill.active, .game-pill:hover { color: var(--text-primary); }
        .pill-all.active   { border-color: var(--gold); color: var(--gold); background: rgba(200,169,110,0.08); }
        .pill-hsr:hover, .pill-hsr.active { border-color: #4ECDC4; color: var(--cyan); background: rgba(78,205,196,0.08); }
        .pill-gi:hover,  .pill-gi.active  { border-color: #6DD18A; color: #6DD18A; background: rgba(109,209,138,0.08); }
        .pill-zzz:hover, .pill-zzz.active { border-color: #A855F7; color: var(--purple-bright); background: rgba(168,85,247,0.08); }
        .pill-hi3:hover, .pill-hi3.active { border-color: #E05C7A; color: var(--rose); background: rgba(224,92,122,0.08); }

        /* Stat Cards */
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .stat-card {
          background: var(--dark-card); border: 0.5px solid var(--dark-border);
          padding: 1.5rem;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          position: relative; overflow: hidden;
        }
        .stat-card::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: var(--card-accent, var(--gold));
        }
        .stat-label-sm { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.6rem; }
        .stat-value { font-family: 'Space Mono', monospace; font-size: 1.8rem; font-weight: 700; color: var(--card-accent, var(--gold)); }
        .stat-change { font-size: 0.72rem; color: var(--cyan); margin-top: 0.25rem; }

        /* Table */
        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
        .section-heading { font-family: 'Cinzel', serif; font-size: 0.95rem; font-weight: 600; color: var(--text-primary); }
        .see-all { color: var(--gold); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-decoration: none; cursor: pointer; }
        .filter-tabs { display: flex; gap: 6px; margin-bottom: 1.25rem; }
        .filter-tab {
          padding: 6px 14px; background: transparent; border: 0.5px solid var(--dark-border);
          color: var(--text-secondary); font-family: 'Rajdhani', sans-serif;
          font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s;
          clip-path: polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%);
        }
        .filter-tab.active { background: rgba(200,169,110,0.1); border-color: var(--gold); color: var(--gold); }
        .filter-tab:hover:not(.active) { border-color: rgba(200,169,110,0.35); color: var(--text-primary); }
        .reports-table { width: 100%; border-collapse: collapse; background: var(--dark-card); border: 0.5px solid var(--dark-border); }
        .reports-table th {
          padding: 10px 16px; text-align: left;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--text-muted); border-bottom: 0.5px solid var(--dark-border);
          background: rgba(200,169,110,0.03);
        }
        .reports-table td {
          padding: 14px 16px; font-size: 0.88rem;
          border-bottom: 0.5px solid rgba(200,169,110,0.07); vertical-align: middle;
        }
        .reports-table tr:last-child td { border-bottom: none; }
        .reports-table tr:hover td { background: rgba(200,169,110,0.03); }

        /* Game badge */
        .game-badge {
          display: inline-flex; align-items: center;
          padding: 3px 8px; font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap;
          clip-path: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%);
        }
        .badge-hsr { background: rgba(78,205,196,0.1); color: var(--cyan); border: 0.5px solid rgba(78,205,196,0.3); }
        .badge-gi  { background: rgba(109,209,138,0.1); color: #6DD18A; border: 0.5px solid rgba(109,209,138,0.3); }
        .badge-zzz { background: rgba(168,85,247,0.1); color: var(--purple-bright); border: 0.5px solid rgba(168,85,247,0.3); }
        .badge-hi3 { background: rgba(224,92,122,0.1); color: var(--rose); border: 0.5px solid rgba(224,92,122,0.3); }

        /* Type badge */
        .report-type-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          clip-path: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%);
        }
        .badge-mission { background: rgba(200,169,110,0.12); color: var(--gold); border: 0.5px solid rgba(200,169,110,0.3); }
        .badge-event   { background: rgba(78,205,196,0.12); color: var(--cyan); border: 0.5px solid rgba(78,205,196,0.3); }
        .badge-puzzle  { background: rgba(168,85,247,0.12); color: var(--purple-bright); border: 0.5px solid rgba(168,85,247,0.3); }

        .report-title-cell { font-weight: 600; color: var(--text-primary); cursor: pointer; transition: color 0.2s; }
        .report-title-cell:hover { color: var(--gold); }
        .rating-stars { font-size: 0.75rem; color: var(--gold); letter-spacing: 1px; }
        .author-cell { display: flex; align-items: center; gap: 8px; }
        .author-av {
          width: 26px; height: 26px; border-radius: 50%;
          background: rgba(200,169,110,0.08); border: 0.5px solid var(--gold-dim);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif; font-size: 0.6rem; color: var(--gold); flex-shrink: 0;
        }
        .votes-cell { font-family: 'Space Mono', monospace; font-size: 0.78rem; color: var(--text-secondary); }
        .votes-up { color: var(--cyan); }

        /* Sidebar widgets */
        .side-widget {
          background: var(--dark-card); border: 0.5px solid var(--dark-border);
          padding: 1.5rem;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          margin-bottom: 1.25rem;
        }
        .widget-title {
          font-family: 'Cinzel', serif; font-size: 0.82rem; font-weight: 600;
          color: var(--text-primary); margin-bottom: 1rem;
          display: flex; align-items: center; gap: 8px;
        }
        .widget-title::before { content:''; width: 3px; height: 14px; background: var(--gold); }
        .top-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 0.5px solid rgba(200,169,110,0.06); }
        .top-item:last-child { border-bottom: none; padding-bottom: 0; }
        .top-rank { font-family: 'Space Mono', monospace; font-size: 0.72rem; color: var(--text-muted); min-width: 20px; }
        .top-rank.gold { color: var(--gold); }
        .top-rank.silver { color: #9AA0AA; }
        .top-rank.bronze { color: #CD7F32; }
        .top-text { flex: 1; font-size: 0.82rem; color: var(--text-secondary); cursor: pointer; transition: color 0.2s; line-height: 1.3; }
        .top-text:hover { color: var(--text-primary); }
        .top-score { font-family: 'Space Mono', monospace; font-size: 0.7rem; color: var(--cyan); }

        .trending-tag {
          display: inline-block; padding: 3px 10px;
          background: rgba(200,169,110,0.08); border: 0.5px solid rgba(200,169,110,0.2);
          color: var(--gold); font-size: 0.7rem; font-weight: 600;
          clip-path: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%);
          margin: 3px; cursor: pointer; transition: all 0.2s;
        }
        .trending-tag:hover { background: rgba(200,169,110,0.15); }
        .trending-tag.cyan { background: rgba(78,205,196,0.08); border-color: rgba(78,205,196,0.2); color: var(--cyan); }
        .trending-tag.purple { background: rgba(168,85,247,0.08); border-color: rgba(168,85,247,0.2); color: var(--purple-bright); }

        /* Coverage bars */
        .bar-track { height: 4px; background: rgba(255,255,255,0.05); border-radius: 0; overflow: hidden; }
        .bar-fill { height: 100%; transition: width 0.6s ease; }
        .bar-hsr { background: var(--cyan); }
        .bar-gi  { background: #6DD18A; }
        .bar-zzz { background: var(--purple-bright); }
        .bar-hi3 { background: var(--rose); }

        /* Layout Grid */
        .content-grid { display: grid; grid-template-columns: 1fr 280px; gap: 1.5rem; }

        /* Decorative BG */
        body::before {
          content: ''; position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%);
          pointer-events: none; z-index: 0;
        }
        .main { position: relative; z-index: 1; }

        @media (max-width: 1100px) {
          .content-grid { grid-template-columns: 1fr; }
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .main { margin-left: 0; }
        }
      `}</style>
    </>
  );
}