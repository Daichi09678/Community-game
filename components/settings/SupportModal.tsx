'use client';

import { useState } from 'react';
import { GameBadge } from './GameBadge';
import { clipBtn, clipBadge, clipWidget, clipCard } from './clipStyles';

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';
type TicketCategory = 'bug' | 'account' | 'report' | 'suggestion' | 'other';

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

export function SupportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<'choose' | 'ticket' | 'faq' | 'success'>('choose');
  const [category, setCategory] = useState<TicketCategory>('bug');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const categories: { value: TicketCategory; label: string; icon: string; color: string }[] = [
    { value: 'bug', label: 'Bug Report', icon: '🐛', color: '#E05C7A' },
    { value: 'account', label: 'Account Issue', icon: '◉', color: '#C8A96E' },
    { value: 'report', label: 'Content Report', icon: '⬡', color: '#4ECDC4' },
    { value: 'suggestion', label: 'Suggestion', icon: '✦', color: '#A855F7' },
    { value: 'other', label: 'Other', icon: '◈', color: '#9A8F78' },
  ];

  const faqs = [
    { q: 'How do I upload a quest guide?', a: 'Go to All Reports → click "New Report" in the top right. Fill in the quest name, game tag, and content. Your report will be live after a short moderation check.' },
    { q: 'Why is my report pending review?', a: 'New reports are reviewed within 1–3 hours to ensure quality. Reports with spoilers or incorrect tags may take longer.' },
    { q: 'How does the voting system work?', a: 'Users can upvote helpful reports. Votes count toward your total score and leaderboard rank. You earn achievement badges at milestone thresholds.' },
    { q: 'Can I link multiple Hoyoverse accounts?', a: 'Yes — go to Settings → Linked Accounts. You can connect UID accounts for HSR, Genshin, ZZZ and HI3 separately.' },
    { q: 'How do I recover my password?', a: 'Click "Forgot Password" on the login screen. A reset link will be sent to your registered email within 5 minutes.' },
    { q: 'What qualifies as a spoiler tag?', a: 'Any plot revelation within 2 weeks of a patch release should be spoiler-tagged. Use the [SPOILER] label in your report title.' },
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
          {step !== 'choose' && <button onClick={() => setStep('choose')} className="text-[#5A5248] hover:text-[#C8A96E] transition-colors text-[0.85rem] mr-1 bg-transparent border-none cursor-pointer">←</button>}
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
              <div><div className="text-[0.72rem] text-[#6DD18A] font-['Space_Mono',monospace]">All systems operational</div><div className="text-[0.6rem] text-[#5A5248]">Avg response time: ~2 hrs · Last checked 5 min ago</div></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <button onClick={() => setStep('ticket')} className="p-4 border border-[rgba(200,169,110,0.15)] hover:border-[rgba(200,169,110,0.4)] bg-[rgba(200,169,110,0.03)] hover:bg-[rgba(200,169,110,0.06)] transition-all duration-200 text-left bg-transparent cursor-pointer" style={clipWidget}>
                <div className="text-[1.2rem] mb-2">📨</div>
                <div className="font-['Rajdhani',sans-serif] text-[0.85rem] font-bold text-[#E8E0CC]">Submit Ticket</div>
                <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] mt-1">Report a bug or issue directly to our team</div>
              </button>
              <button onClick={() => setStep('faq')} className="p-4 border border-[rgba(200,169,110,0.15)] hover:border-[rgba(200,169,110,0.4)] bg-[rgba(200,169,110,0.03)] hover:bg-[rgba(200,169,110,0.06)] transition-all duration-200 text-left bg-transparent cursor-pointer" style={clipWidget}>
                <div className="text-[1.2rem] mb-2">⬡</div>
                <div className="font-['Rajdhani',sans-serif] text-[0.85rem] font-bold text-[#E8E0CC]">FAQ</div>
                <div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] mt-1">Browse common questions & answers</div>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 border border-[rgba(200,169,110,0.1)] hover:border-[rgba(200,169,110,0.25)] transition-all duration-200 cursor-pointer" style={clipBadge}>
                <span className="text-[1rem]">💬</span>
                <div className="flex-1"><div className="text-[0.78rem] font-semibold text-[#E8E0CC] font-['Rajdhani',sans-serif]">Join Our Discord</div><div className="text-[0.6rem] text-[#5A5248] font-['Space_Mono',monospace]">Real-time help from the community</div></div>
                <span className="text-[#5A5248] text-[0.7rem]">→</span>
              </div>
              <div className="flex items-center gap-3 p-3 border border-[rgba(200,169,110,0.1)] hover:border-[rgba(200,169,110,0.25)] transition-all duration-200 cursor-pointer" style={clipBadge}>
                <span className="text-[1rem]">📧</span>
                <div className="flex-1"><div className="text-[0.78rem] font-semibold text-[#E8E0CC] font-['Rajdhani',sans-serif]">Email Support</div><div className="text-[0.6rem] text-[#5A5248] font-['Space_Mono',monospace]">support@hoyohub.gg</div></div>
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
                  <button key={c.value} onClick={() => setCategory(c.value)} className="flex items-center gap-1 px-3 py-[5px] text-[0.68rem] font-bold font-['Rajdhani',sans-serif] border transition-all duration-200 cursor-pointer bg-transparent"
                    style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)', borderColor: category === c.value ? c.color : 'rgba(200,169,110,0.15)', color: category === c.value ? c.color : '#5A5248', background: category === c.value ? `${c.color}12` : 'transparent' }}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">Subject</div>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief description of your issue…"
                className="w-full bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.2)] text-[#E8E0CC] text-[0.8rem] font-['Space_Mono',monospace] outline-none px-3 py-2 placeholder-[#3A3228] focus:border-[rgba(200,169,110,0.5)] transition-all duration-200" style={clipBadge} />
            </div>

            <div>
              <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">Related Game (optional)</div>
              <div className="flex gap-2 flex-wrap">{(['hsr', 'gi', 'zzz', 'hi3'] as GameKey[]).map(g => <GameBadge key={g} game={g} />)}</div>
            </div>

            <div>
              <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">Message</div>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue in detail. Include steps to reproduce if it's a bug…" rows={5}
                className="w-full bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.2)] text-[#E8E0CC] text-[0.8rem] font-['Space_Mono',monospace] outline-none px-3 py-2 resize-none placeholder-[#3A3228] focus:border-[rgba(200,169,110,0.5)] transition-all duration-200"
                style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }} />
              <div className="text-right text-[0.58rem] text-[#5A5248] font-['Space_Mono',monospace] mt-1">{message.length}/1000</div>
            </div>

            <button onClick={handleSubmit} disabled={!subject.trim() || !message.trim() || sending}
              className="w-full py-[10px] font-['Rajdhani',sans-serif] text-[0.82rem] font-bold tracking-[0.12em] uppercase border-none cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', color: '#050810', ...clipBtn }}>
              {sending ? '◌ Sending...' : '→ Submit Ticket'}
            </button>
          </div>
        )}

        {step === 'faq' && (
          <div className="space-y-2">
            <div className="text-[0.65rem] text-[#5A5248] font-['Space_Mono',monospace] mb-4">Click a question to expand the answer.</div>
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[rgba(200,169,110,0.1)] overflow-hidden transition-all duration-200 hover:border-[rgba(200,169,110,0.25)]" style={clipBadge}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left cursor-pointer bg-transparent border-none">
                  <span className="text-[0.78rem] font-semibold text-[#E8E0CC] font-['Rajdhani',sans-serif] flex-1">{faq.q}</span>
                  <span className="text-[#C8A96E] text-[0.7rem] shrink-0 transition-transform duration-200" style={{ transform: faqOpen === i ? 'rotate(180deg)' : 'none' }}>▾</span>
                </button>
                {faqOpen === i && <div className="px-4 pb-4 text-[0.72rem] text-[#9A8F78] font-['Space_Mono',monospace] leading-relaxed border-t border-[rgba(200,169,110,0.06)]" style={{ paddingTop: '12px' }}>{faq.a}</div>}
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
            <p className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace] leading-relaxed mb-1">Ticket <span className="text-[#C8A96E]">#HH-{Math.floor(Math.random() * 90000) + 10000}</span> has been created.</p>
            <p className="text-[0.68rem] text-[#5A5248] font-['Space_Mono',monospace] leading-relaxed mb-7">Our team will respond to your registered email within 24 hours.</p>
            <button onClick={resetAndClose} className="px-8 py-[10px] font-['Rajdhani',sans-serif] text-[0.82rem] font-bold tracking-[0.12em] uppercase border-none cursor-pointer" style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', color: '#050810', ...clipBtn }}>Close</button>
          </div>
        )}
      </div>
    </Modal>
  );
}