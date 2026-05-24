'use client';

import { useState } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const reportDetail = {
  id: 'RPT-0412',
  title: "Deep Dive: 'Where the Stairway Leads' Quest Analysis",
  type: 'mission',
  game: 'hsr',
  version: '3.2',
  author: 'AstreaN_7',
  initials: 'AN',
  authorLevel: 'LV.52',
  authorReports: 31,
  rating: 5,
  votes: 248,
  date: '2h ago',
  dateFormatted: 'May 22, 2026 · 18:42',
  readTime: '12 min read',
  tags: ['Quest', 'HSR 3.2', 'Story', 'Lore'],
  summary:
    'A comprehensive breakdown of the new companion quest in Honkai: Star Rail v3.2, covering all major story beats, hidden dialogue choices, and their impact on the ending. Includes collectible locations, achievement triggers, and lore connections to the main Trailblaze story.',
};

const questSections = [
  {
    id: 'q1',
    label: 'Availability',
    items: [
      { key: 'Unlock Condition', value: 'Complete "Penacony, Land of Dreams" main quest + Trailblaze Level 45+' },
      { key: 'Version', value: 'Honkai: Star Rail v3.2' },
      { key: 'Quest Type', value: 'Companion Mission (Robin)' },
      { key: 'Recommended Level', value: '65+' },
      { key: 'Estimated Duration', value: '2–3 hours (full completion)' },
    ],
  },
  {
    id: 'q2',
    label: 'Story Walkthrough',
    content: [
      {
        step: 'Act I — The Encore',
        description:
          'The quest begins at the Penacony Concert Hall. Robin invites the Trailblazer backstage after a performance. A hidden cutscene triggers if you accepted the "Melody Resonance" side quest previously — this adds two unique dialogue lines and a commemorative item.',
        warning: null,
        tip: 'TIP: Equip Robin as your active companion before entering the concert hall to trigger an extra voice line from Aventurine.',
      },
      {
        step: 'Act II — Dissonance',
        description:
          'Robin reveals she has been receiving anonymous sheet music through unknown means. The investigation leads to the Dreamscape Archives — a hidden area not accessible during the main story. Three puzzles guard the path; all are optional but reward a 5★ Light Cone material cache.',
        warning: 'WARNING: If you skip the archive puzzles, you permanently miss the "Melody of the Lost" achievement and its 60 Stellar Jades.',
        tip: null,
      },
      {
        step: 'Act III — The Last Movement',
        description:
          'The climax involves a choice: confront the anonymous sender alone or bring Robin. Both paths lead to the same revelation, but the Robin path unlocks a companion-specific cutscene and the "Resonant Souls" title. The final boss encounter scales with your team composition.',
        warning: null,
        tip: 'TIP: Bringing Robin to the finale adds approximately 8 minutes of unique voiced dialogue and an exclusive CG illustration.',
      },
    ],
  },
];

const comments = [
  { author: 'VoidHunter_X',   initials: 'VH', time: '45 min ago', text: 'Saved me from missing that achievement. The warning about the archive puzzles is so easy to overlook on a first run.', votes: 34 },
  { author: 'QuantumGale',    initials: 'QG', time: '1h ago',     text: "Great breakdown! I would add that the final boss also drops Robin's signature material if you clear under 3 turns — worth noting for min-maxers.", votes: 28 },
  { author: 'Mei_Stellaron',  initials: 'MS', time: '2h ago',     text: 'The hidden cutscene in Act I absolutely caught me off guard. This guide is the only place that mentioned the Aventurine voice line trigger.', votes: 19 },
  { author: 'SilverWolf_Fan', initials: 'SW', time: '3h ago',     text: 'Minor correction: you need Trailblaze Level 45, not 40. Otherwise perfect guide, thank you!', votes: 11 },
];

// ─── STYLE CONSTANTS ─────────────────────────────────────────────────────────

const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } as React.CSSProperties;
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' } as React.CSSProperties;
const clipBtn    = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' } as React.CSSProperties;
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' } as React.CSSProperties;

const gameBadgeMap: Record<string, { label: string; className: string }> = {
  hsr: { label: 'Star Rail',  className: 'bg-[rgba(78,205,196,0.1)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]' },
  gi:  { label: 'Genshin',    className: 'bg-[rgba(109,209,138,0.1)] text-[#6DD18A] border border-[rgba(109,209,138,0.3)]' },
  zzz: { label: 'Zenless',    className: 'bg-[rgba(168,85,247,0.1)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]' },
  hi3: { label: 'Honkai 3rd', className: 'bg-[rgba(224,92,122,0.1)] text-[#E05C7A] border border-[rgba(224,92,122,0.3)]' },
};

const typeBadgeMap: Record<string, string> = {
  mission: 'bg-[rgba(200,169,110,0.12)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)]',
  event:   'bg-[rgba(78,205,196,0.12)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]',
  puzzle:  'bg-[rgba(168,85,247,0.12)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]',
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

export default function QuestMissionPage() {
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
            <div className="bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.12)] p-5" style={clipWidget}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
                <span className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC]">Report Summary</span>
              </div>
              <p className="text-[0.88rem] text-[#9A8F78] leading-[1.7]">{reportDetail.summary}</p>
            </div>

            {questSections.map(section => (
              <div key={section.id} className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
                  <span className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC]">{section.label}</span>
                </div>
                {section.items && (
                  <table className="w-full">
                    <tbody>
                      {section.items.map((item, i) => (
                        <tr key={i} className="border-b border-[rgba(200,169,110,0.07)] last:border-b-0">
                          <td className="py-[10px] pr-4 text-[0.75rem] font-bold tracking-[0.06em] text-[#5A5248] uppercase w-[200px] align-top">{item.key}</td>
                          <td className="py-[10px] text-[0.85rem] text-[#C8A96E] font-['Space_Mono',monospace]">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {section.content && (
                  <div className="space-y-5">
                    {section.content.map((act, i) => (
                      <div key={i} className="relative pl-4 border-l border-[rgba(200,169,110,0.2)]">
                        <div className="absolute left-[-5px] top-[6px] w-[9px] h-[9px] bg-[#C8A96E] rotate-45" />
                        <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#C8A96E] mb-2">{act.step}</div>
                        <p className="text-[0.85rem] text-[#9A8F78] leading-[1.7] mb-2">{act.description}</p>
                        {act.warning && (
                          <div className="bg-[rgba(224,92,122,0.08)] border border-[rgba(224,92,122,0.25)] px-4 py-[10px] text-[0.78rem] text-[#E05C7A] font-semibold tracking-[0.03em]" style={clipBadge}>
                            {act.warning}
                          </div>
                        )}
                        {act.tip && (
                          <div className="bg-[rgba(78,205,196,0.06)] border border-[rgba(78,205,196,0.2)] px-4 py-[10px] text-[0.78rem] text-[#4ECDC4] font-semibold tracking-[0.03em]" style={clipBadge}>
                            {act.tip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
                <span className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC]">Collectibles &amp; Rewards</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Stellar Jade',          amount: '220', icon: '◆', color: 'text-[#4ECDC4]' },
                  { name: "Robin's Music Sheet",    amount: '×1',  icon: '♪', color: 'text-[#C8A96E]' },
                  { name: 'Resonant Souls Title',   amount: '×1',  icon: '✦', color: 'text-[#F0D080]' },
                  { name: 'Trailblaze EXP',         amount: '800', icon: '▲', color: 'text-[#6DD18A]' },
                  { name: 'Hidden Achievement',     amount: '×1',  icon: '★', color: 'text-[#F0D080]' },
                  { name: 'Companion Story CG',     amount: '×1',  icon: '◈', color: 'text-[#A855F7]' },
                ].map((r, i) => (
                  <div key={i} className="bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.1)] px-4 py-3" style={clipHexSm}>
                    <div className={`text-[1.1rem] mb-1 ${r.color}`}>{r.icon}</div>
                    <div className={`font-['Space_Mono',monospace] text-[0.82rem] font-bold ${r.color}`}>{r.amount}</div>
                    <div className="text-[0.7rem] text-[#5A5248] mt-[2px]">{r.name}</div>
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