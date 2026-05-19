'use client';

import { useState } from 'react';

// ─── THEME CONSTANTS ──────────────────────────────────────────────────────────
const clipHex = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' } as React.CSSProperties;
const clipHexSm = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' } as React.CSSProperties;
const clipBadge = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' } as React.CSSProperties;
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' } as React.CSSProperties;
const clipBtn = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' } as React.CSSProperties;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const reportData = {
  title: "Deep Dive: 'Where the Stairway Leads' Quest Analysis",
  game: "hsr",
  type: "mission",
  author: "AstreaN_7",
  initials: "AN",
  rating: 5,
  votes: 248,
  date: "2h ago",
  version: "3.2",
  readTime: "12 min read",
  views: 1842,
  tags: ["HSR 3.2", "Robin", "Penacony", "Story Analysis"],
  story: {
    summary: `Quest "Where the Stairway Leads" membawa pemain menyelami kenangan terpendam Penacony — sebuah planet mimpi yang diselimuti musik dan ilusi. Robin, sang diva berbintang, mengundang Trailblazer ke pertunjukan malam yang tampak sempurna, namun di balik tirai gemerlap itu tersembunyi rahasia yang mengguncang fondasi realitas.`,
    acts: [
      {
        label: "ACT I",
        title: "Tirai Terbuka",
        content: `Trailblazer tiba di The Reverie — hotel megah di jantung Penacony. Suara orkestra mengalun lembut, menciptakan atmosfer yang terasa terlalu sempurna. Robin menyambut dengan senyuman hangat, namun mata Trailblazer menangkap sesuatu yang ganjil: para tamu bergerak dengan pola mekanis yang mengulang dirinya sendiri, seperti jam yang berputar tanpa henti.`,
        revelation: "Penacony bukan sekadar planet wisata — ia adalah penjara mimpi kolektif.",
      },
      {
        label: "ACT II",
        title: "Melodi yang Pecah",
        content: `Ketika Robin mulai bernyanyi di atas panggung, Trailblazer merasakan resonansi aneh dari Memori Kristal yang dibawanya. Melodi Robin ternyata mengandung frekuensi tersembunyi yang mampu membuka lapisan-lapisan memori yang telah dikunci oleh entitas misterius bernama "The Watchmaker". Setiap nada membawa kilasan masa lalu yang menyakitkan.`,
        revelation: "Lagu Robin adalah kunci untuk membuka ingatan yang disegel.",
      },
      {
        label: "ACT III",
        title: "Tangga Menuju Kebenaran",
        content: `Di puncak menara kristal Penacony, Trailblazer berhadapan dengan bayangan Robin yang sesungguhnya — versi dirinya sebelum ingatan dikurangi. Terungkap bahwa The Watchmaker telah mencuri emosi terdalam setiap pengunjung demi menjaga "harmoni" palsu Penacony. Robin telah mengetahui ini sejak lama, namun memilih menyanyi karena itu satu-satunya cara melawan.`,
        revelation: "Pengorbanan sejati adalah menyanyi bahkan ketika hatimu berteriak.",
      },
    ],
    verdict: "Quest ini adalah mahakarya naratif HSR — dengan pacing yang rapi, twist yang memuaskan, dan pendalaman karakter Robin yang emosional. Rating: 10/10.",
  },
  puzzle: {
    summary: `Quest ini menampilkan 4 segmen teka-teki utama yang memadukan eksplorasi lingkungan, logika kristal memori, dan decoding melodi. Tingkat kesulitan bervariasi dari ★★☆ hingga ★★★★☆.`,
    puzzles: [
      {
        id: 1,
        name: "Cermin Memori",
        difficulty: 3,
        type: "Observasi",
        desc: "Temukan 5 objek yang 'salah' di setiap ruangan The Reverie. Objek tersebut berkedip samar tiap 8 detik. Solusi: gerakkan kamera secara perlahan dan perhatikan bayangan yang tidak sinkron.",
        tip: "Aktifkan mode 'Dream Resonance' dari inventory sebelum masuk ruangan.",
        color: "#4ECDC4",
      },
      {
        id: 2,
        name: "Urutan Melodi",
        difficulty: 4,
        type: "Logika Audio",
        desc: "Pemain harus mengurutkan 6 fragmen melodi Robin berdasarkan kronologi emosional, bukan kronologi waktu. Kunci: perhatikan lirik tersembunyi yang tercetak di panel kristal.",
        tip: "Dengarkan nada minor — selalu merepresentasikan momen kehilangan.",
        color: "#C8A96E",
      },
      {
        id: 3,
        name: "Labirin Kristal",
        difficulty: 2,
        type: "Navigasi",
        desc: "Labirin tiga lantai dengan dinding yang berubah setiap 30 detik. Setiap lantai memiliki simbol 'anchor' yang harus diaktifkan sebelum lantai berubah kembali.",
        tip: "Peta lantai 2 adalah cerminan terbalik dari lantai 1.",
        color: "#A855F7",
      },
      {
        id: 4,
        name: "Kode The Watchmaker",
        difficulty: 5,
        type: "Dekripsi",
        desc: "Teka-teki akhir memerlukan pemain memecahkan cipher berbasis jam. Setiap angka merepresentasikan jam tertentu dalam memori kolektif Penacony. Salah memasukkan kode 3x akan mereset progress.",
        tip: "Kode selalu berakhir dengan '12' — midnight, batas antara mimpi dan realita.",
        color: "#E05C7A",
      },
    ],
  },
};

// ─── MINI GAME DATA ───────────────────────────────────────────────────────────
const quizQuestions = [
  {
    q: "Di mana lokasi pertunjukan utama Robin dalam quest ini?",
    options: ["The Grand Theater", "The Reverie Hotel", "Penacony Plaza", "Crystal Spire"],
    answer: 1,
  },
  {
    q: "Apa nama entitas misterius yang mencuri emosi pengunjung Penacony?",
    options: ["The Dreamweaver", "The Clockwork", "The Watchmaker", "The Resonator"],
    answer: 2,
  },
  {
    q: "Berapa frekuensi berbahaya yang tersembunyi dalam melodi Robin?",
    options: ["432 Hz", "528 Hz", "741 Hz", "Tidak disebutkan secara eksplisit"],
    answer: 3,
  },
  {
    q: "Apa fungsi Memori Kristal yang dibawa Trailblazer?",
    options: [
      "Senjata untuk melawan musuh",
      "Beresonansi dengan frekuensi tersembunyi melodi",
      "Membuka portal menuju dimensi lain",
      "Merekam percakapan NPC",
    ],
    answer: 1,
  },
  {
    q: "Apa tema sentral dari quest 'Where the Stairway Leads'?",
    options: [
      "Persahabatan melintasi waktu",
      "Pengorbanan dan kebenaran yang menyakitkan",
      "Ambisi dan kekuasaan",
      "Pencarian identitas diri",
    ],
    answer: 1,
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const renderStars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

const difficultyBar = (n: number, color: string) => (
  <div className="flex gap-[3px] items-center">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} style={{
        width: 8, height: 8,
        background: i <= n ? color : 'rgba(255,255,255,0.08)',
        clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)',
      }} />
    ))}
    <span style={{ color, fontSize: '0.65rem', marginLeft: 4, fontFamily: 'Space Mono, monospace' }}>{n}/5</span>
  </div>
);

function GameBadge({ game }: { game: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    hsr: { label: 'Star Rail', cls: 'bg-[rgba(78,205,196,0.1)] text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]' },
    gi: { label: 'Genshin', cls: 'bg-[rgba(109,209,138,0.1)] text-[#6DD18A] border border-[rgba(109,209,138,0.3)]' },
    zzz: { label: 'Zenless', cls: 'bg-[rgba(168,85,247,0.1)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]' },
    hi3: { label: 'Honkai 3rd', cls: 'bg-[rgba(224,92,122,0.1)] text-[#E05C7A] border border-[rgba(224,92,122,0.3)]' },
  };
  const g = map[game];
  if (!g) return null;
  return (
    <span className={`inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase ${g.cls}`} style={clipBadge}>
      {g.label}
    </span>
  );
}

function SectionHeader({ icon, title, accent = '#C8A96E' }: { icon: React.ReactNode; title: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center justify-center w-8 h-8 border" style={{
        borderColor: `${accent}40`,
        background: `${accent}12`,
        clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)',
        color: accent,
      }}>
        {icon}
      </div>
      <h2 className="font-['Cinzel',serif] text-[1rem] font-bold text-[#E8E0CC] tracking-[0.06em]">{title}</h2>
      <div className="flex-1 h-[1px]" style={{ background: `linear-gradient(90deg, ${accent}30, transparent)` }} />
    </div>
  );
}

// ─── STORY SECTION ────────────────────────────────────────────────────────────
function StorySection({ data }: { data: typeof reportData.story }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <section className="mb-10">
      <SectionHeader
        icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2h10v8H2z" stroke="currentColor" strokeWidth="1.1" /><line x1="4" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="0.9" /><line x1="4" y1="7.5" x2="8" y2="7.5" stroke="currentColor" strokeWidth="0.9" /></svg>}
        title="Story Ringkasan"
        accent="#C8A96E"
      />
      <div className="mb-6 p-5 bg-[#0C1220] border border-[rgba(200,169,110,0.15)] relative" style={clipWidget}>
        <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-[#C8A96E] to-transparent" />
        <p className="text-[0.9rem] text-[#B0A88A] leading-[1.8] pl-2">{data.summary}</p>
      </div>

      <div className="flex flex-col gap-3">
        {data.acts.map((act, i) => (
          <div
            key={i}
            className="bg-[#0C1220] border border-[rgba(200,169,110,0.12)] overflow-hidden transition-all duration-300 cursor-pointer hover:border-[rgba(200,169,110,0.3)]"
            style={clipWidget}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="flex items-center gap-2 min-w-[60px]">
                <span className="text-[0.6rem] font-['Space_Mono',monospace] text-[#5A5248] tracking-[0.15em]">{act.label}</span>
                <div className="w-[1px] h-4 bg-[rgba(200,169,110,0.2)]" />
              </div>
              <span className="font-['Cinzel',serif] text-[0.88rem] font-semibold text-[#E8E0CC] flex-1">{act.title}</span>
              <div style={{
                width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.3s', transform: expanded === i ? 'rotate(180deg)' : 'rotate(0deg)',
                color: '#5A5248',
              }}>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            {expanded === i && (
              <div className="px-5 pb-5 border-t border-[rgba(200,169,110,0.08)]">
                <p className="text-[0.85rem] text-[#9A8F78] leading-[1.8] mt-4 mb-4">{act.content}</p>
                <div className="flex items-start gap-2 p-3 bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.15)]" style={clipHexSm}>
                  <span className="text-[#C8A96E] text-[0.7rem] font-bold tracking-[0.1em] uppercase mt-[1px] shrink-0">✦ Revelation</span>
                  <span className="text-[0.82rem] text-[#C8A96E] italic">{act.revelation}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 p-4 border border-[rgba(200,169,110,0.25)] relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(200,169,110,0.06), rgba(200,169,110,0.02))',
        ...clipWidget
      }}>
        <div className="absolute top-2 right-4 font-['Cinzel',serif] text-[3rem] font-bold text-[rgba(200,169,110,0.04)] select-none pointer-events-none">VERDICT</div>
        <div className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[#5A5248] mb-1">Editor's Verdict</div>
        <p className="text-[0.85rem] text-[#C8A96E] italic">{data.verdict}</p>
      </div>
    </section>
  );
}

// ─── PUZZLE SECTION ───────────────────────────────────────────────────────────
function PuzzleSection({ data }: { data: typeof reportData.puzzle }) {
  const [active, setActive] = useState(0);
  const puzzle = data.puzzles[active];
  return (
    <section className="mb-10">
      <SectionHeader
        icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polygon points="7,1 12,4 12,10 7,13 2,10 2,4" stroke="currentColor" strokeWidth="1.1" /><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="0.8" /></svg>}
        title="Ringkasan Teka-Teki"
        accent="#A855F7"
      />
      <div className="p-5 bg-[#0C1220] border border-[rgba(168,85,247,0.15)] mb-5" style={clipWidget}>
        <p className="text-[0.88rem] text-[#9A8F78] leading-[1.8]">{data.summary}</p>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {data.puzzles.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{ ...clipHexSm, borderColor: active === i ? p.color : 'rgba(168,85,247,0.15)', color: active === i ? p.color : '#5A5248', background: active === i ? `${p.color}12` : 'transparent' }}
            className="px-4 py-[6px] text-[0.75rem] font-bold tracking-[0.06em] uppercase border transition-all duration-200 cursor-pointer font-['Rajdhani',sans-serif] hover:border-[rgba(168,85,247,0.4)]"
          >
            Teka-Teki {p.id}
          </button>
        ))}
      </div>
      <div className="bg-[#0A0F1A] border p-6 transition-all duration-300" style={{ borderColor: `${puzzle.color}30`, ...clipWidget }}>
        <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-['Cinzel',serif] text-[1rem] font-bold text-[#E8E0CC]">{puzzle.name}</span>
              <span className="text-[0.62rem] font-bold tracking-[0.12em] uppercase px-2 py-[2px] border" style={{
                color: puzzle.color, borderColor: `${puzzle.color}40`, background: `${puzzle.color}10`, ...clipBadge
              }}>{puzzle.type}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[0.7rem] text-[#5A5248]">Kesulitan:</span>
              {difficultyBar(puzzle.difficulty, puzzle.color)}
            </div>
          </div>
          <div className="font-['Space_Mono',monospace] text-[2rem] font-bold opacity-10" style={{ color: puzzle.color }}>
            #{puzzle.id.toString().padStart(2, '0')}
          </div>
        </div>
        <p className="text-[0.87rem] text-[#9A8F78] leading-[1.8] mb-4">{puzzle.desc}</p>
        <div className="flex items-start gap-2 p-3" style={{
          background: `${puzzle.color}08`, borderLeft: `2px solid ${puzzle.color}60`
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginTop: 2, color: puzzle.color, flexShrink: 0 }}>
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
            <line x1="6" y1="4" x2="6" y2="6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="6" cy="8.5" r="0.6" fill="currentColor" />
          </svg>
          <div>
            <span className="text-[0.65rem] font-bold tracking-[0.12em] uppercase mb-1 block" style={{ color: puzzle.color }}>Pro Tip</span>
            <span className="text-[0.82rem] italic" style={{ color: `${puzzle.color}CC` }}>{puzzle.tip}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MINI GAME ────────────────────────────────────────────────────────────────
function MiniGame() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ q: number; chosen: number; correct: boolean }[]>([]);
  const [shake, setShake] = useState(false);

  const q = quizQuestions[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.answer;
    if (!correct) { setShake(true); setTimeout(() => setShake(false), 600); }
    const newAnswers = [...answers, { q: current, chosen: idx, correct }];
    setAnswers(newAnswers);
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current < quizQuestions.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
      } else {
        setPhase('result');
      }
    }, 1200);
  };

  const reset = () => {
    setPhase('intro'); setCurrent(0); setSelected(null);
    setScore(0); setAnswers([]);
  };

  const pct = Math.round((score / quizQuestions.length) * 100);
  const rank = pct >= 80 ? { label: 'Trailblazer Sejati', color: '#C8A96E' }
    : pct >= 60 ? { label: 'Penjelajah Handal', color: '#4ECDC4' }
      : { label: 'Pemula Penacony', color: '#9A8F78' };

  return (
    <section className="mb-10">
      <SectionHeader
        icon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polygon points="7,1 13,4 13,10 7,13 1,10 1,4" stroke="currentColor" strokeWidth="1.1" /><line x1="7" y1="5" x2="7" y2="7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><circle cx="7" cy="9.5" r="0.7" fill="currentColor" /></svg>}
        title="Mini Game — Uji Pemahamanmu"
        accent="#4ECDC4"
      />

      {phase === 'intro' && (
        <div className="bg-[#0C1220] border border-[rgba(78,205,196,0.2)] p-8 text-center" style={clipWidget}>
          <div className="font-['Cinzel',serif] text-[1.2rem] font-bold text-[#E8E0CC] mb-3">Kuis: Penacony Awakening</div>
          <p className="text-[0.85rem] text-[#9A8F78] mb-6 leading-relaxed max-w-md mx-auto">
            Seberapa dalam pemahamanmu tentang quest ini? Jawab {quizQuestions.length} pertanyaan dan buktikan kamu layak menjadi Trailblazer sejati.
          </p>
          <div className="flex items-center justify-center gap-6 mb-8">
            {[
              { label: 'Pertanyaan', val: quizQuestions.length },
              { label: 'Topik', val: 'Quest Lore' },
              { label: 'Reward', val: 'Badge' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-['Space_Mono',monospace] text-[#4ECDC4] text-[1.2rem] font-bold">{s.val}</div>
                <div className="text-[0.65rem] text-[#5A5248] tracking-[0.1em] uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setPhase('playing')}
            className="px-8 py-3 font-['Rajdhani',sans-serif] text-[0.85rem] font-bold tracking-[0.12em] uppercase text-[#050810] cursor-pointer hover:brightness-110 transition-all duration-200 border-none"
            style={{ background: 'linear-gradient(135deg, #2A8A84, #4ECDC4)', ...clipBtn }}
          >
            Mulai Kuis
          </button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="bg-[#0C1220] border border-[rgba(78,205,196,0.2)] p-6" style={clipWidget}>
          <div className="flex items-center justify-between mb-5">
            <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#5A5248]">
              PERTANYAAN {current + 1} / {quizQuestions.length}
            </span>
            <span className="font-['Space_Mono',monospace] text-[0.7rem] text-[#4ECDC4]">{score} benar</span>
          </div>
          <div className="h-1 bg-[rgba(78,205,196,0.1)] mb-6 overflow-hidden" style={clipHexSm}>
            <div className="h-full bg-[#4ECDC4] transition-all duration-500" style={{ width: `${((current) / quizQuestions.length) * 100}%` }} />
          </div>
          <div style={{ animation: shake ? 'shakeX 0.5s ease' : 'none' }}>
            <p className="font-['Cinzel',serif] text-[0.95rem] text-[#E8E0CC] leading-[1.6] mb-5">{q.q}</p>
            <div className="flex flex-col gap-3">
              {q.options.map((opt, i) => {
                let borderColor = 'rgba(78,205,196,0.12)';
                let bg = 'rgba(78,205,196,0.03)';
                let textColor = '#9A8F78';
                if (selected !== null) {
                  if (i === q.answer) { borderColor = '#4ECDC4'; bg = 'rgba(78,205,196,0.12)'; textColor = '#4ECDC4'; }
                  else if (i === selected && selected !== q.answer) { borderColor = '#E05C7A'; bg = 'rgba(224,92,122,0.08)'; textColor = '#E05C7A'; }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={selected !== null}
                    className="flex items-center gap-4 px-5 py-4 border text-left transition-all duration-200 cursor-pointer font-['Rajdhani',sans-serif] text-[0.88rem] font-semibold disabled:cursor-default"
                    style={{ borderColor, background: bg, color: textColor, ...clipHex }}
                  >
                    <span className="font-['Space_Mono',monospace] text-[0.7rem] opacity-50 shrink-0">{['A', 'B', 'C', 'D'][i]}</span>
                    {opt}
                    {selected !== null && i === q.answer && <span className="ml-auto text-[#4ECDC4]">✓</span>}
                    {selected !== null && i === selected && selected !== q.answer && <span className="ml-auto text-[#E05C7A]">✗</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.2)] p-8 text-center" style={clipWidget}>
          <div className="font-['Space_Mono',monospace] text-[3.5rem] font-bold mb-1" style={{ color: rank.color }}>{pct}%</div>
          <div className="font-['Cinzel',serif] text-[1rem] font-bold mb-1" style={{ color: rank.color }}>{rank.label}</div>
          <div className="text-[0.78rem] text-[#5A5248] mb-6 font-['Space_Mono',monospace]">{score}/{quizQuestions.length} jawaban benar</div>
          <div className="flex flex-col gap-2 mb-8 text-left max-w-sm mx-auto">
            {answers.map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-[0.8rem]">
                <span className={a.correct ? 'text-[#4ECDC4]' : 'text-[#E05C7A]'}>{a.correct ? '✓' : '✗'}</span>
                <span className="text-[#5A5248] font-['Space_Mono',monospace] text-[0.65rem]">Q{i + 1}</span>
                <span className="text-[#9A8F78] flex-1 truncate text-[0.75rem]">{quizQuestions[i].q.substring(0, 40)}...</span>
              </div>
            ))}
          </div>
          <button
            onClick={reset}
            className="px-6 py-3 font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.12em] uppercase cursor-pointer transition-all duration-200 border"
            style={{ borderColor: '#C8A96E40', color: '#C8A96E', background: 'rgba(200,169,110,0.06)', ...clipBtn }}
          >
            Coba Lagi
          </button>
        </div>
      )}

      <style>{`
        @keyframes shakeX {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
      `}</style>
    </section>
  );
}

// ─── SIDEBAR KANAN ────────────────────────────────────────────────────────────
function DetailSidebar({ report }: { report: typeof reportData }) {
  const [voted, setVoted] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      {/* Info Report */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-[3px] h-[12px] bg-[#C8A96E]" />
          <span className="font-['Cinzel',serif] text-[0.78rem] font-semibold text-[#E8E0CC]">Info Report</span>
        </div>
        {[
          { label: 'Game', val: <GameBadge game={report.game} /> },
          { label: 'Tipe', val: <span className="text-[0.78rem] text-[#C8A96E]">{report.type.charAt(0).toUpperCase() + report.type.slice(1)}</span> },
          { label: 'Versi', val: <span className="font-['Space_Mono',monospace] text-[0.75rem] text-[#9A8F78]">v{report.version}</span> },
          { label: 'Rating', val: <span className="text-[0.72rem] text-[#C8A96E] tracking-[1px]">{renderStars(report.rating)}</span> },
          { label: 'Views', val: <span className="font-['Space_Mono',monospace] text-[0.75rem] text-[#4ECDC4]">{report.views.toLocaleString()}</span> },
          { label: 'Read time', val: <span className="text-[0.75rem] text-[#9A8F78]">{report.readTime}</span> },
        ].map((row, i) => (
          <div key={i} className="flex justify-between items-center py-[7px] border-b border-[rgba(200,169,110,0.06)] last:border-b-0">
            <span className="text-[0.7rem] text-[#5A5248] tracking-[0.08em] uppercase">{row.label}</span>
            {row.val}
          </div>
        ))}
      </div>

      {/* Penulis */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-[3px] h-[12px] bg-[#C8A96E]" />
          <span className="font-['Cinzel',serif] text-[0.78rem] font-semibold text-[#E8E0CC]">Penulis</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[rgba(200,169,110,0.08)] border border-[#8B6A2E] flex items-center justify-center font-['Cinzel',serif] text-[0.7rem] text-[#C8A96E] font-bold shrink-0">
            {report.initials}
          </div>
          <div>
            <div className="text-[0.88rem] font-semibold text-[#E8E0CC]">{report.author}</div>
            <div className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">Kontributor · LV.72</div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 text-center p-2 border border-[rgba(200,169,110,0.1)] bg-[rgba(200,169,110,0.04)]" style={clipHexSm}>
            <div className="font-['Space_Mono',monospace] text-[0.8rem] text-[#C8A96E]">32</div>
            <div className="text-[0.6rem] text-[#5A5248] tracking-[0.08em] uppercase">Reports</div>
          </div>
          <div className="flex-1 text-center p-2 border border-[rgba(78,205,196,0.1)] bg-[rgba(78,205,196,0.04)]" style={clipHexSm}>
            <div className="font-['Space_Mono',monospace] text-[0.8rem] text-[#4ECDC4]">4.8k</div>
            <div className="text-[0.6rem] text-[#5A5248] tracking-[0.08em] uppercase">Votes</div>
          </div>
        </div>
      </div>

      {/* Vote */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 text-center" style={clipWidget}>
        <div className="font-['Space_Mono',monospace] text-[2rem] font-bold text-[#C8A96E] mb-1">
          {voted ? report.votes + 1 : report.votes}
        </div>
        <div className="text-[0.65rem] text-[#5A5248] tracking-[0.1em] uppercase mb-4">total votes</div>
        <button
          onClick={() => setVoted(v => !v)}
          className="w-full py-3 font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.12em] uppercase cursor-pointer transition-all duration-300 border-none"
          style={{
            background: voted ? 'linear-gradient(135deg, #5A3A0A, #8B6A2E)' : 'linear-gradient(135deg, #8B6A2E, #C8A96E)',
            color: voted ? '#C8A96E' : '#050810',
            ...clipBtn,
          }}
        >
          {voted ? '✓ Voted' : '↑ Vote Report'}
        </button>
      </div>

      {/* Tags */}
      <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-[3px] h-[12px] bg-[#C8A96E]" />
          <span className="font-['Cinzel',serif] text-[0.78rem] font-semibold text-[#E8E0CC]">Tags</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {report.tags.map((t, i) => (
            <span
              key={i}
              className="px-3 py-1 text-[0.7rem] font-bold cursor-pointer transition-all duration-200 border border-[rgba(200,169,110,0.2)] text-[#C8A96E] bg-[rgba(200,169,110,0.06)] hover:bg-[rgba(200,169,110,0.14)]"
              style={clipBadge}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ReportDetailPage() {
  const [activeSection, setActiveSection] = useState<'story' | 'puzzle' | 'game'>('story');
  const r = reportData;

  const sections = [
    { id: 'story' as const, label: 'Story', accent: '#C8A96E' },
    { id: 'puzzle' as const, label: 'Teka-Teki', accent: '#A855F7' },
    { id: 'game' as const, label: 'Mini Game', accent: '#4ECDC4' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)
        `
      }} />

      {/* Top Navigation Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-4 border-b border-[rgba(200,169,110,0.15)] backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.85)' }}>
        {/* Logo and Breadcrumb */}
        <div className="flex items-center gap-3">
          <a href="/UserHoyo/dashboard" className="flex items-center gap-2 font-['Cinzel',serif] text-[0.9rem] font-bold text-[#C8A96E] no-underline">
            <svg width="26" height="26" viewBox="0 0 28 28">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#C8A96E" strokeWidth="1.2" />
              <circle cx="14" cy="14" r="3.5" fill="rgba(200,169,110,0.3)" stroke="#C8A96E" strokeWidth="0.8" />
              <line x1="14" y1="8" x2="14" y2="10.5" stroke="#C8A96E" strokeWidth="0.8" />
              <line x1="14" y1="17.5" x2="14" y2="20" stroke="#C8A96E" strokeWidth="0.8" />
              <line x1="8" y1="14" x2="10.5" y2="14" stroke="#C8A96E" strokeWidth="0.8" />
              <line x1="17.5" y1="14" x2="20" y2="14" stroke="#C8A96E" strokeWidth="0.8" />
            </svg>
            <span className="hidden sm:inline">Hoyoverse Hub</span>
          </a>
          <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-[rgba(200,169,110,0.15)]">
            <a href="/UserHoyo/all-report" className="text-[#5A5248] hover:text-[#C8A96E] transition-colors text-[0.75rem] font-['Space_Mono',monospace]">All Reports</a>
            <span className="text-[#5A5248] text-[0.75rem]">/</span>
            <span className="text-[#9A8F78] text-[0.75rem] font-['Space_Mono',monospace] truncate max-w-[200px]">Where the Stairway Leads</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 text-[0.75rem] font-bold tracking-[0.08em] uppercase font-['Rajdhani',sans-serif] cursor-pointer transition-all border border-[rgba(200,169,110,0.2)] text-[#9A8F78] bg-transparent hover:border-[#C8A96E] hover:text-[#C8A96E]"
            style={clipBtn}
          >
            ← Kembali
          </button>
          <button
            className="px-4 py-2 text-[0.75rem] font-bold tracking-[0.08em] uppercase font-['Rajdhani',sans-serif] cursor-pointer transition-all border border-[rgba(78,205,196,0.2)] text-[#4ECDC4] bg-transparent hover:bg-[rgba(78,205,196,0.08)]"
            style={clipBtn}
          >
            ⬆ Bagikan
          </button>

          {/* User Avatar (mobile friendly) */}
          <div className="flex items-center gap-2 ml-2 pl-3 border-l border-[rgba(200,169,110,0.12)]">
            <div className="w-8 h-8 rounded-full border border-[#8B6A2E] bg-[rgba(200,169,110,0.1)] flex items-center justify-center font-['Cinzel',serif] text-[0.7rem] text-[#C8A96E] font-bold">
              TB
            </div>
            <div className="hidden lg:block">
              <div className="text-[0.78rem] font-semibold text-[#E8E0CC] leading-tight">Trailblazer_01</div>
              <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">LV.60 · 48 reports</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-10 py-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8 pb-7 border-b border-[rgba(200,169,110,0.1)]">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <GameBadge game={r.game} />
            <span className="inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase bg-[rgba(200,169,110,0.12)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)]" style={clipBadge}>
              Mission
            </span>
            <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248]">v{r.version}</span>
            <span className="text-[#5A5248]">·</span>
            <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248]">{r.readTime}</span>
            <span className="text-[#5A5248]">·</span>
            <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248]">{r.date}</span>
          </div>

          <h1 className="font-['Cinzel',serif] text-[1.4rem] md:text-[1.7rem] font-bold text-[#E8E0CC] leading-[1.35] mb-4 max-w-3xl">
            {r.title}
          </h1>

          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[rgba(200,169,110,0.08)] border border-[#8B6A2E] flex items-center justify-center font-['Cinzel',serif] text-[0.65rem] text-[#C8A96E] font-bold">
                {r.initials}
              </div>
              <span className="text-[0.82rem] text-[#9A8F78]">{r.author}</span>
            </div>
            <div className="text-[0.72rem] text-[#C8A96E] tracking-[1px]">{renderStars(r.rating)}</div>
            <span className="font-['Space_Mono',monospace] text-[0.75rem] text-[#4ECDC4]">↑ {r.votes} votes</span>
            <span className="font-['Space_Mono',monospace] text-[0.75rem] text-[#5A5248]">👁 {r.views.toLocaleString()} views</span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="px-5 py-2 text-[0.82rem] font-bold tracking-[0.08em] uppercase cursor-pointer transition-all duration-200 border font-['Rajdhani',sans-serif]"
              style={{
                ...clipHex,
                borderColor: activeSection === s.id ? s.accent : 'rgba(255,255,255,0.06)',
                color: activeSection === s.id ? s.accent : '#5A5248',
                background: activeSection === s.id ? `${s.accent}10` : 'transparent',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 xl:gap-8 items-start">
          <div>
            {activeSection === 'story' && <StorySection data={r.story} />}
            {activeSection === 'puzzle' && <PuzzleSection data={r.puzzle} />}
            {activeSection === 'game' && <MiniGame />}
          </div>
          <div className="lg:sticky lg:top-[80px]">
            <DetailSidebar report={r} />
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
      `}</style>
    </div>
  );
}