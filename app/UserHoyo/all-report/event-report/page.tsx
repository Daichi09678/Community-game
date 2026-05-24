'use client';

import { useState } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const reportDetail = {
  id: 'RPT-0412',
  title: "Event Report: 'Clouded Sanctuary' Analysis",
  type: 'event',
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
  readTime: '8 min read',
  tags: ['Event', 'HSR 3.2', 'Clouded Sanctuary', 'Guide'],
};

const eventData = {
  name: 'Clouded Sanctuary',
  type: 'event',
  version: '3.2',
  duration: 'May 15 – June 12, 2026',
  stages: [
    { id: 1, name: 'Prelude: The Gathering Storm',     reward: '80 Stellar Jade', difficulty: 'Easy',   cleared: true  },
    { id: 2, name: 'Stage I: Trial of Memory',          reward: '100 Stellar Jade', difficulty: 'Normal', cleared: true  },
    { id: 3, name: 'Stage II: Echoes of Resonance',     reward: '120 Stellar Jade', difficulty: 'Hard',   cleared: false },
    { id: 4, name: 'Stage III: The Suspended Sanctum',  reward: '160 Stellar Jade', difficulty: 'Expert', cleared: false },
    { id: 5, name: 'Final Act: Convergence Point',      reward: '200 Stellar Jade + 4★ LC', difficulty: 'Expert+', cleared: false },
  ],
  totalReward: '660 Stellar Jade + 4★ Light Cone + 30,000 Credits',
  tips: [
    'Clear all Memory Trial objectives (gold rating) before Stage III for bonus rewards.',
    'The Final Act enemy has a Imaginary weakness — bring Welt or Luocha for optimal performance.',
    'Event shop resets weekly; prioritize the 4★ Eidolons before Credits.',
  ],
};

const comments = [
  { author: 'VoidHunter_X',   initials: 'VH', time: '45 min ago', text: 'Great event breakdown! The tips about Stage III really helped me clear it faster.', votes: 34 },
  { author: 'QuantumGale',    initials: 'QG', time: '1h ago',     text: 'The total reward calculation is accurate. Confirmed from my own clear.', votes: 28 },
  { author: 'Mei_Stellaron',  initials: 'MS', time: '2h ago',     text: 'Any tips for the Final Act boss? Still struggling with phase 2.', votes: 19 },
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
  event: 'bg-[rgba(78,205,196,0.12)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]',
};

const difficultyColor: Record<string, string> = {
  Easy:     'text-[#6DD18A]',
  Normal:   'text-[#4ECDC4]',
  Hard:     'text-[#C8A96E]',
  Expert:   'text-[#E05C7A]',
  'Expert+':'text-[#A855F7]',
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

export default function EventReportPage() {
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
            <div className="bg-[#0C1220] border border-[rgba(78,205,196,0.2)] p-5" style={clipWidget}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-[3px] h-[14px] bg-[#4ECDC4] inline-block" />
                <span className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC]">Event Overview — {eventData.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Duration',   value: eventData.duration  },
                  { label: 'Version',    value: `v${eventData.version}`  },
                  { label: 'Total Jade', value: '660 Stellar Jade'  },
                  { label: 'Bonus',      value: '4★ Light Cone'     },
                ].map((item, i) => (
                  <div key={i} className="bg-[rgba(78,205,196,0.04)] border border-[rgba(78,205,196,0.1)] px-4 py-3">
                    <div className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-[#5A5248] mb-1">{item.label}</div>
                    <div className="text-[0.85rem] font-['Space_Mono',monospace] text-[#4ECDC4]">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.15)] px-4 py-3">
                <span className="text-[0.65rem] font-bold tracking-[0.12em] uppercase text-[#5A5248]">Total Reward Pool: </span>
                <span className="text-[0.85rem] text-[#C8A96E] font-semibold">{eventData.totalReward}</span>
              </div>
            </div>

            <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
                <span className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC]">Stage Breakdown</span>
              </div>
              <div className="space-y-2">
                {eventData.stages.map((stage) => (
                  <div key={stage.id} className={`flex items-center gap-3 px-4 py-3 border transition-all duration-200 ${stage.cleared ? 'bg-[rgba(78,205,196,0.04)] border-[rgba(78,205,196,0.15)]' : 'bg-[rgba(200,169,110,0.02)] border-[rgba(200,169,110,0.08)]'}`}>
                    <div className={`w-5 h-5 shrink-0 flex items-center justify-center text-[0.7rem] font-bold border ${stage.cleared ? 'border-[#4ECDC4] text-[#4ECDC4] bg-[rgba(78,205,196,0.1)]' : 'border-[rgba(200,169,110,0.2)] text-[#5A5248]'}`}>
                      {stage.cleared ? '✓' : stage.id}
                    </div>
                    <div className="flex-1">
                      <div className="text-[0.85rem] text-[#E8E0CC] font-semibold">{stage.name}</div>
                      <div className="flex items-center gap-3 mt-[2px]">
                        <span className={`text-[0.72rem] font-bold tracking-[0.06em] ${difficultyColor[stage.difficulty] ?? 'text-[#9A8F78]'}`}>{stage.difficulty}</span>
                        <span className="text-[0.7rem] text-[#5A5248]">·</span>
                        <span className="text-[0.72rem] font-['Space_Mono',monospace] text-[#C8A96E]">{stage.reward}</span>
                      </div>
                    </div>
                    {stage.cleared && (
                      <span className="text-[0.65rem] font-bold tracking-[0.08em] uppercase text-[#4ECDC4] bg-[rgba(78,205,196,0.1)] border border-[rgba(78,205,196,0.25)] px-2 py-[2px]" style={clipBadge}>Cleared</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block" />
                <span className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC]">Event Tips</span>
              </div>
              <div className="space-y-3">
                {eventData.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#C8A96E] mt-[2px] shrink-0">0{i + 1}</span>
                    <p className="text-[0.85rem] text-[#9A8F78] leading-[1.6]">{tip}</p>
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