'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─── THEME CONSTANTS ────────────────────────────────────────────────────────
const clipHex    = { clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' };
const clipHexSm  = { clipPath: 'polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)' };
const clipBadge  = { clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' };
const clipWidget = { clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ─── DATA ───────────────────────────────────────────────────────────────────
const GAMES = [
  { id: 'hsr', label: 'Honkai: Star Rail', color: '#4ECDC4' },
  { id: 'gi',  label: 'Genshin Impact',    color: '#6DD18A' },
  { id: 'zzz', label: 'Zenless Zone Zero', color: '#A855F7' },
  { id: 'hi3', label: 'Honkai Impact 3rd', color: '#E05C7A' },
];

const CATEGORIES = [
  { id: 'guide',    label: 'Guide',      icon: '📚' },
  { id: 'event',    label: 'Event',      icon: '🎪' },
  { id: 'puzzle',   label: 'Puzzle',     icon: '🧩' },
  { id: 'build',    label: 'Build',      icon: '⚔️' },
];

const SEVERITY = [
  { id: 'low',      label: 'Low',      color: '#6DD18A' },
  { id: 'medium',   label: 'Medium',   color: '#C8A96E' },
  { id: 'high',     label: 'High',     color: '#E05C7A' },
  { id: 'critical', label: 'Critical', color: '#FF3B5C' },
];

// ─── ICONS ──────────────────────────────────────────────────────────────────
const GridIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.2" rx="1"/></svg>);
const HexIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 5V11L8 14L2 11V5L8 2Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1"/></svg>);
const HexDotIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,4 14,12 8,15 2,12 2,4" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>);
const CalendarIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><line x1="1" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="0.8"/></svg>);
const DiamondIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 14,5 14,11 8,15 2,11 2,5" stroke="currentColor" strokeWidth="1.2"/></svg>);
const UsersIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 14 C1 11 4 10 6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 13.5 C8.5 11.5 10 11 11 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const StarIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polygon points="8,1 10,6 15,6 11,9 12.5,14 8,11 3.5,14 5,9 1,6 6,6" stroke="currentColor" strokeWidth="1.2"/></svg>);
const PersonIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14 C2 11 4.5 9.5 8 9.5 C11.5 9.5 14 11 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const InfoIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/></svg>);
const TagIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2h6l6 6-6 6-6-6V2z" stroke="currentColor" strokeWidth="1.2"/><circle cx="5" cy="5" r="1" fill="currentColor"/></svg>);
const WriteIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12L10 4L13 7L5 15H2V12Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><line x1="8" y1="6" x2="11" y2="9" stroke="currentColor" strokeWidth="1.2"/></svg>);
const ImageIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="5.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1"/><path d="M1 11L5 7.5L8 10.5L11 8L15 12" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>);
const AttachIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 7L7 13C5.3 14.7 2.7 14.7 1 13 C-0.7 11.3 -0.7 8.7 1 7L8 0C9.1 -1.1 10.9 -1.1 12 0 C13.1 1.1 13.1 2.9 12 4L5 11C4.4 11.6 3.6 11.6 3 11 C2.4 10.4 2.4 9.6 3 9L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>);
const EyeIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/></svg>);
const SendIcon = () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2L2 7L7 9L9 14L14 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><line x1="7" y1="9" x2="14" y2="2" stroke="currentColor" strokeWidth="1.2"/></svg>);
const XIcon = () => (<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>);
const CheckIcon = () => (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polyline points="2,7 6,11 12,3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);

// ─── STEP INDICATOR ─────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  const steps = [
    { label: 'Basic Info' },
    { label: 'Content' },
    { label: 'Media' },
    { label: 'Review' },
  ];
  return (
    <div className="flex items-center gap-0 mb-10">
      {steps.map((s, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 flex items-center justify-center font-['Space_Mono',monospace] text-[0.7rem] font-bold transition-all duration-300"
                style={{
                  ...clipWidget,
                  background: done ? 'rgba(200,169,110,0.2)' : active ? 'rgba(200,169,110,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${done ? '#C8A96E' : active ? 'rgba(200,169,110,0.5)' : 'rgba(200,169,110,0.1)'}`,
                  color: done ? '#C8A96E' : active ? '#E8E0CC' : '#5A5248',
                }}
              >
                {done ? <CheckIcon /> : idx}
              </div>
              <span className={`text-[0.6rem] tracking-[0.08em] uppercase font-bold font-['Rajdhani',sans-serif] ${active ? 'text-[#C8A96E]' : done ? 'text-[#9A8F78]' : 'text-[#5A5248]'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-[1px] mx-2 mb-5" style={{
                background: done ? 'linear-gradient(90deg, #C8A96E60, #C8A96E30)' : 'rgba(200,169,110,0.1)'
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── TAG INPUT ──────────────────────────────────────────────────────────────
function TagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState('');

  const add = () => {
    const val = input.trim().replace(/\s+/g, '-');
    if (val && !tags.includes(val) && tags.length < 8) {
      onChange([...tags, val]);
      setInput('');
    }
  };

  const remove = (t: string) => onChange(tags.filter(x => x !== t));

  return (
    <div>
      <div className="flex gap-2 mb-3 flex-wrap">
        {tags.map(t => (
          <span
            key={t}
            className="inline-flex items-center gap-1 px-2 py-[3px] text-[0.68rem] font-bold font-['Rajdhani',sans-serif] tracking-[0.06em] border border-[rgba(200,169,110,0.3)] bg-[rgba(200,169,110,0.08)] text-[#C8A96E]"
            style={clipBadge}
          >
            #{t}
            <button onClick={() => remove(t)} className="ml-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-none text-[#C8A96E]">
              <XIcon />
            </button>
          </span>
        ))}
        {tags.length === 0 && (
          <span className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">No tags yet...</span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add tag (max 8)..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          className="flex-1 bg-[#070C18] border border-[rgba(200,169,110,0.15)] text-[0.8rem] text-[#E8E0CC] placeholder-[#3A3028] px-3 py-[7px] focus:outline-none focus:border-[rgba(200,169,110,0.4)] transition-colors font-['Space_Mono',monospace]"
          style={clipHexSm}
          disabled={tags.length >= 8}
        />
        <button
          onClick={add}
          disabled={tags.length >= 8 || !input.trim()}
          className="px-4 py-[7px] text-[0.72rem] font-bold tracking-[0.08em] uppercase border border-[rgba(200,169,110,0.25)] text-[#9A8F78] hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.4)] transition-all cursor-pointer font-['Rajdhani',sans-serif] disabled:opacity-30 disabled:cursor-not-allowed bg-transparent"
          style={clipHexSm}
        >
          + Add
        </button>
      </div>
      <div className="mt-1 text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">{tags.length}/8 tags</div>
    </div>
  );
}

// ─── RICH TEXT TOOLBAR ──────────────────────────────────────────────────────
function EditorToolbar({ onFormat }: { onFormat: (cmd: string, val?: string) => void }) {
  const tools = [
    { icon: 'B', cmd: 'bold',          title: 'Bold',          style: { fontWeight: 'bold' } },
    { icon: 'I', cmd: 'italic',        title: 'Italic',        style: { fontStyle: 'italic' } },
    { icon: 'U', cmd: 'underline',     title: 'Underline',     style: { textDecoration: 'underline' } },
    { icon: 'S', cmd: 'strikeThrough', title: 'Strikethrough', style: { textDecoration: 'line-through' } },
  ];
  const lists = [
    { icon: '≡', cmd: 'insertUnorderedList', title: 'Bullet List' },
    { icon: '#', cmd: 'insertOrderedList',   title: 'Numbered List' },
  ];
  const headings = ['H1', 'H2', 'H3'];

  return (
    <div
      className="flex items-center gap-1 flex-wrap px-3 py-2 border-b border-[rgba(200,169,110,0.12)]"
      style={{ background: 'rgba(5,8,16,0.6)' }}
    >
      {tools.map(t => (
        <button
          key={t.cmd}
          title={t.title}
          onMouseDown={e => { e.preventDefault(); onFormat(t.cmd); }}
          className="w-7 h-7 flex items-center justify-center text-[0.75rem] text-[#9A8F78] hover:text-[#C8A96E] hover:bg-[rgba(200,169,110,0.08)] transition-all cursor-pointer border-none bg-transparent font-['Rajdhani',sans-serif]"
          style={{ ...clipHexSm, ...t.style }}
        >
          {t.icon}
        </button>
      ))}
      <div className="w-[1px] h-4 bg-[rgba(200,169,110,0.15)] mx-1" />
      {headings.map((h, i) => (
        <button
          key={h}
          title={h}
          onMouseDown={e => { e.preventDefault(); onFormat('formatBlock', `h${i + 1}`); }}
          className="px-2 h-7 flex items-center justify-center text-[0.65rem] font-bold text-[#9A8F78] hover:text-[#C8A96E] hover:bg-[rgba(200,169,110,0.08)] transition-all cursor-pointer border-none bg-transparent font-['Rajdhani',sans-serif] tracking-[0.04em]"
          style={clipHexSm}
        >
          {h}
        </button>
      ))}
      <div className="w-[1px] h-4 bg-[rgba(200,169,110,0.15)] mx-1" />
      {lists.map(l => (
        <button
          key={l.cmd}
          title={l.title}
          onMouseDown={e => { e.preventDefault(); onFormat(l.cmd); }}
          className="w-7 h-7 flex items-center justify-center text-[0.75rem] text-[#9A8F78] hover:text-[#C8A96E] hover:bg-[rgba(200,169,110,0.08)] transition-all cursor-pointer border-none bg-transparent font-['Space_Mono',monospace]"
          style={clipHexSm}
        >
          {l.icon}
        </button>
      ))}
      <div className="w-[1px] h-4 bg-[rgba(200,169,110,0.15)] mx-1" />
      <button
        title="Block Quote"
        onMouseDown={e => { e.preventDefault(); onFormat('formatBlock', 'blockquote'); }}
        className="px-2 h-7 flex items-center justify-center text-[0.65rem] text-[#9A8F78] hover:text-[#C8A96E] hover:bg-[rgba(200,169,110,0.08)] transition-all cursor-pointer border-none bg-transparent font-['Space_Mono',monospace]"
        style={clipHexSm}
      >
        ❝
      </button>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function WriteReportPage() {
  const router = useRouter();
  const [step, setStep]           = useState(1);
  const [title, setTitle]         = useState('');
  const [game, setGame]           = useState('');
  const [category, setCategory]   = useState('');
  const [severity, setSeverity]   = useState('medium');
  const [tags, setTags]           = useState<string[]>([]);
  const [summary, setSummary]     = useState('');
  const [charCount, setCharCount] = useState(0);
  const [images, setImages]       = useState<{ name: string; size: string; preview?: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState(''); // 🔥 TAMBAH STATE USERNAME
  const [content, setContent] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  // 🔥 AMBIL USER DATA
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: 'include',
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUserId(userData.id);
          setUsername(userData.username); // 🔥 SET USERNAME
          localStorage.setItem('user', JSON.stringify({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            rank: userData.rank || 'Novice Omni-Voyager',
            level: userData.level || 1,
            xp: userData.xp || 0,
            initials: userData.initials || (userData.username?.slice(0, 2).toUpperCase() || 'TB'),
            totalReports: userData.totalReports || 0
          }));
          console.log('User loaded:', userData.username);
        } else {
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            const user = JSON.parse(savedUser);
            setUserId(user.id);
            setUsername(user.username);
            console.log('User from localStorage:', user.username);
          } else {
            router.push('/Sign-in');
          }
        }
      } catch (error) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setUserId(user.id);
          setUsername(user.username);
        } else {
          router.push('/Sign-in');
        }
      }
    };
    
    getCurrentUser();
  }, [router]);

  // 🔥 FUNGSI UPDATE CONTENT DARI EDITOR
  const updateContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      console.log('Content updated, length:', newContent.length);
    }
  };

  // 🔥 AUTO-SAVE CONTENT SETIAP 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      if (editorRef.current && document.activeElement === editorRef.current) {
        updateContent();
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleFormat = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    setTimeout(updateContent, 10);
  };

  const handleNext = () => {
    if (step === 1 && !step1Valid) {
      alert('Please complete all required fields in Basic Info');
      return;
    }
    if (step === 2) {
      updateContent(); // 🔥 SAVE CONTENT SEBELUM NEXT
      if (!step2Valid) {
        alert('Please fill in summary and content (min 20 characters each)');
        return;
      }
    }
    setStep(s => Math.min(4, s + 1));
  };

  const handlePrev = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.slice(0, 5 - images.length).map(f => ({
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
    }));
    setImages(prev => [...prev, ...mapped].slice(0, 5));
  };

  const step1Valid = title.trim().length >= 5 && game && category;
  const step2Valid = summary.trim().length >= 20 && content.trim().length >= 20;
  const step4Valid = step1Valid && step2Valid;

  const handleSubmitReport = async () => {
    updateContent(); // 🔥 SAVE CONTENT SEBELUM SUBMIT
    const currentContent = content;
    
    console.log('Submitting report with content length:', currentContent.length);
    
    if (!title.trim() || !game || !category || !summary.trim() || !currentContent.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!userId) {
      alert('Please log in first');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          type: category,
          game: game,
          content: currentContent,
          userId: userId,
          severity: severity,
          version: '1.0',
          tags: tags.map(t => `#${t}`),
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          userData.totalReports = (userData.totalReports || 0) + 1;
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        setSubmitted(true);
        setTimeout(() => {
          router.push('/UserHoyo/all-report');
        }, 3000);
      } else {
        alert(result.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('An error occurred while submitting the report');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
        <div className="fixed inset-0 pointer-events-none z-0" style={{ background: `radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)` }} />
        <main className="flex-1 flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center max-w-md px-8">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.3)', ...clipWidget }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <polyline points="5,16 13,24 27,8" stroke="#C8A96E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="font-['Cinzel',serif] text-[0.7rem] tracking-[0.25em] uppercase text-[#C8A96E] mb-3">Report Submitted</div>
            <h1 className="font-['Cinzel',serif] text-[1.8rem] font-bold text-[#E8E0CC] mb-3">Success!</h1>
            <p className="text-[0.9rem] text-[#9A8F78] mb-2">Your report has been received and will appear on the All Reports page shortly.</p>
            <div className="font-['Space_Mono',monospace] text-[0.72rem] text-[#5A5248] mb-8">ID: <span className="text-[#4ECDC4]">#RPT-{Math.floor(Math.random() * 90000) + 10000}</span></div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setSubmitted(false); setStep(1); setTitle(''); setGame(''); setCategory(''); setSeverity('medium'); setTags([]); setSummary(''); setImages([]); setContent(''); if (editorRef.current) editorRef.current.innerHTML = ''; }}
                className="px-5 py-2 text-[0.8rem] font-bold tracking-[0.08em] uppercase border border-[rgba(200,169,110,0.3)] text-[#9A8F78] hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.5)] transition-all cursor-pointer font-['Rajdhani',sans-serif] bg-transparent"
                style={clipHexSm}>
                Write Again
              </button>
              <Link href="/UserHoyo/all-report"
                className="px-5 py-2 text-[0.8rem] font-bold tracking-[0.08em] uppercase bg-[rgba(200,169,110,0.12)] border border-[#C8A96E] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.2)] transition-all font-['Rajdhani',sans-serif] no-underline"
                style={clipHexSm}>
                View All Reports
              </Link>
            </div>
          </div>
        </main>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');`}</style>
      </div>
    );
  }

  const selectedGame     = GAMES.find(g => g.id === game);
  const selectedCategory = CATEGORIES.find(c => c.id === category);
  const selectedSeverity = SEVERITY.find(s => s.id === severity);

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: `radial-gradient(ellipse 60% 50% at 80% 20%, rgba(123,79,166,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 10% 80%, rgba(78,205,196,0.04) 0%, transparent 50%)` }} />

      <main className="flex-1 flex flex-col min-h-screen relative z-10">

        {/* TOPBAR */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.8)' }}>
          <div className="flex items-center gap-3">
            <Link href="/UserHoyo/dashboard" className="text-[#5A5248] hover:text-[#C8A96E] transition-colors text-[0.8rem] font-['Space_Mono',monospace]">Home</Link>
            <span className="text-[#5A5248]">/</span>
            <span className="text-[#C8A96E] text-[0.8rem] font-['Space_Mono',monospace]">Write Report</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">Step {step}/4</span>
            <div className="flex gap-[3px]">
              {[1,2,3,4].map(s => (
                <div key={s} className="w-6 h-[3px] transition-all duration-300"
                  style={{ background: s <= step ? '#C8A96E' : 'rgba(200,169,110,0.15)', ...clipBadge }} />
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 flex-1 max-w-[700px] mx-auto w-full">

          {/* PAGE HEADER */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-[6px] px-2 py-[3px] text-[0.62rem] font-bold tracking-[0.12em] uppercase bg-[rgba(200,169,110,0.08)] text-[#C8A96E] border border-[rgba(200,169,110,0.2)]" style={clipBadge}>
                <WriteIcon /> Create Report
              </span>
            </div>
            <h1 className="font-['Cinzel',serif] text-[2rem] font-bold text-[#E8E0CC] leading-tight mb-2">Write Report</h1>
            <p className="text-[0.9rem] text-[#9A8F78]">Share your findings, guides, or experiences with the Hoyoverse community.</p>
          </div>

          <StepIndicator current={step} total={4} />

          {/* ── STEP 1: BASIC INFO ── */}
          {step === 1 && (
            <div className="space-y-6 animate-fadein">
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.12)] p-6" style={clipWidget}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-[3px] h-[14px] bg-[#C8A96E]" />
                  <span className="font-['Cinzel',serif] text-[0.85rem] font-bold text-[#E8E0CC] tracking-[0.06em]">Report Title</span>
                  <span className="text-[#E05C7A] text-[0.7rem]">*</span>
                </div>
                <input
                  type="text"
                  placeholder="Write a clear and descriptive title..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={120}
                  className="w-full bg-[#070C18] border border-[rgba(200,169,110,0.15)] text-[0.95rem] text-[#E8E0CC] placeholder-[#3A3028] px-4 py-3 focus:outline-none focus:border-[rgba(200,169,110,0.4)] transition-colors font-['Rajdhani',sans-serif] font-semibold"
                  style={clipHexSm}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">
                    {title.length < 5 && title.length > 0 && <span className="text-[#E05C7A]">Min. 5 characters</span>}
                  </span>
                  <span className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">{title.length}/120</span>
                </div>
              </div>

              {/* GAME SELECTION */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.12)] p-6" style={clipWidget}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-[3px] h-[14px] bg-[#C8A96E]" />
                  <span className="font-['Cinzel',serif] text-[0.85rem] font-bold text-[#E8E0CC] tracking-[0.06em]">Game</span>
                  <span className="text-[#E05C7A] text-[0.7rem]">*</span>
                </div>
                <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                  {GAMES.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setGame(g.id)}
                      className="flex items-center gap-3 px-4 py-3 border transition-all duration-200 cursor-pointer text-left"
                      style={{
                        ...clipHexSm,
                        borderColor: game === g.id ? g.color : 'rgba(200,169,110,0.12)',
                        background: game === g.id ? `${g.color}0E` : '#070C18',
                      }}
                    >
                      <div className="w-2 h-8 shrink-0" style={{ background: game === g.id ? g.color : 'rgba(200,169,110,0.15)', ...clipBadge }} />
                      <div>
                        <div className="font-['Rajdhani',sans-serif] font-bold text-[0.88rem]" style={{ color: game === g.id ? g.color : '#9A8F78' }}>
                          {g.label}
                        </div>
                        <div className="text-[0.62rem] font-['Space_Mono',monospace]" style={{ color: game === g.id ? `${g.color}80` : '#3A3028' }}>
                          {g.id.toUpperCase()}
                        </div>
                      </div>
                      {game === g.id && (
                        <div className="ml-auto" style={{ color: g.color }}><CheckIcon /></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* CATEGORY */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.12)] p-6" style={clipWidget}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-[3px] h-[14px] bg-[#C8A96E]" />
                  <span className="font-['Cinzel',serif] text-[0.85rem] font-bold text-[#E8E0CC] tracking-[0.06em]">Category</span>
                  <span className="text-[#E05C7A] text-[0.7rem]">*</span>
                </div>
                <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className="flex items-center gap-3 px-4 py-3 border transition-all duration-200 cursor-pointer text-left"
                      style={{
                        ...clipHexSm,
                        borderColor: category === c.id ? '#C8A96E' : 'rgba(200,169,110,0.12)',
                        background: category === c.id ? 'rgba(200,169,110,0.1)' : '#070C18',
                      }}
                    >
                      <span className="text-[1.2rem]">{c.icon}</span>
                      <div>
                        <div className="font-['Rajdhani',sans-serif] font-bold text-[0.88rem]" style={{ color: category === c.id ? '#C8A96E' : '#9A8F78' }}>
                          {c.label}
                        </div>
                      </div>
                      {category === c.id && (
                        <div className="ml-auto" style={{ color: '#C8A96E' }}><CheckIcon /></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* TAGS */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.12)] p-6" style={clipWidget}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-[3px] h-[14px] bg-[#C8A96E]" />
                  <span className="font-['Cinzel',serif] text-[0.85rem] font-bold text-[#E8E0CC] tracking-[0.06em]">Tags</span>
                  <span className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] ml-auto">Optional</span>
                </div>
                <TagInput tags={tags} onChange={setTags} />
              </div>
            </div>
          )}

          {/* ── STEP 2: CONTENT ── */}
          {step === 2 && (
            <div className="space-y-6 animate-fadein">
              {/* SUMMARY */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.12)] p-6" style={clipWidget}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-[3px] h-[14px] bg-[#C8A96E]" />
                  <span className="font-['Cinzel',serif] text-[0.85rem] font-bold text-[#E8E0CC] tracking-[0.06em]">Summary</span>
                  <span className="text-[#E05C7A] text-[0.7rem]">*</span>
                </div>
                <textarea
                  placeholder="Write a brief summary of your report (will appear in card preview)..."
                  value={summary}
                  onChange={e => { setSummary(e.target.value); setCharCount(e.target.value.length); }}
                  maxLength={280}
                  rows={3}
                  className="w-full bg-[#070C18] border border-[rgba(200,169,110,0.15)] text-[0.85rem] text-[#E8E0CC] placeholder-[#3A3028] px-4 py-3 focus:outline-none focus:border-[rgba(200,169,110,0.4)] transition-colors font-['Rajdhani',sans-serif] resize-none"
                  style={clipHexSm}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">
                    {summary.length < 20 && summary.length > 0 && <span className="text-[#E05C7A]">Min. 20 characters</span>}
                  </span>
                  <span className="text-[0.62rem] font-['Space_Mono',monospace]" style={{ color: charCount > 250 ? '#E05C7A' : '#5A5248' }}>{charCount}/280</span>
                </div>
              </div>

              {/* RICH EDITOR */}
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.12)] overflow-hidden" style={clipWidget}>
                <div className="px-6 pt-6 pb-3 border-b border-[rgba(200,169,110,0.1)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-[3px] h-[14px] bg-[#C8A96E]" />
                      <span className="font-['Cinzel',serif] text-[0.85rem] font-bold text-[#E8E0CC] tracking-[0.06em]">Report Content</span>
                      <span className="text-[#E05C7A] text-[0.7rem]">*</span>
                    </div>
                    <button
                      onClick={() => setIsPreview(p => !p)}
                      className="flex items-center gap-2 px-3 py-[5px] text-[0.7rem] font-bold tracking-[0.06em] uppercase border transition-all cursor-pointer font-['Rajdhani',sans-serif]"
                      style={{
                        ...clipHexSm,
                        borderColor: isPreview ? 'rgba(200,169,110,0.4)' : 'rgba(200,169,110,0.15)',
                        color: isPreview ? '#C8A96E' : '#5A5248',
                        background: isPreview ? 'rgba(200,169,110,0.08)' : 'transparent',
                      }}
                    >
                      <EyeIcon /> {isPreview ? 'Edit' : 'Preview'}
                    </button>
                  </div>
                </div>

                {!isPreview && <EditorToolbar onFormat={handleFormat} />}

                {isPreview ? (
                  <div
                    className="px-6 py-5 min-h-[280px] prose-custom text-[0.9rem] text-[#C8C0B0] leading-relaxed font-['Rajdhani',sans-serif]"
                    dangerouslySetInnerHTML={{ __html: content || '<p class="text-[#3A3028]">No content yet...</p>' }}
                  />
                ) : (
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={updateContent}
                    onKeyUp={updateContent}
                    onBlur={updateContent}
                    data-placeholder="Write the full report here. Describe your guide, strategy, or experience..."
                    className="px-6 py-5 min-h-[280px] focus:outline-none text-[0.9rem] text-[#C8C0B0] leading-relaxed font-['Rajdhani',sans-serif] editor-area"
                    style={{ caretColor: '#C8A96E' }}
                  />
                )}
                <div className="px-6 py-3 border-t border-[rgba(200,169,110,0.08)] flex justify-between">
                  <span className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace]">Supported formats: Bold, Italic, List, Quote</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: MEDIA ── */}
          {step === 3 && (
            <div className="space-y-6 animate-fadein">
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.12)] p-6" style={clipWidget}>
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-[3px] h-[14px] bg-[#C8A96E]" />
                  <span className="font-['Cinzel',serif] text-[0.85rem] font-bold text-[#E8E0CC] tracking-[0.06em]">Screenshot / Evidence</span>
                  <span className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] ml-auto">Optional · Max 5 files</span>
                </div>

                <div
                  onClick={() => fileRef.current?.click()}
                  className="border border-dashed border-[rgba(200,169,110,0.2)] hover:border-[rgba(200,169,110,0.4)] transition-all cursor-pointer p-10 flex flex-col items-center justify-center gap-3 mb-5"
                  style={{ background: 'rgba(200,169,110,0.02)', ...clipWidget }}
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-[rgba(200,169,110,0.2)]" style={{ ...clipWidget, background: 'rgba(200,169,110,0.06)', color: '#C8A96E' }}>
                    <ImageIcon />
                  </div>
                  <div className="text-center">
                    <div className="font-['Rajdhani',sans-serif] font-bold text-[0.9rem] text-[#9A8F78] mb-1">Click or drag & drop files</div>
                    <div className="font-['Space_Mono',monospace] text-[0.65rem] text-[#5A5248]">PNG, JPG, GIF · Max 10MB per file</div>
                  </div>
                  <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 max-[600px]:grid-cols-2">
                    {images.map((img, i) => (
                      <div key={i} className="relative group border border-[rgba(200,169,110,0.12)] overflow-hidden" style={clipHexSm}>
                        {img.preview ? (
                          <img src={img.preview} alt={img.name} className="w-full h-24 object-cover" />
                        ) : (
                          <div className="w-full h-24 flex items-center justify-center bg-[#070C18]">
                            <AttachIcon />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-[rgba(5,8,16,0.7)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                            className="w-8 h-8 flex items-center justify-center bg-[rgba(224,92,122,0.2)] border border-[rgba(224,92,122,0.3)] text-[#E05C7A] cursor-pointer"
                            style={clipWidget}
                          >
                            <XIcon />
                          </button>
                        </div>
                        <div className="px-2 py-1 bg-[#070C18] border-t border-[rgba(200,169,110,0.08)]">
                          <div className="font-['Space_Mono',monospace] text-[0.6rem] text-[#9A8F78] truncate">{img.name}</div>
                          <div className="font-['Space_Mono',monospace] text-[0.58rem] text-[#5A5248]">{img.size}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {images.length === 0 && (
                  <div className="text-center py-4">
                    <span className="font-['Space_Mono',monospace] text-[0.72rem] text-[#5A5248]">No files uploaded yet. Screenshots are very helpful!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 4: REVIEW ── */}
          {step === 4 && (
            <div className="space-y-5 animate-fadein">
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.12)] p-6" style={clipWidget}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-[3px] h-[14px] bg-[#C8A96E]" />
                  <span className="font-['Cinzel',serif] text-[0.85rem] font-bold text-[#E8E0CC] tracking-[0.06em]">Report Preview</span>
                </div>

                <div className="border border-[rgba(200,169,110,0.15)] p-5 mb-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0F1A, #080C16)', ...clipWidget }}>
                  {selectedGame && (
                    <div className="absolute top-0 left-0 w-[2px] h-full" style={{ background: `linear-gradient(180deg, ${selectedGame.color}, transparent)` }} />
                  )}
                  <div className="pl-3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {selectedCategory && (
                        <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-[3px]" style={{ background: 'rgba(200,169,110,0.08)', color: '#C8A96E', border: '1px solid rgba(200,169,110,0.2)', ...clipBadge }}>
                          {selectedCategory.icon} {selectedCategory.label}
                        </span>
                      )}
                      {selectedGame && (
                        <span className="text-[0.6rem] font-bold tracking-[0.1em] uppercase px-2 py-[3px]" style={{ background: `${selectedGame.color}10`, color: selectedGame.color, border: `1px solid ${selectedGame.color}30`, ...clipBadge }}>
                          {selectedGame.label}
                        </span>
                      )}
                    </div>
                    <h3 className="font-['Cinzel',serif] text-[1.05rem] font-bold text-[#E8E0CC] mb-2 leading-tight">
                      {title || <span className="text-[#3A3028]">Report title...</span>}
                    </h3>
                    <p className="text-[0.82rem] text-[#9A8F78] leading-relaxed mb-3 font-['Rajdhani',sans-serif]">
                      {summary || <span className="text-[#3A3028]">Report summary...</span>}
                    </p>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tags.map(t => (
                          <span key={t} className="text-[0.62rem] font-bold px-2 py-[2px] font-['Space_Mono',monospace]" style={{ background: 'rgba(200,169,110,0.06)', color: '#C8A96E80', border: '1px solid rgba(200,169,110,0.12)', ...clipBadge }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-[0.68rem] text-[#5A5248] font-['Space_Mono',monospace]">
                      <span>{username || 'Traveler'}</span>
                      <span>·</span>
                      <span>Just now</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { label: 'Title filled', ok: title.length >= 5 },
                    { label: 'Game selected', ok: !!game },
                    { label: 'Category selected', ok: !!category },
                    { label: 'Summary filled', ok: summary.length >= 20 },
                    { label: 'Content filled', ok: content.trim().length >= 20 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2 border" style={{
                      ...clipHexSm,
                      borderColor: item.ok ? 'rgba(109,209,138,0.2)' : 'rgba(224,92,122,0.15)',
                      background: item.ok ? 'rgba(109,209,138,0.04)' : 'rgba(224,92,122,0.04)',
                    }}>
                      <div className="w-5 h-5 flex items-center justify-center shrink-0" style={{ color: item.ok ? '#6DD18A' : '#E05C7A' }}>
                        {item.ok ? <CheckIcon /> : <XIcon />}
                      </div>
                      <span className="font-['Rajdhani',sans-serif] text-[0.82rem] font-semibold" style={{ color: item.ok ? '#9A8F78' : '#E05C7A80' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NAV BUTTONS */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[rgba(200,169,110,0.1)]">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-[9px] text-[0.8rem] font-bold tracking-[0.08em] uppercase border border-[rgba(200,169,110,0.2)] text-[#9A8F78] hover:text-[#E8E0CC] hover:border-[rgba(200,169,110,0.35)] transition-all cursor-pointer font-['Rajdhani',sans-serif] disabled:opacity-30 disabled:cursor-not-allowed bg-transparent"
              style={clipHexSm}
            >
              ← Back
            </button>

            <div className="flex gap-2">
              {step < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={step === 1 ? !step1Valid : step === 2 ? !step2Valid : false}
                  className="flex items-center gap-2 px-6 py-[9px] text-[0.8rem] font-bold tracking-[0.08em] uppercase border transition-all cursor-pointer font-['Rajdhani',sans-serif] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    ...clipHexSm,
                    background: 'rgba(200,169,110,0.12)',
                    borderColor: '#C8A96E',
                    color: '#C8A96E',
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmitReport}
                  disabled={submitting || !step4Valid}
                  className="flex items-center gap-2 px-6 py-[9px] text-[0.8rem] font-bold tracking-[0.08em] uppercase border transition-all cursor-pointer font-['Rajdhani',sans-serif] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    ...clipHexSm,
                    background: submitting ? 'rgba(200,169,110,0.08)' : 'rgba(200,169,110,0.15)',
                    borderColor: '#C8A96E',
                    color: '#C8A96E',
                  }}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <SendIcon /> Submit Report
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
        @keyframes fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadein { animation: fadein 0.25s ease forwards; }
        .editor-area:empty::before {
          content: attr(data-placeholder);
          color: #3A3028;
          pointer-events: none;
        }
        .editor-area h1 { font-family: 'Cinzel', serif; font-size: 1.3rem; font-weight: 700; color: #E8E0CC; margin-bottom: 0.5rem; }
        .editor-area h2 { font-family: 'Cinzel', serif; font-size: 1.1rem; font-weight: 700; color: #C8A96E; margin-bottom: 0.4rem; }
        .editor-area h3 { font-family: 'Rajdhani', sans-serif; font-size: 1rem; font-weight: 700; color: #9A8F78; margin-bottom: 0.3rem; }
        .editor-area ul { list-style: none; padding-left: 1rem; }
        .editor-area ul li::before { content: '·'; color: #C8A96E; margin-right: 0.5rem; }
        .editor-area ol { padding-left: 1.5rem; color: #9A8F78; }
        .editor-area blockquote { border-left: 2px solid #C8A96E; padding-left: 1rem; color: #9A8F78; font-style: italic; margin: 0.5rem 0; }
        .editor-area b, .editor-area strong { color: #E8E0CC; }
        .editor-area p { margin-bottom: 0.5rem; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}