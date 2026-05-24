'use client';

import { useState } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const reportDetail = {
  id: 'RPT-0412',
  title: "Puzzle Guide: Simulated Universe World 10",
  type: 'puzzle',
  game: 'hsr',
  version: '3.1',
  author: 'AstreaN_7',
  initials: 'AN',
  authorLevel: 'LV.52',
  authorReports: 31,
  rating: 5,
  votes: 248,
  date: '2h ago',
  dateFormatted: 'May 22, 2026 · 18:42',
  readTime: '10 min read',
  tags: ['Puzzle', 'Simulated Universe', 'HSR 3.1', 'Guide'],
};

const puzzleData = {
  name: 'Simulated Universe World 10',
  type: 'puzzle',
  version: '3.1',
  blessings: [
    { path: 'Hunt',        rating: 'S', note: 'Best single-target DPS path. Synergizes with Seele, Boothill, Dr. Ratio.' },
    { path: 'Erudition',   rating: 'A', note: 'Strong AoE. Ideal with Herta, Argenti, Himeko.' },
    { path: 'Nihility',    rating: 'A', note: 'Debuff stacking. Pairs with Kafka, Black Swan, Guinaifen.' },
    { path: 'Remembrance', rating: 'B', note: 'New path in 3.1. Memoria mechanic is strong but requires team building.' },
    { path: 'Destruction', rating: 'B', note: 'Self-damage risk. Best with Clara or Blade sustain comps.' },
    { path: 'Abundance',   rating: 'C', note: 'Passive healing path. Underwhelming solo but enables low-sustain teams.' },
  ],
  strategy: [
    { phase: 'Early Floor', tip: 'Prioritize Cosmic Fragment blessings that trigger on enemy weakness break — the fastest clear method.' },
    { phase: 'Mid Floor',   tip: 'Pick up at least 2 Resonance Formation upgrades; these compound exponentially by Floor 7+.' },
    { phase: 'Boss',        tip: 'The World 10 boss has two phases. Phase 2 triggers at 50% HP — save ultimates for this transition window.' },
  ],
};

const comments = [
  { author: 'VoidHunter_X',   initials: 'VH', time: '45 min ago', text: 'The Hunt path rating is spot on. Cleared World 10 in record time with Seele.', votes: 34 },
  { author: 'QuantumGale',    initials: 'QG', time: '1h ago',     text: 'Any recommendation for the best blessings to pick up early?', votes: 28 },
  { author: 'Mei_Stellaron',  initials: 'MS', time: '2h ago',     text: 'The Remembrance path is underrated. With the right setup, it can rival Hunt.', votes: 19 },
];

// ─── STYLE CONSTANTS ─────────────────────────────────────────────────────────

const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } as React.CSSProperties;
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' } as React.CSSProperties;
const clipBtn    = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' } as React.CSSProperties;
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' } as React.CSSProperties;

const gameBadgeMap: Record<string, { label: string; className: string }> = {
  hsr: { label: 'Star Rail',  className: 'bg-[rgba(78,205,196,0.1)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]' },
};

const typeBadgeMap: Record<string, string> = {
  puzzle: 'bg-[rgba(168,85,247,0.12)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]',
};

const ratingColor: Record<string, string> = {
  S: 'bg-[rgba(200,169,110,0.15)] text-[#F0D080] border-[rgba(200,169,110,0.4)]',
  A: 'bg-[rgba(78,205,196,0.12)] text-[#4ECDC4] border-[rgba(78,205,196,0.35)]',
  B: 'bg-[rgba(109,209,138,0.1)] text-[#6DD18A] border-[rgba(109,209,138,0.3)]',
  C: 'bg-[rgba(90,82,72,0.15)] text-[#9A8F78] border-[rgba(90,82,72,0.35)]',
};

const renderStars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

function GameBadge({ game }: { game: string }) {
  const g = gameBadgeMap[game];
  if (!g) return null;
  return (
    <span className={`inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap ${g.className}`} style={clipBadge}>
      {g.label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return (
    <span className={`inline-flex items-center px-[10px] py-[3px] text-[0.65rem] font-bold tracking-[0.1em] uppercase ${typeBadgeMap[type] ?? ''}`} style={clipBadge}>
      {label}
    </span>
  );
}

// ─── COMMENTS ─────────────────────────────────────────────────────────────────

function CommentsSection() {
  const [commentVotes, setCommentVotes] = useState<Record<number, number>>({});

  const handleVote = (i: number, delta: number) => {
    setCommentVotes(prev => ({ ...prev, [i]: (prev[i] ?? 0) + delta }));
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-[3px] h-[18px] bg-[#C8A96E] inline-block" />
        <span className="font-['Cinzel',serif] text-[0.95rem] font-semibold text-[#E8E0CC]">Discussion ({comments.length})</span>
      </div>

      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-4 mb-5" style={clipWidget}>
        <textarea
          placeholder="Share your experience, corrections, or additional tips..."
          rows={3}
          className="w-full bg-transparent border border-[rgba(200,169,110,0.15)] text-[#E8E0CC] text-[0.85rem] font-['Rajdhani',sans-serif] p-3 resize-none outline-none placeholder-[#3A3228] focus:border-[rgba(200,169,110,0.4)] transition-colors"
          style={clipHexSm}
        />
        <div className="flex justify-end mt-3">
          <button
            style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}
            className="px-5 py-2 text-[#050810] text-[0.78rem] font-bold tracking-[0.1em] uppercase cursor-pointer hover:brightness-110 transition-all border-none"
          >
            Post Comment
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {comments.map((c, i) => (
          <div key={i} className="bg-[#0C1220] border border-[rgba(200,169,110,0.1)] p-4" style={clipWidget}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border border-[#8B6A2E] bg-[rgba(200,169,110,0.08)] flex items-center justify-center font-['Cinzel',serif] text-[0.6rem] text-[#C8A96E] font-bold shrink-0">
                {c.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-[6px]">
                  <span className="text-[0.82rem] font-semibold text-[#E8E0CC]">{c.author}</span>
                  <span className="text-[0.68rem] text-[#5A5248] font-['Space_Mono',monospace]">{c.time}</span>
                </div>
                <p className="text-[0.83rem] text-[#9A8F78] leading-[1.6]">{c.text}</p>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => handleVote(i, 1)} className="flex items-center gap-1 text-[0.72rem] text-[#5A5248] hover:text-[#4ECDC4] transition-colors cursor-pointer bg-transparent border-none">
                    ↑ <span className="font-['Space_Mono',monospace]">{c.votes + (commentVotes[i] ?? 0)}</span>
                  </button>
                  <button onClick={() => handleVote(i, -1)} className="text-[0.72rem] text-[#5A5248] hover:text-[#E05C7A] transition-colors cursor-pointer bg-transparent border-none">↓</button>
                  <button className="text-[0.72rem] text-[#5A5248] hover:text-[#E8E0CC] transition-colors cursor-pointer bg-transparent border-none">Reply</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function PuzzleGuidePage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: '#050810',
        color: '#E8E0CC',
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)
          `,
        }}
      />

      <main className="flex-1 flex flex-col min-h-screen relative z-10">
        <div
          className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]"
          style={{ background: 'rgba(5,8,16,0.8)' }}
        >
          <div className="flex items-center gap-3">
            <a href="/" className="text-[#5A5248] hover:text-[#C8A96E] transition-colors text-[0.82rem] font-['Space_Mono',monospace] cursor-pointer">← All Reports</a>
            <span className="text-[#2A2520]">/</span>
            <span className="text-[#E8E0CC] text-[0.82rem] font-['Space_Mono',monospace] truncate max-w-[320px]">{reportDetail.id}</span>
          </div>
          <div className="flex gap-2 items-center">
            <button style={clipBtn} className="px-[14px] py-2 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[#9A8F78] border border-[rgba(200,169,110,0.15)] bg-transparent hover:border-[rgba(200,169,110,0.35)] hover:text-[#E8E0CC] transition-all cursor-pointer">
              ↗ Share
            </button>
            <button style={clipBtn} className="px-[14px] py-2 text-[0.78rem] font-bold uppercase tracking-[0.08em] text-[#9A8F78] border border-[rgba(200,169,110,0.15)] bg-transparent hover:border-[rgba(200,169,110,0.35)] hover:text-[#E8E0CC] transition-all cursor-pointer">
              ☆ Save
            </button>
            <button
              style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}
              className="px-[18px] py-2 text-[#050810] text-[0.78rem] font-bold tracking-[0.1em] uppercase cursor-pointer hover:brightness-110 transition-all border-none"
            >
              + Write Report
            </button>
          </div>
        </div>

        <div className="p-8 flex-1">
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <GameBadge game={reportDetail.game} />
              <TypeBadge type={reportDetail.type} />
              <span className="text-[0.7rem] font-['Space_Mono',monospace] text-[#5A5248]">v{reportDetail.version}</span>
              <span className="text-[0.7rem] font-['Space_Mono',monospace] text-[#5A5248]">·</span>
              <span className="text-[0.7rem] font-['Space_Mono',monospace] text-[#5A5248]">{reportDetail.readTime}</span>
            </div>
            <h1 className="font-['Cinzel',serif] text-[1.45rem] font-bold text-[#E8E0CC] leading-[1.35] mb-3">
              {reportDetail.title}
            </h1>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[rgba(200,169,110,0.4)] to-transparent" />
              <div className="w-[6px] h-[6px] bg-[#C8A96E] rotate-45" />
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full border border-[#8B6A2E] bg-[rgba(200,169,110,0.1)] flex items-center justify-center font-['Cinzel',serif] text-[0.6rem] text-[#C8A96E] font-bold">
                  {reportDetail.initials}
                </div>
                <span className="text-[0.82rem] font-semibold text-[#9A8F78]">{reportDetail.author}</span>
              </div>
              <span className="text-[#2A2520]">·</span>
              <span className="text-[0.72rem] font-['Space_Mono',monospace] text-[#5A5248]">{reportDetail.dateFormatted}</span>
              <span className="text-[#2A2520]">·</span>
              <span className="text-[0.75rem] text-[#C8A96E] tracking-[2px]">{renderStars(reportDetail.rating)}</span>
              <span className="font-['Space_Mono',monospace] text-[0.72rem] text-[#4ECDC4]">↑ {reportDetail.votes}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0C1220] border border-[rgba(168,85,247,0.2)] p-5" style={clipWidget}>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-[3px] h-[14px] bg-[#A855F7] inline-block" />
                <span className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC]">{puzzleData.name}</span>
              </div>
              <div className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace] mb-4 pl-[7px]">Version {puzzleData.version} · Simulated Universe</div>
              <p className="text-[0.85rem] text-[#9A8F78] leading-[1.7]">
                World 10 is the current endgame of Simulated Universe. This guide ranks every available Erudition and Hunt path blessing for the current meta, and provides a phase-by-phase strategy for the final boss fight. Difficulty scales with your team — recommended MOC 10-clear roster.
              </p>
            </div>

            <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
                <span className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC]">Path Tier List</span>
              </div>
              <div className="space-y-[6px]">
                {puzzleData.blessings.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-[10px] bg-[rgba(255,255,255,0.01)] border border-[rgba(200,169,110,0.07)]">
                    <span className={`w-7 h-7 flex items-center justify-center font-['Cinzel',serif] text-[0.8rem] font-bold border shrink-0 ${ratingColor[b.rating]}`} style={clipBadge}>
                      {b.rating}
                    </span>
                    <div className="w-[100px] shrink-0">
                      <span className="text-[0.82rem] font-semibold text-[#E8E0CC]">{b.path}</span>
                    </div>
                    <p className="text-[0.78rem] text-[#5A5248] leading-[1.5] flex-1">{b.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
                <span className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC]">Phase Strategy</span>
              </div>
              <div className="flex gap-0">
                {puzzleData.strategy.map((s, i) => (
                  <div key={i} className="flex-1 relative">
                    {i < puzzleData.strategy.length - 1 && (
                      <div className="absolute top-[14px] right-0 w-full h-[1px] bg-[rgba(200,169,110,0.15)] z-0" />
                    )}
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-[28px] h-[28px] bg-[rgba(200,169,110,0.1)] border border-[#C8A96E] flex items-center justify-center font-['Cinzel',serif] text-[0.72rem] font-bold text-[#C8A96E]">
                          {i + 1}
                        </div>
                        <span className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-[#C8A96E]">{s.phase}</span>
                      </div>
                      <p className="text-[0.8rem] text-[#9A8F78] leading-[1.6] pr-4">{s.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
                <span className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC]">Recommended Teams</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Hypercarry (Hunt)', members: ['Seele', 'Bronya', 'Tingyun', 'Huohuo'],     rating: 'S', note: 'Fastest clear, best for speedrun' },
                  { name: 'DoT (Nihility)',     members: ['Kafka', 'Black Swan', 'Ruan Mei', 'Luocha'], rating: 'A', note: 'Reliable sustain, great for beginners' },
                  { name: 'FUA (Erudition)',    members: ['Herta', 'Himeko', 'Robin', 'Lingsha'],      rating: 'A', note: 'AoE clear, handles spawning phases well' },
                ].map((team, i) => (
                  <div key={i} className="bg-[rgba(255,255,255,0.01)] border border-[rgba(200,169,110,0.08)] px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 flex items-center justify-center font-['Cinzel',serif] text-[0.72rem] font-bold border ${ratingColor[team.rating]}`} style={clipBadge}>{team.rating}</span>
                        <span className="text-[0.85rem] font-semibold text-[#E8E0CC]">{team.name}</span>
                      </div>
                      <span className="text-[0.7rem] text-[#5A5248]">{team.note}</span>
                    </div>
                    <div className="flex gap-2">
                      {team.members.map((m, j) => (
                        <span key={j} className="px-[10px] py-[3px] bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.15)] text-[0.72rem] text-[#C8A96E]" style={clipBadge}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <CommentsSection />
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
      `}</style>
    </div>
  );
}