    // app/page.tsx
'use client';

import { useState } from 'react';

// Data laporan (sama persis dengan versi HTML)
const reportsData = [
  { title: "Analisis Mendalam Quest 'Where the Stairway Leads'", type: "mission", author: "AstreaN_7", initials: "AN", rating: 5, votes: 248, date: "2j lalu", version: "3.2" },
  { title: "Review Event 'Clouded Sanctuary' — Semua Stage", type: "event", author: "VoidHunter_X", initials: "VH", rating: 4, votes: 186, date: "5j lalu", version: "3.2" },
  { title: "Solusi Lengkap Simulated Universe World 10", type: "puzzle", author: "QuantumGale", initials: "QG", rating: 5, votes: 412, date: "1h lalu", version: "3.1" },
  { title: "Side Quest Penacony: Kronologi Lore Lengkap", type: "mission", author: "Mei_Stellaron", initials: "MS", rating: 5, votes: 334, date: "2h lalu", version: "3.0" },
  { title: "Event 'Starhunt Gambit' — Evaluasi Mekanik & Reward", type: "event", author: "TrailBossKai", initials: "TK", rating: 3, votes: 92, date: "1h lalu", version: "3.2" },
  { title: "Panduan Achievement Tersembunyi Luofu", type: "puzzle", author: "SilverWolf_Fan", initials: "SW", rating: 4, votes: 178, date: "3h lalu", version: "2.7" },
  { title: "Companion Quest Robin: Analisis Karakter", type: "mission", author: "Cocolia_Arc", initials: "CA", rating: 5, votes: 521, date: "4h lalu", version: "3.1" },
  { title: "Teka-teki Interaktif Belobog — Solusi Tercepat", type: "puzzle", author: "ImaginaryRift", initials: "IR", rating: 4, votes: 67, date: "6h lalu", version: "1.6" },
  { title: "Quest 'Xianzhou Vessel Arrival' — Recap + Rating", type: "mission", author: "QuantumGale", initials: "QG", rating: 4, votes: 143, date: "8h lalu", version: "3.2" },
  { title: "Event Ditelevisi di Penacony — Semua Konten", type: "event", author: "AstreaN_7", initials: "AN", rating: 5, votes: 298, date: "1h lalu", version: "3.0" },
];

// Data untuk widget (sama persis)
const topItemsData = [
  { title: "Robin Companion Quest — Analisis Karakter", score: "521 votes" },
  { title: "Simulated Universe World 10 — Full Guide", score: "412 votes" },
  { title: "Event Penacony Televised — Semua Konten", score: "298 votes" },
  { title: "Side Quest Penacony: Kronologi Lore", score: "334 votes" },
  { title: "Where the Stairway Leads — Review", score: "248 votes" },
];

const tagsData = [
  { label: 'Penacony', cls: '' },
  { label: 'Robin', cls: 'gold' },
  { label: 'Event 3.2', cls: 'cyan' },
  { label: 'Simulated Universe', cls: 'purple' },
  { label: 'Luofu Lore', cls: '' },
  { label: 'Sunday Quest', cls: '' },
  { label: 'Acheron', cls: 'purple' },
  { label: 'Puzzle Guide', cls: 'cyan' },
  { label: 'Version 3.2', cls: '' },
  { label: 'Hidden Achievement', cls: '' },
];

const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const vals = [24, 38, 31, 52, 44, 67, 48];
const maxVal = Math.max(...vals);

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mission' | 'event' | 'puzzle'>('all');

  const filteredReports = activeFilter === 'all' ? reportsData : reportsData.filter(r => r.type === activeFilter);

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getBadge = (type: string) => {
    if (type === 'mission') return <span className="report-type-badge badge-mission">Mission</span>;
    if (type === 'event') return <span className="report-type-badge badge-event">Event</span>;
    return <span className="report-type-badge badge-puzzle">Puzzle</span>;
  };

  const rankClasses = ['gold','gold','silver','silver','bronze'];

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
            Trailblazer Hub
          </a>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-label">Utama</div>
          <a className="nav-item active">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/></svg>
            Dashboard
          </a>
          <a className="nav-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>
            Semua Laporan
            <span className="nav-badge">1.2K</span>
          </a>

          <div className="nav-group-label">Kategori</div>
          <a className="nav-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>
            Mission & Quest
            <span className="nav-badge">482</span>
          </a>
          <a className="nav-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/></svg>
            Event Seasonal
            <span className="nav-badge new">Baru</span>
          </a>
          <a className="nav-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="11" y2="8" stroke="currentColor" strokeWidth="0.8"/><line x1="11" y1="8" x2="8" y2="11" stroke="currentColor" strokeWidth="0.8"/><line x1="8" y1="11" x2="5" y2="8" stroke="currentColor" strokeWidth="0.8"/><line x1="5" y1="8" x2="8" y2="5" stroke="currentColor" strokeWidth="0.8"/></svg>
            Puzzle & Teka-teki
            <span className="nav-badge">324</span>
          </a>

          <div className="nav-group-label">Komunitas</div>
          <a className="nav-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Diskusi
          </a>
          <a className="nav-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/></svg>
            Leaderboard
          </a>
          <a className="nav-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Profil Saya
          </a>
          <a className="nav-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/></svg>
            Pengaturan
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">TB</div>
            <div>
              <div className="user-name">Trailblazer_01</div>
              <div className="user-level">LV.60 · 48 laporan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <div className="topbar">
          <div>
            <div className="topbar-title">Dashboard Trailblazer</div>
            <div className="topbar-subtitle">Versi 3.2 · Pembaruan terakhir: 3 jam lalu</div>
          </div>
          <div className="topbar-actions">
            <div className="search-bar">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#5A5248" strokeWidth="1.2"/><line x1="9.5" y1="9.5" x2="13" y2="13" stroke="#5A5248" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <input type="text" placeholder="Cari laporan, quest, event..."/>
            </div>
            <button className="btn-new">+ Tulis Laporan</button>
          </div>
        </div>

        <div className="content">
          {/* Stat Cards */}
          <div className="stat-grid">
            <div className="stat-card" style={{ '--card-accent': '#C8A96E' } as React.CSSProperties}>
              <div className="stat-label-sm">Total Laporan</div>
              <div className="stat-value">12,480</div>
              <div className="stat-change">↑ +248 minggu ini</div>
            </div>
            <div className="stat-card" style={{ '--card-accent': '#4ECDC4' } as React.CSSProperties}>
              <div className="stat-label-sm">Event Aktif</div>
              <div className="stat-value">3</div>
              <div className="stat-change">Galaxy Express · Memoir</div>
            </div>
            <div className="stat-card" style={{ '--card-accent': '#A855F7' } as React.CSSProperties}>
              <div className="stat-label-sm">Puzzle Terpecahkan</div>
              <div className="stat-value">4,230</div>
              <div className="stat-change">↑ +62 hari ini</div>
            </div>
            <div className="stat-card" style={{ '--card-accent': '#C84040' } as React.CSSProperties}>
              <div className="stat-label-sm">Trailblazer Aktif</div>
              <div className="stat-value">31.6K</div>
              <div className="stat-change">↑ Online sekarang: 420</div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Left Section: Reports Table */}
            <div>
              <div className="section-header">
                <div className="section-heading">Laporan Terbaru</div>
                <a className="see-all">Lihat semua →</a>
              </div>

              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  Semua
                </button>
                <button 
                  className={`filter-tab ${activeFilter === 'mission' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('mission')}
                >
                  Mission
                </button>
                <button 
                  className={`filter-tab ${activeFilter === 'event' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('event')}
                >
                  Event
                </button>
                <button 
                  className={`filter-tab ${activeFilter === 'puzzle' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('puzzle')}
                >
                  Puzzle
                </button>
              </div>

              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Judul Laporan</th>
                    <th>Tipe</th>
                    <th>Penulis</th>
                    <th>Rating</th>
                    <th>Votes</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report, idx) => (
                    <tr key={idx}>
                      <td><span className="report-title-cell">{report.title}</span></td>
                      <td>{getBadge(report.type)}</td>
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

            {/* Right Section: Widgets */}
            <div>
              <div className="side-widget">
                <div className="widget-title">Laporan Terpopuler</div>
                {topItemsData.map((item, i) => (
                  <div className="top-item" key={i}>
                    <span className={`top-rank ${rankClasses[i]}`}>#{i+1}</span>
                    <span className="top-text">{item.title}</span>
                    <span className="top-score">{item.score}</span>
                  </div>
                ))}
              </div>

              <div className="side-widget">
                <div className="widget-title">Tag Trending</div>
                <div style={{ marginTop: '-0.25rem' }}>
                  {tagsData.map((tag, i) => (
                    <span key={i} className={`trending-tag ${tag.cls}`}>{tag.label}</span>
                  ))}
                </div>
              </div>

              <div className="side-widget">
                <div className="widget-title">Aktivitas Minggu Ini</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '64px' }}>
                    {days.map((day, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{
                          width: '100%',
                          background: i === 5 ? 'var(--gold)' : 'rgba(200,169,110,0.25)',
                          borderTop: `0.5px solid ${i === 5 ? 'var(--gold)' : 'rgba(200,169,110,0.4)'}`,
                          height: `${Math.round((vals[i] / maxVal) * 52) + 8}px`,
                          transition: 'height 0.3s'
                        }}></div>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{day}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: "'Space Mono', monospace" }}>
                    304 laporan total minggu ini
                  </div>
                </div>
              </div>
            </div>
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

        .sidebar-nav {
          flex: 1;
          padding: 1.25rem 1rem;
        }

        .nav-group-label {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 0 0.75rem;
          margin-bottom: 0.5rem;
          margin-top: 1.5rem;
        }
        .nav-group-label:first-child { margin-top: 0; }

        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.2s;
          cursor: pointer;
          clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
          margin-bottom: 2px;
          position: relative;
        }
        .nav-item:hover {
          background: rgba(200,169,110,0.06);
          color: var(--text-primary);
        }
        .nav-item.active {
          background: rgba(200,169,110,0.1);
          color: var(--gold);
        }
        .nav-item.active::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 2px;
          background: var(--gold);
        }

        .nav-badge {
          margin-left: auto;
          background: rgba(200,169,110,0.15);
          color: var(--gold);
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          padding: 2px 8px;
          clip-path: polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%);
        }
        .nav-badge.new {
          background: rgba(78,205,196,0.15);
          color: var(--cyan);
        }

        .sidebar-footer {
          padding: 1.25rem;
          border-top: 0.5px solid var(--dark-border);
        }
        .user-card {
          display: flex; align-items: center; gap: 10px;
        }
        .user-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1.5px solid var(--gold-dim);
          background: rgba(200,169,110,0.1);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          color: var(--gold);
          font-weight: 700;
          flex-shrink: 0;
        }
        .user-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .user-level {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: 'Space Mono', monospace;
        }

        /* Main */
        .main {
          flex: 1;
          margin-left: var(--sidebar-width);
          display: flex; flex-direction: column;
          min-height: 100vh;
        }

        /* Topbar */
        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 2rem;
          border-bottom: 0.5px solid var(--dark-border);
          background: rgba(5,8,16,0.8);
          backdrop-filter: blur(10px);
          position: sticky; top:0; z-index: 40;
        }

        .topbar-title {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .topbar-subtitle {
          color: var(--text-muted);
          font-size: 0.75rem;
          margin-top: 2px;
        }

        .topbar-actions {
          display: flex; gap: 10px; align-items: center;
        }

        .btn-new {
          padding: 8px 18px;
          background: linear-gradient(135deg, var(--gold-dim), var(--gold));
          border: none;
          color: var(--dark-bg);
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
          transition: all 0.2s;
        }
        .btn-new:hover { filter: brightness(1.1); }

        .search-bar {
          display: flex; align-items: center; gap: 8px;
          background: var(--dark-card);
          border: 0.5px solid var(--dark-border);
          padding: 7px 14px;
          clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
          width: 240px;
          transition: border-color 0.2s;
        }
        .search-bar:focus-within { border-color: var(--gold); }
        .search-bar input {
          background: none; border: none; outline: none;
          color: var(--text-primary);
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.88rem;
          flex: 1;
          width: 100%;
        }
        .search-bar input::placeholder { color: var(--text-muted); }

        /* Content Area */
        .content {
          padding: 2rem;
          flex: 1;
        }

        /* Stat Cards */
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--dark-card);
          border: 0.5px solid var(--dark-border);
          padding: 1.5rem;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          position: relative;
          overflow: hidden;
        }
        .stat-card::after {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: var(--card-accent, var(--gold));
        }
        .stat-label-sm {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.6rem;
        }
        .stat-value {
          font-family: 'Space Mono', monospace;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--card-accent, var(--gold));
        }
        .stat-change {
          font-size: 0.72rem;
          color: var(--cyan);
          margin-top: 0.25rem;
        }

        /* Table */
        .section-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1rem;
        }
        .section-heading {
          font-family: 'Cinzel', serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .see-all {
          color: var(--gold);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-decoration: none;
          cursor: pointer;
        }

        .filter-tabs {
          display: flex; gap: 6px; margin-bottom: 1.25rem;
        }
        .filter-tab {
          padding: 6px 14px;
          background: transparent;
          border: 0.5px solid var(--dark-border);
          color: var(--text-secondary);
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          clip-path: polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%);
        }
        .filter-tab.active {
          background: rgba(200,169,110,0.1);
          border-color: var(--gold);
          color: var(--gold);
        }
        .filter-tab:hover:not(.active) { border-color: rgba(200,169,110,0.35); color: var(--text-primary); }

        .reports-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--dark-card);
          border: 0.5px solid var(--dark-border);
        }
        .reports-table th {
          padding: 10px 16px;
          text-align: left;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--text-muted);
          border-bottom: 0.5px solid var(--dark-border);
          background: rgba(200,169,110,0.03);
        }
        .reports-table td {
          padding: 14px 16px;
          font-size: 0.88rem;
          border-bottom: 0.5px solid rgba(200,169,110,0.07);
          vertical-align: middle;
        }
        .reports-table tr:last-child td { border-bottom: none; }
        .reports-table tr:hover td { background: rgba(200,169,110,0.03); }

        .report-type-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          clip-path: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%);
        }
        .badge-mission { background: rgba(200,169,110,0.12); color: var(--gold); border: 0.5px solid rgba(200,169,110,0.3); }
        .badge-event { background: rgba(78,205,196,0.12); color: var(--cyan); border: 0.5px solid rgba(78,205,196,0.3); }
        .badge-puzzle { background: rgba(168,85,247,0.12); color: var(--purple-bright); border: 0.5px solid rgba(168,85,247,0.3); }

        .report-title-cell {
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          transition: color 0.2s;
        }
        .report-title-cell:hover { color: var(--gold); }

        .rating-stars {
          font-size: 0.75rem; color: var(--gold);
          letter-spacing: 1px;
        }

        .author-cell {
          display: flex; align-items: center; gap: 8px;
        }
        .author-av {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: rgba(200,169,110,0.08);
          border: 0.5px solid var(--gold-dim);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif;
          font-size: 0.6rem;
          color: var(--gold);
          flex-shrink: 0;
        }

        .votes-cell {
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .votes-up { color: var(--cyan); }

        /* Sidebar Widgets */
        .side-widget {
          background: var(--dark-card);
          border: 0.5px solid var(--dark-border);
          padding: 1.5rem;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          margin-bottom: 1.25rem;
        }
        .widget-title {
          font-family: 'Cinzel', serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1rem;
          display: flex; align-items: center; gap: 8px;
        }
        .widget-title::before {
          content:''; width: 3px; height: 14px; background: var(--gold);
        }

        .top-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 0;
          border-bottom: 0.5px solid rgba(200,169,110,0.06);
        }
        .top-item:last-child { border-bottom: none; padding-bottom: 0; }
        .top-rank {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          color: var(--text-muted);
          min-width: 20px;
        }
        .top-rank.gold { color: var(--gold); }
        .top-rank.silver { color: #9AA0AA; }
        .top-rank.bronze { color: #CD7F32; }
        .top-text {
          flex: 1;
          font-size: 0.82rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: color 0.2s;
          line-height: 1.3;
        }
        .top-text:hover { color: var(--text-primary); }
        .top-score {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          color: var(--cyan);
        }

        .trending-tag {
          display: inline-block;
          padding: 3px 10px;
          background: rgba(200,169,110,0.08);
          border: 0.5px solid rgba(200,169,110,0.2);
          color: var(--gold);
          font-size: 0.7rem;
          font-weight: 600;
          clip-path: polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%);
          margin: 3px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .trending-tag:hover { background: rgba(200,169,110,0.15); }
        .trending-tag.cyan {
          background: rgba(78,205,196,0.08);
          border-color: rgba(78,205,196,0.2);
          color: var(--cyan);
        }
        .trending-tag.purple {
          background: rgba(168,85,247,0.08);
          border-color: rgba(168,85,247,0.2);
          color: var(--purple-bright);
        }

        /* Layout Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 1.5rem;
        }

        /* Decorative BG */
        body::before {
          content: '';
          position: fixed; inset: 0;
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