'use client';

import { useState } from 'react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';
type SettingsTab = 'account' | 'notifications' | 'display' | 'privacy' | 'linked' | 'support';

// ─── CLIP PATHS ───────────────────────────────────────────────────────────────

const clipHex    = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }                                     as React.CSSProperties;
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' }                                     as React.CSSProperties;
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }                                     as React.CSSProperties;
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }   as React.CSSProperties;
const clipBtn    = { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }       as React.CSSProperties;
const clipCard   = { clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }   as React.CSSProperties;

// ─── GAME CONFIG ──────────────────────────────────────────────────────────────

const gameBadgeMap: Record<string, { label: string; className: string; color: string }> = {
  hsr: { label: 'Star Rail',  className: 'bg-[rgba(78,205,196,0.1)]   text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]',   color: '#4ECDC4' },
  gi:  { label: 'Genshin',    className: 'bg-[rgba(109,209,138,0.1)]  text-[#6DD18A] border border-[rgba(109,209,138,0.3)]',  color: '#6DD18A' },
  zzz: { label: 'Zenless',    className: 'bg-[rgba(168,85,247,0.1)]   text-[#A855F7] border border-[rgba(168,85,247,0.3)]',   color: '#A855F7' },
  hi3: { label: 'Honkai 3rd', className: 'bg-[rgba(224,92,122,0.1)]   text-[#E05C7A] border border-[rgba(224,92,122,0.3)]',   color: '#E05C7A' },
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function NavGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-3 mb-2 mt-6 first:mt-0">
      {children}
    </div>
  );
}

function NavBadge({ children, variant }: { children: React.ReactNode; variant?: 'new' }) {
  return (
    <span
      className={`ml-auto font-['Space_Mono',monospace] text-[0.65rem] px-2 py-[2px]
        ${variant === 'new' ? 'bg-[rgba(78,205,196,0.15)] text-[#4ECDC4]' : 'bg-[rgba(200,169,110,0.15)] text-[#C8A96E]'}`}
      style={{ clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)' }}
    >
      {children}
    </span>
  );
}

function NavItem({ children, href, active, onClick }: {
  children: React.ReactNode; href?: string; active: boolean; onClick?: () => void;
}) {
  const cls = `flex items-center gap-[10px] px-3 py-[9px] text-[0.88rem] font-semibold
    tracking-[0.04em] transition-all duration-200 cursor-pointer mb-[2px] no-underline relative
    font-['Rajdhani',sans-serif]
    ${active ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]' : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`;
  const inner = (<>{active && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}{children}</>);
  if (href) return <a href={href} className={cls} style={clipHex}>{inner}</a>;
  return <div className={cls} style={clipHex} onClick={onClick}>{inner}</div>;
}

function GameBadge({ game }: { game: string }) {
  const g = gameBadgeMap[game];
  if (!g) return null;
  return (
    <span className={`inline-flex items-center px-2 py-[3px] text-[0.6rem] font-bold tracking-[0.08em] uppercase whitespace-nowrap ${g.className}`} style={clipBadge}>
      {g.label}
    </span>
  );
}

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
      <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
      {children}
    </div>
  );
}

// ─── TOGGLE SWITCH ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, color = '#C8A96E' }: { checked: boolean; onChange: () => void; color?: string }) {
  return (
    <button
      onClick={onChange}
      className="relative w-10 h-5 transition-all duration-300 shrink-0"
      style={{
        background: checked ? `${color}33` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${checked ? color : 'rgba(255,255,255,0.1)'}`,
        clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)',
      }}
    >
      <span
        className="absolute top-[2px] w-[14px] h-[14px] transition-all duration-300"
        style={{
          left: checked ? 'calc(100% - 16px)' : '2px',
          background: checked ? color : '#5A5248',
          clipPath: 'polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)',
        }}
      />
    </button>
  );
}

// ─── SETTINGS ROW ─────────────────────────────────────────────────────────────

function SettingsRow({ label, desc, children, danger }: {
  label: string; desc?: string; children: React.ReactNode; danger?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 py-4 border-b border-[rgba(200,169,110,0.06)] last:border-0 
      ${danger ? 'hover:bg-[rgba(224,92,122,0.02)]' : 'hover:bg-[rgba(200,169,110,0.02)]'} -mx-5 px-5 transition-all duration-200`}>
      <div className="flex-1">
        <div className={`text-[0.85rem] font-semibold font-['Rajdhani',sans-serif] ${danger ? 'text-[#E05C7A]' : 'text-[#E8E0CC]'}`}>{label}</div>
        {desc && <div className="text-[0.68rem] text-[#5A5248] font-['Space_Mono',monospace] mt-[2px] leading-relaxed">{desc}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ─── SELECT INPUT ─────────────────────────────────────────────────────────────

function HexSelect({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.2)] text-[#C8A96E] text-[0.75rem] font-['Space_Mono',monospace] outline-none px-3 py-[6px] cursor-pointer hover:border-[rgba(200,169,110,0.4)] transition-all duration-200 appearance-none"
      style={clipBadge}
    >
      {options.map(o => <option key={o.value} value={o.value} className="bg-[#0C1220]">{o.label}</option>)}
    </select>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(5,8,16,0.85)] backdrop-blur-[6px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-[#0C1220] border border-[rgba(200,169,110,0.2)]" style={clipCard}>
        {children}
      </div>
    </div>
  );
}

// ─── LOGOUT MODAL ─────────────────────────────────────────────────────────────

function LogoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onClose(); }, 1500);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-8 text-center">
        <div className="flex justify-center mb-5">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full">
              <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" fill="none" stroke="#E05C7A" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7"/>
              <polygon points="40,12 66,26 66,54 40,68 14,54 14,26" fill="rgba(224,92,122,0.06)" stroke="#E05C7A" strokeWidth="0.8" opacity="0.4"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[2rem]">⚠</span>
            </div>
          </div>
        </div>

        <div className="font-['Cinzel',serif] text-[1rem] font-bold text-[#E8E0CC] mb-2">Sign Out of Hub?</div>
        <p className="text-[0.75rem] text-[#5A5248] font-['Space_Mono',monospace] leading-relaxed mb-1">
          Your session as <span className="text-[#C8A96E]">Trailblazer_01</span> will be terminated.
        </p>
        <p className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace] leading-relaxed mb-7">
          All unsaved changes will be lost. Your reports and data remain safe.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-[10px] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer border border-[rgba(200,169,110,0.3)] text-[#9A8F78] hover:border-[#C8A96E] hover:text-[#C8A96E] transition-all duration-200 bg-transparent"
            style={clipBtn}
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex-1 py-[10px] text-white font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer border-none transition-all duration-200 disabled:opacity-70"
            style={{ background: loading ? 'rgba(224,92,122,0.3)' : 'linear-gradient(135deg, #8B2040, #E05C7A)', ...clipBtn }}
          >
            {loading ? '◌ Signing out...' : '→ Sign Out'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── SUPPORT MODAL ────────────────────────────────────────────────────────────

type TicketCategory = 'bug' | 'account' | 'report' | 'suggestion' | 'other';

function SupportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<'choose' | 'ticket' | 'faq' | 'success'>('choose');
  const [category, setCategory] = useState<TicketCategory>('bug');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const categories: { value: TicketCategory; label: string; icon: string; color: string }[] = [
    { value: 'bug',        label: 'Bug Report',       icon: '🐛', color: '#E05C7A' },
    { value: 'account',    label: 'Account Issue',    icon: '◉',  color: '#C8A96E' },
    { value: 'report',     label: 'Content Report',   icon: '⬡',  color: '#4ECDC4' },
    { value: 'suggestion', label: 'Suggestion',       icon: '✦',  color: '#A855F7' },
    { value: 'other',      label: 'Other',            icon: '◈',  color: '#9A8F78' },
  ];

  const faqs = [
    { q: 'How do I upload a quest guide?',         a: 'Go to All Reports → click "New Report" in the top right. Fill in the quest name, game tag, and content. Your report will be live after a short moderation check.' },
    { q: 'Why is my report pending review?',       a: 'New reports are reviewed within 1–3 hours to ensure quality. Reports with spoilers or incorrect tags may take longer.' },
    { q: 'How does the voting system work?',       a: 'Users can upvote helpful reports. Votes count toward your total score and leaderboard rank. You earn achievement badges at milestone thresholds.' },
    { q: 'Can I link multiple Hoyoverse accounts?',a: 'Yes — go to Settings → Linked Accounts. You can connect UID accounts for HSR, Genshin, ZZZ and HI3 separately.' },
    { q: 'How do I recover my password?',          a: 'Click "Forgot Password" on the login screen. A reset link will be sent to your registered email within 5 minutes.' },
    { q: 'What qualifies as a spoiler tag?',       a: 'Any plot revelation within 2 weeks of a patch release should be spoiler-tagged. Use the [SPOILER] label in your report title.' },
  ];

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    setTimeout(() => { setSending(false); setStep('success'); }, 1800);
  };

  const resetAndClose = () => {
    setStep('choose'); setSubject(''); setMessage(''); setCategory('bug'); setFaqOpen(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={resetAndClose}>
      <div className="px-6 py-5 border-b border-[rgba(200,169,110,0.15)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step !== 'choose' && (
            <button onClick={() => setStep('choose')} className="text-[#5A5248] hover:text-[#C8A96E] transition-colors text-[0.85rem] mr-1 bg-transparent border-none cursor-pointer">←</button>
          )}
          <div>
            <div className="font-['Cinzel',serif] text-[0.85rem] font-bold text-[#E8E0CC]">
              {step === 'choose' ? 'Support Center' : step === 'ticket' ? 'Submit Ticket' : step === 'faq' ? 'FAQ' : 'Ticket Submitted'}
            </div>
            <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">Hoyoverse Hub · Support</div>
          </div>
        </div>
        <button onClick={resetAndClose} className="text-[#5A5248] hover:text-[#E05C7A] transition-colors text-[1.1rem] leading-none bg-transparent border-none cursor-pointer">✕</button>
      </div>

      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {step === 'choose' && (
          <div>
            <div className="flex items-center gap-3 p-3 mb-5 bg-[rgba(109,209,138,0.06)] border border-[rgba(109,209,138,0.2)]" style={clipBadge}>
              <span className="w-2 h-2 rounded-full bg-[#6DD18A] animate-pulse shrink-0" />
              <div>
                <div className="text-[0.72rem] text-[#6DD18A] font-['Space_Mono',monospace]">All systems operational</div>
                <div className="text-[0.6rem] text-[#5A5248]">Avg response time: ~2 hrs · Last checked 5 min ago</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => setStep('ticket')}
                className="p-4 border border-[rgba(200,169,110,0.15)] hover:border-[rgba(200,169,110,0.4)] bg-[rgba(200,169,110,0.03)] hover:bg-[rgba(200,169,110,0.06)] transition-all duration-200 text-left bg-transparent cursor-pointer"
                style={clipWidget}
              >
                <div className="text-[1.2rem] mb-2">📨</div>
                <div className="font-['Rajdhani',sans-serif] text-[0.85rem] font-bold text-[#E8E0CC]">Submit Ticket</div>
                <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] mt-1">Report a bug or issue directly to our team</div>
              </button>
              <button
                onClick={() => setStep('faq')}
                className="p-4 border border-[rgba(200,169,110,0.15)] hover:border-[rgba(200,169,110,0.4)] bg-[rgba(200,169,110,0.03)] hover:bg-[rgba(200,169,110,0.06)] transition-all duration-200 text-left bg-transparent cursor-pointer"
                style={clipWidget}
              >
                <div className="text-[1.2rem] mb-2">⬡</div>
                <div className="font-['Rajdhani',sans-serif] text-[0.85rem] font-bold text-[#E8E0CC]">FAQ</div>
                <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] mt-1">Browse common questions & answers</div>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 border border-[rgba(200,169,110,0.1)] hover:border-[rgba(200,169,110,0.25)] transition-all duration-200 cursor-pointer" style={clipBadge}>
                <span className="text-[1rem]">💬</span>
                <div className="flex-1">
                  <div className="text-[0.78rem] font-semibold text-[#E8E0CC] font-['Rajdhani',sans-serif]">Join Our Discord</div>
                  <div className="text-[0.6rem] text-[#5A5248] font-['Space_Mono',monospace]">Real-time help from the community</div>
                </div>
                <span className="text-[#5A5248] text-[0.7rem]">→</span>
              </div>
              <div className="flex items-center gap-3 p-3 border border-[rgba(200,169,110,0.1)] hover:border-[rgba(200,169,110,0.25)] transition-all duration-200 cursor-pointer" style={clipBadge}>
                <span className="text-[1rem]">📧</span>
                <div className="flex-1">
                  <div className="text-[0.78rem] font-semibold text-[#E8E0CC] font-['Rajdhani',sans-serif]">Email Support</div>
                  <div className="text-[0.6rem] text-[#5A5248] font-['Space_Mono',monospace]">support@hoyohub.gg</div>
                </div>
                <span className="text-[#5A5248] text-[0.7rem]">→</span>
              </div>
            </div>
          </div>
        )}

        {step === 'ticket' && (
          <div className="space-y-4">
            <div>
              <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">Category</div>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className="flex items-center gap-1 px-3 py-[5px] text-[0.68rem] font-bold font-['Rajdhani',sans-serif] border transition-all duration-200 cursor-pointer bg-transparent"
                    style={{
                      clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)',
                      borderColor: category === c.value ? c.color : 'rgba(200,169,110,0.15)',
                      color: category === c.value ? c.color : '#5A5248',
                      background: category === c.value ? `${c.color}12` : 'transparent',
                    }}
                  >
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">Subject</div>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Brief description of your issue…"
                className="w-full bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.2)] text-[#E8E0CC] text-[0.8rem] font-['Space_Mono',monospace] outline-none px-3 py-2 placeholder-[#3A3228] focus:border-[rgba(200,169,110,0.5)] transition-all duration-200"
                style={clipBadge}
              />
            </div>

            <div>
              <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">Related Game (optional)</div>
              <div className="flex gap-2 flex-wrap">
                {(['hsr','gi','zzz','hi3'] as GameKey[]).map(g => (
                  <GameBadge key={g} game={g} />
                ))}
              </div>
            </div>

            <div>
              <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">Message</div>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe your issue in detail. Include steps to reproduce if it's a bug…"
                rows={5}
                className="w-full bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.2)] text-[#E8E0CC] text-[0.8rem] font-['Space_Mono',monospace] outline-none px-3 py-2 resize-none placeholder-[#3A3228] focus:border-[rgba(200,169,110,0.5)] transition-all duration-200"
                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
              />
              <div className="text-right text-[0.58rem] text-[#5A5248] font-['Space_Mono',monospace] mt-1">{message.length}/1000</div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!subject.trim() || !message.trim() || sending}
              className="w-full py-[10px] font-['Rajdhani',sans-serif] text-[0.82rem] font-bold tracking-[0.12em] uppercase border-none cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', color: '#050810', ...clipBtn }}
            >
              {sending ? '◌ Sending...' : '→ Submit Ticket'}
            </button>
          </div>
        )}

        {step === 'faq' && (
          <div className="space-y-2">
            <div className="text-[0.65rem] text-[#5A5248] font-['Space_Mono',monospace] mb-4">
              Click a question to expand the answer.
            </div>
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[rgba(200,169,110,0.1)] overflow-hidden transition-all duration-200 hover:border-[rgba(200,169,110,0.25)]" style={clipBadge}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left cursor-pointer bg-transparent border-none"
                >
                  <span className="text-[0.78rem] font-semibold text-[#E8E0CC] font-['Rajdhani',sans-serif] flex-1">{faq.q}</span>
                  <span className="text-[#C8A96E] text-[0.7rem] shrink-0 transition-transform duration-200"
                    style={{ transform: faqOpen === i ? 'rotate(180deg)' : 'none' }}>▾</span>
                </button>
                {faqOpen === i && (
                  <div className="px-4 pb-4 text-[0.72rem] text-[#9A8F78] font-['Space_Mono',monospace] leading-relaxed border-t border-[rgba(200,169,110,0.06)]" style={{ paddingTop: '12px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <div className="flex justify-center mb-5">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full">
                  <polygon points="40,4 74,22 74,58 40,76 6,58 6,22" fill="none" stroke="#6DD18A" strokeWidth="1.5" opacity="0.7"/>
                  <polygon points="40,12 66,26 66,54 40,68 14,54 14,26" fill="rgba(109,209,138,0.06)" stroke="#6DD18A" strokeWidth="0.8" opacity="0.4"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[2rem]">✓</div>
              </div>
            </div>
            <div className="font-['Cinzel',serif] text-[1rem] font-bold text-[#6DD18A] mb-2">Ticket Submitted</div>
            <p className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace] leading-relaxed mb-1">
              Ticket <span className="text-[#C8A96E]">#HH-{Math.floor(Math.random() * 90000) + 10000}</span> has been created.
            </p>
            <p className="text-[0.68rem] text-[#5A5248] font-['Space_Mono',monospace] leading-relaxed mb-7">
              Our team will respond to your registered email within 24 hours.
            </p>
            <button
              onClick={resetAndClose}
              className="px-8 py-[10px] font-['Rajdhani',sans-serif] text-[0.82rem] font-bold tracking-[0.12em] uppercase border-none cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', color: '#050810', ...clipBtn }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── LINKED ACCOUNTS ─────────────────────────────────────────────────────────

function LinkedAccountRow({ game, uid, linked, color }: {
  game: GameKey; uid?: string; linked: boolean; color: string;
}) {
  const [isLinked, setIsLinked] = useState(linked);
  const [inputUid, setInputUid] = useState(uid || '');
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex items-center gap-4 py-4 border-b border-[rgba(200,169,110,0.06)] last:border-0">
      <div className="w-9 h-9 shrink-0 flex items-center justify-center border" style={{
        borderColor: color, background: `${color}10`,
        clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)',
      }}>
        <span className="text-[0.6rem] font-bold font-['Space_Mono',monospace]" style={{ color }}>{game.toUpperCase()}</span>
      </div>
      <div className="flex-1">
        <GameBadge game={game} />
        <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] mt-[3px]">
          {isLinked ? `UID: ${inputUid}` : 'Not linked'}
        </div>
      </div>
      {editing && isLinked && (
        <input
          value={inputUid}
          onChange={e => setInputUid(e.target.value)}
          placeholder="Enter UID"
          className="bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.25)] text-[#C8A96E] text-[0.7rem] font-['Space_Mono',monospace] outline-none px-2 py-1 w-28"
          style={clipBadge}
        />
      )}
      <div className="flex gap-2">
        {isLinked && (
          <button
            onClick={() => setEditing(!editing)}
            className="px-3 py-[5px] text-[0.65rem] font-['Space_Mono',monospace] border border-[rgba(200,169,110,0.2)] text-[#9A8F78] hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.4)] transition-all duration-200 bg-transparent cursor-pointer"
            style={clipBadge}
          >
            {editing ? 'Save' : 'Edit'}
          </button>
        )}
        <button
          onClick={() => {
            if (isLinked) {
              setIsLinked(false);
              setInputUid('');
              setEditing(false);
            } else {
              setIsLinked(true);
            }
          }}
          className="px-3 py-[5px] text-[0.65rem] font-['Rajdhani',sans-serif] font-bold border transition-all duration-200 cursor-pointer bg-transparent"
          style={{
            ...clipBadge,
            borderColor: isLinked ? 'rgba(224,92,122,0.3)' : `${color}44`,
            color: isLinked ? '#E05C7A' : color,
            background: isLinked ? 'rgba(224,92,122,0.05)' : `${color}0D`,
          }}
        >
          {isLinked ? 'Unlink' : '+ Link'}
        </button>
      </div>
    </div>
  );
}


// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab]       = useState<SettingsTab>('account');
  const [showLogout, setShowLogout]     = useState(false);
  const [showSupport, setShowSupport]   = useState(false);
  const [saved, setSaved]               = useState(false);

  // Account
  const [email, setEmail]               = useState('trailblazer@cosmoexpress.net');
  const [username, setUsername]         = useState('Trailblazer_01');

  // Notifications
  const [notifVotes, setNotifVotes]     = useState(true);
  const [notifReply, setNotifReply]     = useState(true);
  const [notifPatch, setNotifPatch]     = useState(true);
  const [notifEmail, setNotifEmail]     = useState(false);
  const [notifEvent, setNotifEvent]     = useState(true);
  const [notifRank, setNotifRank]       = useState(false);

  // Display
  const [theme, setTheme]               = useState('astral');
  const [language, setLanguage]         = useState('en');
  const [density, setDensity]           = useState('normal');
  const [animations, setAnimations]     = useState(true);
  const [hexGrid, setHexGrid]           = useState(true);

  // Privacy
  const [profilePublic, setProfilePublic] = useState(true);
  const [showActivity, setShowActivity]   = useState(true);
  const [showVotes, setShowVotes]         = useState(true);
  const [twoFactor, setTwoFactor]         = useState(false);
  const [spoilerDefault, setSpoilerDefault] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(123,79,166,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(78,205,196,0.07) 0%, transparent 50%)' }} />

      {/* SIDEBAR */}
      <aside className="w-[260px] shrink-0 bg-[#0C1220] border-r border-[rgba(200,169,110,0.15)] flex flex-col fixed top-0 bottom-0 left-0 z-50 overflow-y-auto max-md:hidden">
        <div className="px-6 py-7 border-b border-[rgba(200,169,110,0.15)]">
          <a href="#" className="flex items-center gap-[10px] font-['Cinzel',serif] text-[0.95rem] font-bold text-[#C8A96E] no-underline">
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

        <nav className="flex-1 px-4 py-5">
          <NavGroupLabel>Main</NavGroupLabel>
          <NavItem href="/UserHoyo/dashboard" active={false}><GridIcon /> Dashboard</NavItem>
          <NavItem href="/UserHoyo/all-report" active={false}><HexIcon /> All Reports <NavBadge>1.2K</NavBadge></NavItem>

          <NavGroupLabel>Category</NavGroupLabel>
          <NavItem href="/UserHoyo/mission-quest" active={false}><HexDotIcon /> Mission &amp; Quest <NavBadge>482</NavBadge></NavItem>
          <NavItem href="/UserHoyo/event" active={false}><CalendarIcon /> Event Seasonal <NavBadge variant="new">New</NavBadge></NavItem>
          <NavItem href="/UserHoyo/puzzle" active={false}><DiamondIcon /> Puzzle &amp; Riddles <NavBadge>324</NavBadge></NavItem>

          <NavGroupLabel>Community</NavGroupLabel>
          <NavItem href="/UserHoyo/discussion" active={false}><UsersIcon /> Discussion</NavItem>
          <NavItem href="/UserHoyo/leaderboard" active={false}><StarIcon /> Leaderboard</NavItem>
          <NavItem href="/UserHoyo/profile" active={false}><PersonIcon /> My Profile</NavItem>
          <NavItem active={true}><InfoIcon /> Settings</NavItem>
        </nav>

        <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
          <div className="flex items-center gap-[10px]">
            <div className="w-9 h-9 rounded-full border border-[#C8A96E] flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] font-bold text-[#C8A96E] shrink-0" style={{ background: '#C8A96E15' }}>TB</div>
            <div>
              <div className="text-[0.85rem] font-semibold text-[#E8E0CC]">{username}</div>
              <div className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">LV.60 · 48 reports</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">

        {/* Topbar */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.85)' }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">Settings</div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">Manage your account, preferences & security</div>
          </div>
          <div className="flex gap-2 items-center">
            {saved && (
              <span className="text-[0.68rem] text-[#6DD18A] font-['Space_Mono',monospace] border border-[rgba(109,209,138,0.3)] px-3 py-1 bg-[rgba(109,209,138,0.06)]" style={clipBadge}>
                ✓ Saved
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-[18px] py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer hover:brightness-110 transition-all duration-200 border-none"
              style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}
            >
              ✓ Save Changes
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-1">
          <div className="grid grid-cols-[220px_1fr] gap-6 max-[900px]:grid-cols-1">

            {/* SETTINGS NAV */}
            <div className="space-y-1">
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-3" style={clipWidget}>
                <div className="text-[0.6rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-2 mb-3 font-['Space_Mono',monospace]">Preferences</div>
                {settingsTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-[10px] px-3 py-[9px] text-[0.85rem] font-semibold tracking-[0.03em] transition-all duration-200 cursor-pointer mb-[2px] relative border-none bg-transparent font-['Rajdhani',sans-serif]
                      ${activeTab === tab.id ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]' : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`}
                    style={clipHex}
                  >
                    {activeTab === tab.id && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
                    <span className="shrink-0">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}

                <div className="h-[0.5px] bg-[rgba(200,169,110,0.15)] my-3" />

                <button
                  onClick={() => setShowSupport(true)}
                  className="w-full flex items-center gap-[10px] px-3 py-[9px] text-[0.85rem] font-semibold text-[#9A8F78] hover:bg-[rgba(78,205,196,0.06)] hover:text-[#4ECDC4] transition-all duration-200 cursor-pointer border-none bg-transparent font-['Rajdhani',sans-serif]"
                  style={clipHex}
                >
                  <HeadsetIcon /> Customer Service
                </button>

                <button
                  onClick={() => setShowLogout(true)}
                  className="w-full flex items-center gap-[10px] px-3 py-[9px] text-[0.85rem] font-semibold text-[#9A8F78] hover:bg-[rgba(224,92,122,0.06)] hover:text-[#E05C7A] transition-all duration-200 cursor-pointer border-none bg-transparent font-['Rajdhani',sans-serif]"
                  style={clipHex}
                >
                  <LogoutIcon /> Sign Out
                </button>
              </div>

              <div className="bg-[#0C1220] border border-[rgba(224,92,122,0.1)] p-4" style={clipWidget}>
                <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#E05C7A] mb-3 font-['Space_Mono',monospace]">Danger Zone</div>
                <button className="w-full py-[8px] text-[0.72rem] font-bold font-['Rajdhani',sans-serif] border border-[rgba(224,92,122,0.3)] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.08)] transition-all duration-200 cursor-pointer bg-transparent tracking-[0.08em]" style={clipBtn}>
                  Delete Account
                </button>
              </div>
            </div>

            {/* SETTINGS PANEL */}
            <div className="space-y-5">

              {/* ACCOUNT */}
              {activeTab === 'account' && (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
                  <WidgetTitle>Account Settings</WidgetTitle>

                  <SettingsRow label="Username" desc="Your public display name across the Hub">
                    <input
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.2)] text-[#C8A96E] text-[0.75rem] font-['Space_Mono',monospace] outline-none px-3 py-[6px] w-44 focus:border-[rgba(200,169,110,0.5)] transition-all"
                      style={clipBadge}
                    />
                  </SettingsRow>

                  <SettingsRow label="Email Address" desc="Used for login and support contact">
                    <input
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.2)] text-[#C8A96E] text-[0.75rem] font-['Space_Mono',monospace] outline-none px-3 py-[6px] w-52 focus:border-[rgba(200,169,110,0.5)] transition-all"
                      style={clipBadge}
                    />
                  </SettingsRow>

                  <SettingsRow label="Change Password" desc="Last changed 30 days ago">
                    <button className="px-4 py-[6px] text-[0.72rem] font-['Rajdhani',sans-serif] font-bold border border-[rgba(200,169,110,0.25)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.1)] bg-transparent cursor-pointer transition-all duration-200" style={clipBadge}>
                      Change →
                    </button>
                  </SettingsRow>

                  <SettingsRow label="Two-Factor Auth" desc="Add an extra layer of security to your account">
                    <div className="flex items-center gap-2">
                      <span className={`text-[0.65rem] font-['Space_Mono',monospace] ${twoFactor ? 'text-[#6DD18A]' : 'text-[#5A5248]'}`}>
                        {twoFactor ? 'Enabled' : 'Disabled'}
                      </span>
                      <Toggle checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} color="#6DD18A" />
                    </div>
                  </SettingsRow>

                  <SettingsRow label="Account Level" desc="Progress toward LV.61">
                    <div className="text-right">
                      <div className="text-[#C8A96E] font-['Space_Mono',monospace] text-[0.78rem] font-bold">LV.60</div>
                      <div className="w-28 h-[3px] bg-[rgba(255,255,255,0.05)] mt-1 overflow-hidden" style={{ clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }}>
                        <div className="h-full w-[72%]" style={{ background: 'linear-gradient(90deg, #8B6A2E, #C8A96E)' }} />
                      </div>
                      <div className="text-[0.55rem] text-[#5A5248] font-['Space_Mono',monospace] mt-[3px]">7,200 / 10,000 XP</div>
                    </div>
                  </SettingsRow>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
                  <WidgetTitle>Notification Settings</WidgetTitle>

                  <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-3 font-['Space_Mono',monospace]">In-App</div>
                  <SettingsRow label="Vote Alerts" desc="Notify when someone votes on your report">
                    <Toggle checked={notifVotes} onChange={() => setNotifVotes(!notifVotes)} />
                  </SettingsRow>
                  <SettingsRow label="Comment Replies" desc="Notify when someone replies to your comment">
                    <Toggle checked={notifReply} onChange={() => setNotifReply(!notifReply)} />
                  </SettingsRow>
                  <SettingsRow label="Rank Change" desc="Notify when your leaderboard rank changes">
                    <Toggle checked={notifRank} onChange={() => setNotifRank(!notifRank)} color="#A855F7" />
                  </SettingsRow>

                  <div className="h-[0.5px] bg-[rgba(200,169,110,0.1)] my-4" />
                  <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-3 font-['Space_Mono',monospace]">Push / Email</div>
                  <SettingsRow label="Email Digest" desc="Weekly summary of your activity sent by email">
                    <Toggle checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} color="#4ECDC4" />
                  </SettingsRow>
                  <SettingsRow label="Patch Notes" desc="Notify when a new game patch is logged in the Hub">
                    <Toggle checked={notifPatch} onChange={() => setNotifPatch(!notifPatch)} color="#6DD18A" />
                  </SettingsRow>
                  <SettingsRow label="Event Reminders" desc="Get notified before limited-time events expire">
                    <Toggle checked={notifEvent} onChange={() => setNotifEvent(!notifEvent)} color="#C8A96E" />
                  </SettingsRow>

                  <div className="mt-4 p-3 bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.1)]" style={clipBadge}>
                    <div className="text-[0.65rem] text-[#5A5248] font-['Space_Mono',monospace]">
                      You can manage notification frequency globally.{' '}
                      <span className="text-[#C8A96E] cursor-pointer hover:text-[#F0D080]">Manage →</span>
                    </div>
                  </div>
                </div>
              )}

              {/* DISPLAY */}
              {activeTab === 'display' && (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
                  <WidgetTitle>Display Settings</WidgetTitle>

                  <SettingsRow label="Theme" desc="Choose your Hub color palette">
                    <HexSelect
                      value={theme}
                      onChange={setTheme}
                      options={[
                        { value: 'astral',   label: 'Astral Night' },
                        { value: 'xianzhou', label: 'Xianzhou Glow' },
                        { value: 'natlan',   label: 'Natlan Ember' },
                        { value: 'penacony', label: 'Penacony Dream' },
                        { value: 'fontaine', label: 'Fontaine Blue' },
                        { value: 'hollow',   label: 'Hollow Static' },
                      ]}
                    />
                  </SettingsRow>

                  <SettingsRow label="Language" desc="Interface language">
                    <HexSelect
                      value={language}
                      onChange={setLanguage}
                      options={[
                    { value: 'en', label: 'English' },
                    { value: 'id', label: 'Indonesian' },
                    { value: 'ja', label: '日本語' },
                    { value: 'zh', label: '中文' },
                    { value: 'ko', label: '한국어' },
                    { value: 'es', label: 'Español' },
                    { value: 'fr', label: 'Français' },
                    { value: 'de', label: 'Deutsch' },
                    { value: 'it', label: 'Italiano' },
                    { value: 'pt', label: 'Português' },
                    { value: 'ru', label: 'Русский' },
                    { value: 'ar', label: 'العربية' },
                    { value: 'hi', label: 'हिन्दी' },
                    { value: 'th', label: 'ไทย' },
                    { value: 'vi', label: 'Tiếng Việt' },
                    { value: 'tr', label: 'Türkçe' },
                    { value: 'pl', label: 'Polski' },
                    { value: 'nl', label: 'Nederlands' },
                    { value: 'sv', label: 'Svenska' },
                    { value: 'no', label: 'Norsk' },
                    { value: 'da', label: 'Dansk' },
                    { value: 'fi', label: 'Suomi' },
                    { value: 'el', label: 'Ελληνικά' },
                    { value: 'cs', label: 'Čeština' },
                    { value: 'hu', label: 'Magyar' },
                    { value: 'ro', label: 'Română' },
                    { value: 'uk', label: 'Українська' },
                     { value: 'he', label: 'עברית' },
                      ]}
                    />
                  </SettingsRow>

                  <SettingsRow label="Layout Density" desc="Adjust information density across pages">
                    <HexSelect
                      value={density}
                      onChange={setDensity}
                      options={[
                        { value: 'compact', label: 'Compact' },
                        { value: 'normal',  label: 'Normal' },
                        { value: 'roomy',   label: 'Roomy' },
                      ]}
                    />
                  </SettingsRow>

                  <SettingsRow label="Hex Grid Background" desc="Show animated hex grid overlay on banners">
                    <Toggle checked={hexGrid} onChange={() => setHexGrid(!hexGrid)} />
                  </SettingsRow>

                  <SettingsRow label="Animations" desc="Enable motion effects and transitions">
                    <Toggle checked={animations} onChange={() => setAnimations(!animations)} />
                  </SettingsRow>
                </div>
              )}

              {/* PRIVACY */}
              {activeTab === 'privacy' && (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
                  <WidgetTitle>Privacy Settings</WidgetTitle>

                  <SettingsRow label="Public Profile" desc="Allow others to view your profile and reports">
                    <Toggle checked={profilePublic} onChange={() => setProfilePublic(!profilePublic)} color="#6DD18A" />
                  </SettingsRow>

                  <SettingsRow label="Show Activity Heatmap" desc="Display your contribution calendar on your profile">
                    <Toggle checked={showActivity} onChange={() => setShowActivity(!showActivity)} />
                  </SettingsRow>

                  <SettingsRow label="Show Vote Count" desc="Let others see how many votes your reports received">
                    <Toggle checked={showVotes} onChange={() => setShowVotes(!showVotes)} />
                  </SettingsRow>

                  <SettingsRow label="Spoiler Mode Default" desc="Auto-collapse spoiler content when browsing reports">
                    <Toggle checked={spoilerDefault} onChange={() => setSpoilerDefault(!spoilerDefault)} color="#A855F7" />
                  </SettingsRow>

                  <div className="h-[0.5px] bg-[rgba(200,169,110,0.1)] my-4" />

                  <SettingsRow label="Download My Data" desc="Export all your reports and account data as a ZIP file" danger={false}>
                    <button className="px-4 py-[6px] text-[0.72rem] font-['Rajdhani',sans-serif] font-bold border border-[rgba(200,169,110,0.25)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.1)] bg-transparent cursor-pointer transition-all duration-200" style={clipBadge}>
                      Export →
                    </button>
                  </SettingsRow>

                  <SettingsRow label="Delete All Reports" desc="Permanently remove all your submitted reports" danger>
                    <button className="px-4 py-[6px] text-[0.72rem] font-['Rajdhani',sans-serif] font-bold border border-[rgba(224,92,122,0.3)] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.1)] bg-transparent cursor-pointer transition-all duration-200" style={clipBadge}>
                      Delete All
                    </button>
                  </SettingsRow>
                </div>
              )}

              {/* LINKED */}
              {activeTab === 'linked' && (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
                  <WidgetTitle>Linked Game Accounts</WidgetTitle>
                  <p className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace] mb-5 leading-relaxed">
                    Link your Hoyoverse UIDs to display stats and verify ownership of game-specific reports.
                  </p>

                  <LinkedAccountRow game="hsr" uid="700123456" linked color="#4ECDC4" />
                  <LinkedAccountRow game="gi"  uid="900654321" linked color="#6DD18A" />
                  <LinkedAccountRow game="zzz" linked={false}  color="#A855F7" />
                  <LinkedAccountRow game="hi3" linked={false}  color="#E05C7A" />

                  <div className="mt-5 p-3 bg-[rgba(78,205,196,0.04)] border border-[rgba(78,205,196,0.15)]" style={clipBadge}>
                    <div className="text-[0.65rem] text-[#4ECDC4] font-['Space_Mono',monospace]">
                      ⬡ Linking accounts lets the system auto-tag your reports with the correct game badge.
                    </div>
                  </div>
                </div>
              )}

              {/* SUPPORT TAB */}
              {activeTab === 'support' && (
                <div className="space-y-4">
                  <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
                    <WidgetTitle>Support Center</WidgetTitle>
                    <p className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace] mb-5 leading-relaxed">
                      Need help? Our team is here. Avg response time under 2 hours.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-5 max-sm:grid-cols-1">
                      <button
                        onClick={() => setShowSupport(true)}
                        className="flex items-center gap-3 p-4 border border-[rgba(200,169,110,0.15)] hover:border-[rgba(200,169,110,0.4)] bg-[rgba(200,169,110,0.03)] hover:bg-[rgba(200,169,110,0.06)] transition-all duration-200 cursor-pointer text-left bg-transparent"
                        style={clipWidget}
                      >
                        <span className="text-[1.3rem]">📨</span>
                        <div>
                          <div className="font-['Rajdhani',sans-serif] text-[0.85rem] font-bold text-[#E8E0CC]">Submit Ticket</div>
                          <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] mt-[2px]">Bug, account or content issue</div>
                        </div>
                      </button>
                      <button
                        onClick={() => { setShowSupport(true); }}
                        className="flex items-center gap-3 p-4 border border-[rgba(78,205,196,0.15)] hover:border-[rgba(78,205,196,0.35)] bg-[rgba(78,205,196,0.03)] hover:bg-[rgba(78,205,196,0.06)] transition-all duration-200 cursor-pointer text-left bg-transparent"
                        style={clipWidget}
                      >
                        <span className="text-[1.3rem]">⬡</span>
                        <div>
                          <div className="font-['Rajdhani',sans-serif] text-[0.85rem] font-bold text-[#E8E0CC]">FAQ</div>
                          <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] mt-[2px]">Browse common questions</div>
                        </div>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {[
                        { icon: '💬', label: 'Discord Community',  sub: 'discord.gg/hoyohub',           color: 'rgba(168,85,247,0.3)' },
                        { icon: '📧', label: 'Email Support',       sub: 'support@hoyohub.gg',           color: 'rgba(200,169,110,0.2)' },
                        { icon: '🐦', label: 'Twitter / X',         sub: '@HoyoverseHub',                color: 'rgba(78,205,196,0.2)' },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border border-[rgba(200,169,110,0.08)] hover:border-[rgba(200,169,110,0.2)] transition-all duration-200 cursor-pointer" style={clipBadge}>
                          <span className="text-[1rem] shrink-0">{c.icon}</span>
                          <div className="flex-1">
                            <div className="text-[0.78rem] font-semibold text-[#E8E0CC] font-['Rajdhani',sans-serif]">{c.label}</div>
                            <div className="text-[0.6rem] text-[#5A5248] font-['Space_Mono',monospace]">{c.sub}</div>
                          </div>
                          <span className="text-[#5A5248] text-[0.7rem]">→</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.1)] p-5" style={clipWidget}>
                    <WidgetTitle>About Hoyoverse Hub</WidgetTitle>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      {[
                        { label: 'Version',   value: 'v3.2.1' },
                        { label: 'Build',     value: '2025.05' },
                        { label: 'Reports',   value: '1,247'  },
                        { label: 'Members',   value: '8,400+'  },
                      ].map((s, i) => (
                        <div key={i} className="p-3 bg-[rgba(200,169,110,0.03)] border border-[rgba(200,169,110,0.07)]" style={clipBadge}>
                          <div className="font-['Space_Mono',monospace] text-[0.85rem] font-bold text-[#C8A96E]">{s.value}</div>
                          <div className="text-[0.58rem] text-[#5A5248] uppercase tracking-[0.1em] mt-[2px]">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] leading-relaxed mt-4">
                      Hoyoverse Hub is a fan community platform and is not affiliated with miHoYo / Hoyoverse Co., Ltd.
                    </p>
                  </div>
                </div>
              )}

              {/* Sign out & support quick access at bottom */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowSupport(true)}
                  className="flex items-center justify-center gap-2 py-3 border border-[rgba(78,205,196,0.2)] text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.06)] hover:border-[rgba(78,205,196,0.4)] transition-all duration-200 bg-transparent cursor-pointer text-[0.78rem] font-bold font-['Rajdhani',sans-serif] tracking-[0.08em] uppercase"
                  style={clipBtn}
                >
                  <HeadsetIcon /> Customer Service
                </button>
                <button
                  onClick={() => setShowLogout(true)}
                  className="flex items-center justify-center gap-2 py-3 border border-[rgba(224,92,122,0.25)] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.08)] hover:border-[rgba(224,92,122,0.5)] transition-all duration-200 bg-transparent cursor-pointer text-[0.78rem] font-bold font-['Rajdhani',sans-serif] tracking-[0.08em] uppercase"
                  style={clipBtn}
                >
                  <LogoutIcon /> Sign Out
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      <LogoutModal  open={showLogout}  onClose={() => setShowLogout(false)} />
      <SupportModal open={showSupport} onClose={() => setShowSupport(false)} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
      `}</style>
    </div>
  );
}

// ─── ICONS ────────────────────────────────────────────────────────────────────

const GridIcon     = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/></svg>;
const HexIcon      = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>;
const HexDotIcon   = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/></svg>;
const DiamondIcon  = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/></svg>;
const UsersIcon    = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const StarIcon     = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/></svg>;
const PersonIcon   = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const InfoIcon     = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/></svg>;
const BellIcon     = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2 C5.5 2 4 4 4 6.5 L4 10 L2 11 L2 12 L14 12 L14 11 L12 10 L12 6.5 C12 4 10.5 2 8 2Z" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 12.5 C6.5 13.5 7 14 8 14 C9 14 9.5 13.5 9.5 12.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>;
const EyeIcon      = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8 C1 8 3.5 3 8 3 C12.5 3 15 8 15 8 C15 8 12.5 13 8 13 C3.5 13 1 8 1 8Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1"/></svg>;
const ShieldIcon   = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2 L14 4.5 L14 9 C14 12 11 14 8 15 C5 14 2 12 2 9 L2 4.5 Z" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 8 L7 9.5 L10.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const LinkIcon     = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 9.5 C6.8 10.5 8.2 11 9.5 10.3 L12 7.8 C13 6.8 13 5.2 12 4.2 C11 3.2 9.4 3.2 8.4 4.2 L7.2 5.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M10 6.5 C9.2 5.5 7.8 5 6.5 5.7 L4 8.2 C3 9.2 3 10.8 4 11.8 C5 12.8 6.6 12.8 7.6 11.8 L8.8 10.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const LogoutIcon   = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3 L3 3 C2.4 3 2 3.4 2 4 L2 12 C2 12.6 2.4 13 3 13 L6 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M10 5 L14 8 L10 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><line x1="6" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const HeadsetIcon  = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 9 L3 7 C3 4.2 5.2 2 8 2 C10.8 2 13 4.2 13 7 L13 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><rect x="2" y="9" width="2.5" height="4" rx="1" stroke="currentColor" strokeWidth="1.1"/><rect x="11.5" y="9" width="2.5" height="4" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M13 12.5 C13 13.3 12.3 14 11.5 14 L9 14" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>;

// ─── SETTINGS TABS (diletakkan SETELAH semua ikon) ─────────────────────────────

const settingsTabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'account',       label: 'Account',        icon: <PersonIcon /> },
  { id: 'notifications', label: 'Notifications',  icon: <BellIcon /> },
  { id: 'display',       label: 'Display',        icon: <EyeIcon /> },
  { id: 'privacy',       label: 'Privacy',        icon: <ShieldIcon /> },
  { id: 'linked',        label: 'Linked Accounts',icon: <LinkIcon /> },
  { id: 'support',       label: 'Support',        icon: <HeadsetIcon /> },
];