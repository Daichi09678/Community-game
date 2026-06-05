'use client';

import { useState } from 'react';
import { GameBadge } from './GameBadge';
import { clipWidget, clipBadge } from './clipStyles';
import { BubbleIcon, EyeIcon } from './Icons';

type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
type CategoryFilter = 'all' | 'meta' | 'lore' | 'guide' | 'discovery' | 'help' | 'general';

interface Discussion {
  id: number;
  title: string;
  body: string;
  game: string;
  category: string;
  author: string;
  initials: string;
  replies: number;
  likes: number;
  views: number;
  date: string;
  pinned: boolean;
  hot: boolean;
  tags: string[];
}

const categoryMap: Record<string, { label: string; color: string }> = {
  meta:      { label: 'Meta',      color: 'text-[#4ECDC4] border-[rgba(78,205,196,0.3)] bg-[rgba(78,205,196,0.08)]' },
  lore:      { label: 'Lore',      color: 'text-[#C8A96E] border-[rgba(200,169,110,0.3)] bg-[rgba(200,169,110,0.08)]' },
  guide:     { label: 'Guide',     color: 'text-[#6DD18A] border-[rgba(109,209,138,0.3)] bg-[rgba(109,209,138,0.08)]' },
  discovery: { label: 'Discovery', color: 'text-[#F0D080] border-[rgba(240,208,128,0.3)] bg-[rgba(240,208,128,0.08)]' },
  help:      { label: 'Help',      color: 'text-[#A855F7] border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.08)]' },
  general:   { label: 'General',   color: 'text-[#9A8F78] border-[rgba(154,143,120,0.3)] bg-[rgba(154,143,120,0.08)]' },
};

export function DiscussionCard({ disc, accentColor }: { disc: Discussion; accentColor: string }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(disc.likes);
  const cat = categoryMap[disc.category];

  const handleLike = () => {
    setLiked(p => !p);
    setLikeCount(p => liked ? p - 1 : p + 1);
  };

  return (
    <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5 mb-3 relative group transition-all duration-200 hover:border-[rgba(200,169,110,0.3)] hover:bg-[rgba(12,18,32,0.95)]"
      style={clipWidget}>
      {disc.pinned && (
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: accentColor }} />
      )}

      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1 shrink-0 min-w-[42px]">
          <button onClick={handleLike}
            className={`flex flex-col items-center gap-[2px] cursor-pointer transition-all duration-200 border-none bg-transparent p-1
              ${liked ? 'text-[#C8A96E]' : 'text-[#5A5248] hover:text-[#C8A96E]'}`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polygon points="7,1 13,13 1,13" stroke="currentColor" strokeWidth="1.2"
                fill={liked ? 'rgba(200,169,110,0.2)' : 'none'} />
            </svg>
            <span className="font-['Space_Mono',monospace] text-[0.7rem]">{likeCount}</span>
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap mb-2">
            {disc.pinned && (
              <span className="inline-flex items-center px-2 py-[2px] text-[0.55rem] font-bold tracking-[0.1em] uppercase bg-[rgba(200,169,110,0.1)] text-[#C8A96E] border border-[rgba(200,169,110,0.3)] shrink-0"
                style={clipBadge}>📌 Pinned</span>
            )}
            {disc.hot && (
              <span className="inline-flex items-center px-2 py-[2px] text-[0.55rem] font-bold tracking-[0.1em] uppercase bg-[rgba(224,92,122,0.1)] text-[#E05C7A] border border-[rgba(224,92,122,0.3)] shrink-0"
                style={clipBadge}>🔥 Hot</span>
            )}
            <span className={`inline-flex items-center px-2 py-[2px] text-[0.58rem] font-bold tracking-[0.1em] uppercase border shrink-0 ${cat.color}`}
              style={clipBadge}>{cat.label}</span>
          </div>

          <h3 className="font-['Cinzel',serif] text-[0.9rem] font-semibold text-[#E8E0CC] mb-[6px] cursor-pointer leading-[1.4]
            group-hover:text-[#C8A96E] transition-colors duration-200">
            {disc.title}
          </h3>

          <p className="text-[0.8rem] text-[#5A5248] leading-[1.6] mb-3 line-clamp-2">{disc.body}</p>

          <div className="flex flex-wrap gap-[4px] mb-3">
            {disc.tags.map((tag, i) => (
              <span key={i} className="px-[8px] py-[2px] text-[0.62rem] font-semibold bg-[rgba(200,169,110,0.05)] border border-[rgba(200,169,110,0.12)] text-[#5A5248] cursor-pointer hover:text-[#C8A96E] hover:border-[rgba(200,169,110,0.3)] transition-all duration-200"
                style={clipBadge}>
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-[6px]">
                <div className="w-[22px] h-[22px] rounded-full bg-[rgba(200,169,110,0.08)] border border-[#8B6A2E] flex items-center justify-center font-['Cinzel',serif] text-[0.5rem] text-[#C8A96E] font-bold shrink-0">
                  {disc.initials}
                </div>
                <span className="text-[0.75rem] text-[#9A8F78]">{disc.author}</span>
              </div>
              <GameBadge game={disc.game} />
              <span className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">{disc.date}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">
                <BubbleIcon /> {disc.replies} replies
              </span>
              <span className="flex items-center gap-1 text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]">
                <EyeIcon /> {disc.views.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}