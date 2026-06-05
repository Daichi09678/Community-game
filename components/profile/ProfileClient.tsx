'use client';

import { useState, useEffect } from 'react';
import {
  NavGroupLabel,
  NavBadge,
  NavItem,
} from './NavItem';
import {
  GridIcon,
  HexIcon,
  HexDotIcon,
  CalendarIcon,
  DiamondIcon,
  UsersIcon,
  StarIcon,
  PersonIcon,
  InfoIcon,
} from './Icons';
import { AvatarEditor } from './AvatarEditor';
import { ProfileBanner, bgOptions } from './ProfileBanner';
import { EditableText } from './EditableText';
import { FavoriteGameSelector } from './FavoriteGameSelector';
import { ReportRow } from './ReportRow';
import { BgPicker } from './BgPicker';
import { GameBadge, gameBadgeMap } from './GameBadge';
import { clipCard, clipBadge, clipWidget, clipBtn, clipHexSm } from './clipStyles';
import { LoadingAnimation } from '@/components/ui';

type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';

// Achievements data
const achievements = [
  { id: 'A001', icon: '⬡', label: 'Trailblazer',   desc: 'Posted 10+ reports',      unlocked: true,  game: 'hsr' as GameKey },
  { id: 'A002', icon: '★', label: 'Star Witness',   desc: 'Received 1000 total votes', unlocked: true, game: 'gi' as GameKey },
  { id: 'A003', icon: '◈', label: 'Lore Keeper',    desc: 'Tagged 50+ quests',       unlocked: true,  game: 'hsr' as GameKey },
  { id: 'A004', icon: '⬟', label: 'Hollow Diver',   desc: 'ZZZ guide master',        unlocked: true,  game: 'zzz' as GameKey },
  { id: 'A005', icon: '✦', label: 'Archon\'s Eye',  desc: '500+ upvotes on one post',unlocked: false, game: 'gi' as GameKey },
  { id: 'A006', icon: '◉', label: 'Signal Hunter',  desc: 'Find 5 hidden quests',    unlocked: false, game: 'zzz' as GameKey },
];

// Recent reports data
const recentReports = [
  { id: 'MQ001', title: 'Where the Stairway Leads', game: 'hsr', votes: 521, type: 'Main Quest',    date: '2h ago',  status: 'complete' },
  { id: 'MQ005', title: 'Chasca Hangout — Winds of the Past', game: 'gi', votes: 298, type: 'Hangout', date: '1h ago', status: 'complete' },
  { id: 'SM003', title: 'Hollow Zero — District 7 Secret', game: 'zzz', votes: 334, type: 'Side Mission', date: '2h ago', status: 'complete' },
  { id: 'MQ003', title: 'Robin & The Harmony of Stars', game: 'hsr', votes: 489, type: 'Companion', date: '4h ago', status: 'complete' },
  { id: 'SM007', title: 'Xianzhou Rare Monster Hunt Chain', game: 'hsr', votes: 221, type: 'Exploration', date: '5h ago', status: 'complete' },
];

// Game stats data
const gameStats: { game: GameKey; label: string; reports: number; votes: number }[] = [
  { game: 'hsr', label: 'Honkai: Star Rail', reports: 24, votes: 1631 },
  { game: 'gi',  label: 'Genshin Impact',    reports: 14, votes: 852  },
  { game: 'zzz', label: 'Zenless Zone Zero', reports: 8,  votes: 477  },
  { game: 'hi3', label: 'Honkai Impact 3rd', reports: 2,  votes: 92   },
];

export function ProfileClient() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bgId, setBgId] = useState('default');
  const [initials, setInitials] = useState('TB');
  const [avatarColor, setAvatarColor] = useState('#C8A96E');
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(null);
  const [username, setUsername] = useState('Trailblazer_01');
  const [title, setTitle] = useState('Astral Chronicler');
  const [bio, setBio] = useState('Dedicated lore hunter across the cosmos and Teyvat alike. Main: Honkai Star Rail & Genshin. I write detailed quest guides so no Trailblazer gets lost.');
  const [location, setLocation] = useState('Xianzhou Luofu, Cloud Sea');
  const [favGames, setFavGames] = useState<GameKey[]>(['hsr', 'gi']);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const totalVotes = gameStats.reduce((a, s) => a + s.votes, 0);
  const totalReports = gameStats.reduce((a, s) => a + s.reports, 0);
  const maxReports = Math.max(...gameStats.map(s => s.reports));
  const currentBg = bgOptions.find(b => b.id === bgId) || bgOptions[0];

  if (loading) {
    return <LoadingAnimation message="LOADING PROFILE..." />;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden" style={{ background: '#050810', color: '#E8E0CC', fontFamily: "'Rajdhani', sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0 transition-all duration-700" style={currentBg.style} />
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'rgba(5,8,16,0.7)' }} />

      {/* Sidebar */}
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
          <NavItem active={true}><PersonIcon /> My Profile</NavItem>
          <NavItem href="/UserHoyo/settings" active={false}><InfoIcon /> Settings</NavItem>
        </nav>

        <div className="px-5 py-5 border-t border-[rgba(200,169,110,0.15)]">
          <div className="flex items-center gap-[10px]">
            <div className="w-9 h-9 rounded-full border flex items-center justify-center font-['Cinzel',serif] text-[0.75rem] font-bold shrink-0 transition-all duration-300 overflow-hidden"
              style={{ borderColor: avatarColor, color: avatarColor, background: avatarPhoto ? `url(${avatarPhoto}) center/cover` : `${avatarColor}15` }}>
              {!avatarPhoto && (initials.slice(0, 2).toUpperCase() || 'TB')}
            </div>
            <div>
              <div className="text-[0.85rem] font-semibold text-[#E8E0CC]">{username}</div>
              <div className="text-[0.7rem] text-[#5A5248] font-['Space_Mono',monospace]">LV.60 · {totalReports} reports</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[260px] flex flex-col min-h-screen relative z-10 max-md:ml-0">
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.85)' }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">My Profile</div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">Manage your identity across the Hoyoverse Hub</div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)}
                  className="px-[14px] py-2 font-['Rajdhani',sans-serif] text-[0.78rem] font-bold tracking-[0.1em] uppercase cursor-pointer border border-[rgba(200,169,110,0.3)] text-[#9A8F78] hover:border-[#C8A96E] hover:text-[#C8A96E] transition-all duration-200 bg-transparent"
                  style={clipBtn}>
                  ✕ Cancel
                </button>
                <button onClick={() => setIsEditing(false)}
                  className="px-[18px] py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer hover:brightness-110 transition-all duration-200 border-none"
                  style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>
                  ✓ Save Profile
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)}
                className="px-[18px] py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer hover:brightness-110 transition-all duration-200 border-none"
                style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>
                ✎ Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="p-8 flex-1">
          <div className="grid grid-cols-[1fr_300px] gap-6 max-[1100px]:grid-cols-1">
            {/* Left Column */}
            <div className="space-y-5">
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] overflow-hidden" style={clipCard}>
                <ProfileBanner bgId={bgId} isEditing={isEditing} onBgChange={setBgId} />

                <div className="px-6 pb-6 relative">
                  <div className="flex items-end gap-5 -mt-14 mb-4">
                    <AvatarEditor
                      initials={initials} color={avatarColor} isEditing={isEditing}
                      onInitialsChange={setInitials} onColorChange={setAvatarColor}
                      photoUrl={avatarPhoto} onPhotoChange={setAvatarPhoto}
                    />
                    <div className="mb-2 flex-1">
                      <EditableText
                        value={username} onChange={setUsername} isEditing={isEditing}
                        placeholder="Your username"
                        className="font-['Cinzel',serif] text-[1.1rem] font-bold text-[#E8E0CC] block"
                      />
                      {!isEditing && <div className="text-[0.72rem] font-['Space_Mono',monospace] mt-1" style={{ color: avatarColor }}>{title}</div>}
                      {isEditing && (
                        <EditableText
                          value={title} onChange={setTitle} isEditing={isEditing}
                          placeholder="Your title"
                          className="text-[0.72rem] font-['Space_Mono',monospace] block mt-1"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="5" r="2.5" stroke="#5A5248" strokeWidth="1"/>
                      <path d="M6 1 C3.5 1 1.5 3 1.5 5 C1.5 7.5 6 11 6 11 C6 11 10.5 7.5 10.5 5 C10.5 3 8.5 1 6 1Z" stroke="#5A5248" strokeWidth="1" fill="none"/>
                    </svg>
                    <EditableText
                      value={location} onChange={setLocation} isEditing={isEditing}
                      placeholder="Location"
                      className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace]"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">
                      Favorite Games {isEditing && <span className="text-[#C8A96E]">(click to toggle)</span>}
                    </div>
                    <FavoriteGameSelector selected={favGames} onChange={setFavGames} isEditing={isEditing} />
                  </div>

                  <div>
                    <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-2 font-['Space_Mono',monospace]">Bio</div>
                    <EditableText
                      value={bio} onChange={setBio} isEditing={isEditing}
                      placeholder="Write something about yourself..."
                      multiline
                      className="text-[0.8rem] text-[#9A8F78] leading-relaxed"
                    />
                  </div>

                  <div className="h-[0.5px] bg-gradient-to-r from-[#C8A96E] via-[rgba(200,169,110,0.2)] to-transparent mt-5 mb-5" />

                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Reports',  value: totalReports, color: '#C8A96E' },
                      { label: 'Votes',    value: totalVotes,   color: '#4ECDC4' },
                      { label: 'Rank',     value: '#12',        color: '#A855F7' },
                      { label: 'Joined',   value: '90d',        color: '#6DD18A' },
                    ].map((s, i) => (
                      <div key={i} className="text-center p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(200,169,110,0.07)]" style={clipBadge}>
                        <div className="font-['Space_Mono',monospace] text-[1rem] font-bold" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[0.58rem] text-[#5A5248] uppercase tracking-[0.1em] mt-[2px]">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)]" style={clipCard}>
                <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                  <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
                    <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
                    Recent Reports
                  </div>
                  <span className="text-[0.72rem] text-[#C8A96E] cursor-pointer hover:text-[#F0D080] transition-colors duration-200 font-semibold">View all →</span>
                </div>
                <div className="h-[0.5px] bg-gradient-to-r from-[#C8A96E] via-[rgba(200,169,110,0.2)] to-transparent mx-5 mb-1" />
                {recentReports.map(r => <ReportRow key={r.id} report={r} />)}
              </div>

              {isEditing && (
                <BgPicker current={bgId} onChange={setBgId} />
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
                <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
                  <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
                  Achievements
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {achievements.map(a => {
                    const gInfo = gameBadgeMap[a.game];
                    return (
                      <div key={a.id}
                        className={`p-3 border transition-all duration-200 cursor-default relative overflow-hidden
                          ${a.unlocked
                            ? 'border-[rgba(200,169,110,0.2)] bg-[rgba(200,169,110,0.04)] hover:border-[rgba(200,169,110,0.4)]'
                            : 'border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] opacity-50'}`}
                        style={clipBadge}
                      >
                        {a.unlocked && (
                          <div className="absolute top-0 right-0 w-8 h-8 opacity-10"
                            style={{ background: `radial-gradient(circle at 100% 0%, ${gInfo.color}, transparent)` }} />
                        )}
                        <div className="text-[1rem] mb-1" style={{ color: a.unlocked ? gInfo.color : '#5A5248' }}>{a.icon}</div>
                        <div className="text-[0.7rem] font-semibold font-['Rajdhani',sans-serif] text-[#E8E0CC] leading-tight">{a.label}</div>
                        <div className="text-[0.58rem] text-[#5A5248] mt-[2px] leading-tight">{a.desc}</div>
                        {a.unlocked && (
                          <div className="mt-[5px]">
                            <GameBadge game={a.game} />
                          </div>
                        )}
                        {!a.unlocked && (
                          <div className="mt-[5px] text-[0.58rem] text-[#5A5248] font-['Space_Mono',monospace]">🔒 Locked</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
                <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
                  <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
                  Game Breakdown
                </div>
                {gameStats.map(g => {
                  const info = gameBadgeMap[g.game];
                  const pct = Math.round((g.reports / maxReports) * 100);
                  return (
                    <div key={g.game} className="mb-4 last:mb-0">
                      <div className="flex items-center justify-between mb-[6px]">
                        <div className="flex items-center gap-2">
                          <GameBadge game={g.game} />
                          <span className="text-[0.7rem] text-[#9A8F78]">{g.reports} reports</span>
                        </div>
                        <span className="font-['Space_Mono',monospace] text-[0.65rem] text-[#4ECDC4]">↑ {g.votes}</span>
                      </div>
                      <div className="h-[3px] bg-[rgba(255,255,255,0.05)] overflow-hidden">
                        <div className="h-full transition-all duration-700 ease-in-out"
                          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${info.color}88, ${info.color})` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipWidget}>
                <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
                  <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
                  Activity — Last 12 Weeks
                </div>
                <div className="flex gap-[3px] flex-wrap">
                  {[...Array(84)].map((_, i) => {
                    const level = [0,0,0,1,0,2,0,1,3,0,0,2,1,0,3,4,2,0,1,0,0,2,1,3,0,1,0,0,3,2,1,0,2,0,4,1,0,2,3,0,1,0,2,1,0,3,2,1,0,4,2,0,1,3,0,2,1,0,0,3,2,1,4,0,2,3,1,0,2,4,3,1,2,0,3,2,1,4,2,3,1,0,2,3][i] || 0;
                    const opacity = level === 0 ? 0.05 : level === 1 ? 0.2 : level === 2 ? 0.45 : level === 3 ? 0.7 : 1;
                    return (
                      <div key={i}
                        className="w-[9px] h-[9px] transition-all duration-200 hover:scale-125 cursor-default"
                        style={{ background: `rgba(200,169,110,${opacity})`, clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }}
                        title={`Day ${i + 1}: ${level} reports`}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <span className="text-[0.58rem] text-[#5A5248]">Less</span>
                  {[0.05, 0.2, 0.45, 0.7, 1].map((o, i) => (
                    <div key={i} className="w-[9px] h-[9px]"
                      style={{ background: `rgba(200,169,110,${o})`, clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }} />
                  ))}
                  <span className="text-[0.58rem] text-[#5A5248]">More</span>
                </div>
              </div>

              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.2)] p-5 relative overflow-hidden" style={clipWidget}>
                <div className="absolute inset-0 opacity-5"
                  style={{ background: 'radial-gradient(ellipse at 80% 20%, #C8A96E, transparent 60%)' }} />
                <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-2">Share Your Profile</div>
                <p className="text-[0.72rem] text-[#5A5248] leading-relaxed mb-4">
                  Invite fellow Trailblazers to your guide collection.
                </p>
                <button
                  className="w-full py-[8px] text-[#050810] font-['Rajdhani',sans-serif] text-[0.78rem] font-bold tracking-[0.12em] uppercase border-none cursor-pointer hover:brightness-110 transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipHexSm }}>
                  ⬡ Copy Profile Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');

        @keyframes float-0 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes float-1 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
        @keyframes float-2 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-11px); } }
      `}</style>
    </div>
  );
}