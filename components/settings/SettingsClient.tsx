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
  BellIcon,
  EyeIcon,
  ShieldIcon,
  LinkIcon,
  LogoutIcon,
  HeadsetIcon,
} from './Icons';
import { SettingsRow } from './SettingsRow';
import { Toggle } from './Toggle';
import { HexSelect } from './HexSelect';
import { LinkedAccountRow } from './LinkedAccountRow';
import { ChangePasswordModal } from './ChangePasswordModal';
import { LogoutModal } from './LogoutModal';
import { SupportModal } from './SupportModal';
import { GameBadge } from './GameBadge';
import { clipBtn, clipBadge, clipCard, clipWidget, clipHex } from './clipStyles';
import { LoadingAnimation } from '@/components/ui';

type SettingsTab = 'account' | 'notifications' | 'display' | 'privacy' | 'linked' | 'support';

const settingsTabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'account', label: 'Account', icon: <PersonIcon /> },
  { id: 'notifications', label: 'Notifications', icon: <BellIcon /> },
  { id: 'display', label: 'Display', icon: <EyeIcon /> },
  { id: 'privacy', label: 'Privacy', icon: <ShieldIcon /> },
  { id: 'linked', label: 'Linked Accounts', icon: <LinkIcon /> },
  { id: 'support', label: 'Support', icon: <HeadsetIcon /> },
];

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-['Cinzel',serif] text-[0.82rem] font-semibold text-[#E8E0CC] mb-4 flex items-center gap-2">
      <span className="w-[3px] h-[14px] bg-[#C8A96E] inline-block shrink-0" />
      {children}
    </div>
  );
}

export function SettingsClient() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [showLogout, setShowLogout] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [saved, setSaved] = useState(false);

  // Account
  const [email, setEmail] = useState('trailblazer@cosmoexpress.net');
  const [username, setUsername] = useState('Trailblazer_01');
  const [twoFactor, setTwoFactor] = useState(false);

  // Notifications
  const [notifVotes, setNotifVotes] = useState(true);
  const [notifReply, setNotifReply] = useState(true);
  const [notifPatch, setNotifPatch] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifEvent, setNotifEvent] = useState(true);
  const [notifRank, setNotifRank] = useState(false);

  // Display
  const [theme, setTheme] = useState('astral');
  const [language, setLanguage] = useState('en');
  const [density, setDensity] = useState('normal');
  const [animations, setAnimations] = useState(true);
  const [hexGrid, setHexGrid] = useState(true);

  // Privacy
  const [profilePublic, setProfilePublic] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [showVotes, setShowVotes] = useState(true);
  const [spoilerDefault, setSpoilerDefault] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return <LoadingAnimation message="LOADING SETTINGS..." />;
  }

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
        <div className="flex items-center justify-between px-8 py-4 border-b border-[rgba(200,169,110,0.15)] sticky top-0 z-40 backdrop-blur-[10px]" style={{ background: 'rgba(5,8,16,0.85)' }}>
          <div>
            <div className="font-['Cinzel',serif] text-[1rem] font-semibold text-[#E8E0CC]">Settings</div>
            <div className="text-[#5A5248] text-[0.75rem] mt-[2px]">Manage your account, preferences & security</div>
          </div>
          <div className="flex gap-2 items-center">
            {saved && <span className="text-[0.68rem] text-[#6DD18A] font-['Space_Mono',monospace] border border-[rgba(109,209,138,0.3)] px-3 py-1 bg-[rgba(109,209,138,0.06)]" style={clipBadge}>✓ Saved</span>}
            <button onClick={handleSave} className="px-[18px] py-2 text-[#050810] font-['Rajdhani',sans-serif] text-[0.8rem] font-bold tracking-[0.1em] uppercase cursor-pointer hover:brightness-110 transition-all duration-200 border-none" style={{ background: 'linear-gradient(135deg, #8B6A2E, #C8A96E)', ...clipBtn }}>✓ Save Changes</button>
          </div>
        </div>

        <div className="p-8 flex-1">
          <div className="grid grid-cols-[220px_1fr] gap-6 max-[900px]:grid-cols-1">
            {/* SETTINGS NAV */}
            <div className="space-y-1">
              <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-3" style={clipWidget}>
                <div className="text-[0.6rem] font-bold tracking-[0.18em] uppercase text-[#5A5248] px-2 mb-3 font-['Space_Mono',monospace]">Preferences</div>
                {settingsTabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-[10px] px-3 py-[9px] text-[0.85rem] font-semibold tracking-[0.03em] transition-all duration-200 cursor-pointer mb-[2px] relative border-none bg-transparent font-['Rajdhani',sans-serif]
                      ${activeTab === tab.id ? 'bg-[rgba(200,169,110,0.1)] text-[#C8A96E]' : 'text-[#9A8F78] hover:bg-[rgba(200,169,110,0.06)] hover:text-[#E8E0CC]'}`}
                    style={clipHex}>
                    {activeTab === tab.id && <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96E]" />}
                    <span className="shrink-0">{tab.icon}</span><span>{tab.label}</span>
                  </button>
                ))}
                <div className="h-[0.5px] bg-[rgba(200,169,110,0.15)] my-3" />
                <button onClick={() => setShowSupport(true)} className="w-full flex items-center gap-[10px] px-3 py-[9px] text-[0.85rem] font-semibold text-[#9A8F78] hover:bg-[rgba(78,205,196,0.06)] hover:text-[#4ECDC4] transition-all duration-200 cursor-pointer border-none bg-transparent font-['Rajdhani',sans-serif]" style={clipHex}><HeadsetIcon /> Customer Service</button>
                <button onClick={() => setShowLogout(true)} className="w-full flex items-center gap-[10px] px-3 py-[9px] text-[0.85rem] font-semibold text-[#9A8F78] hover:bg-[rgba(224,92,122,0.06)] hover:text-[#E05C7A] transition-all duration-200 cursor-pointer border-none bg-transparent font-['Rajdhani',sans-serif]" style={clipHex}><LogoutIcon /> Sign Out</button>
              </div>
              <div className="bg-[#0C1220] border border-[rgba(224,92,122,0.1)] p-4" style={clipWidget}>
                <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#E05C7A] mb-3 font-['Space_Mono',monospace]">Danger Zone</div>
                <button className="w-full py-[8px] text-[0.72rem] font-bold font-['Rajdhani',sans-serif] border border-[rgba(224,92,122,0.3)] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.08)] transition-all duration-200 cursor-pointer bg-transparent tracking-[0.08em]" style={clipBtn}>Delete Account</button>
              </div>
            </div>

            {/* SETTINGS PANEL */}
            <div className="space-y-5">
              {/* ACCOUNT */}
              {activeTab === 'account' && (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
                  <WidgetTitle>Account Settings</WidgetTitle>
                  <SettingsRow label="Username" desc="Your public display name across the Hub"><input value={username} onChange={e => setUsername(e.target.value)} className="bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.2)] text-[#C8A96E] text-[0.75rem] font-['Space_Mono',monospace] outline-none px-3 py-[6px] w-44 focus:border-[rgba(200,169,110,0.5)] transition-all" style={clipBadge} /></SettingsRow>
                  <SettingsRow label="Email Address" desc="Used for login and support contact"><input value={email} onChange={e => setEmail(e.target.value)} className="bg-[rgba(200,169,110,0.06)] border border-[rgba(200,169,110,0.2)] text-[#C8A96E] text-[0.75rem] font-['Space_Mono',monospace] outline-none px-3 py-[6px] w-52 focus:border-[rgba(200,169,110,0.5)] transition-all" style={clipBadge} /></SettingsRow>
                  <SettingsRow label="Change Password" desc="Last changed 30 days ago"><button onClick={() => setShowChangePassword(true)} className="px-4 py-[6px] text-[0.72rem] font-['Rajdhani',sans-serif] font-bold border border-[rgba(200,169,110,0.25)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.1)] bg-transparent cursor-pointer transition-all duration-200" style={clipBadge}>Change →</button></SettingsRow>
                  <SettingsRow label="Two-Factor Auth" desc="Add an extra layer of security to your account"><div className="flex items-center gap-2"><span className={`text-[0.65rem] font-['Space_Mono',monospace] ${twoFactor ? 'text-[#6DD18A]' : 'text-[#5A5248]'}`}>{twoFactor ? 'Enabled' : 'Disabled'}</span><Toggle checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} color="#6DD18A" /></div></SettingsRow>
                  <SettingsRow label="Account Level" desc="Progress toward LV.61"><div className="text-right"><div className="text-[#C8A96E] font-['Space_Mono',monospace] text-[0.78rem] font-bold">LV.60</div><div className="w-28 h-[3px] bg-[rgba(255,255,255,0.05)] mt-1 overflow-hidden" style={{ clipPath: 'polygon(2px 0, 100% 0, calc(100% - 2px) 100%, 0 100%)' }}><div className="h-full w-[72%]" style={{ background: 'linear-gradient(90deg, #8B6A2E, #C8A96E)' }} /></div><div className="text-[0.55rem] text-[#5A5248] font-['Space_Mono',monospace] mt-[3px]">7,200 / 10,000 XP</div></div></SettingsRow>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
                  <WidgetTitle>Notification Settings</WidgetTitle>
                  <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-3 font-['Space_Mono',monospace]">In-App</div>
                  <SettingsRow label="Vote Alerts" desc="Notify when someone votes on your report"><Toggle checked={notifVotes} onChange={() => setNotifVotes(!notifVotes)} /></SettingsRow>
                  <SettingsRow label="Comment Replies" desc="Notify when someone replies to your comment"><Toggle checked={notifReply} onChange={() => setNotifReply(!notifReply)} /></SettingsRow>
                  <SettingsRow label="Rank Change" desc="Notify when your leaderboard rank changes"><Toggle checked={notifRank} onChange={() => setNotifRank(!notifRank)} color="#A855F7" /></SettingsRow>
                  <div className="h-[0.5px] bg-[rgba(200,169,110,0.1)] my-4" />
                  <div className="text-[0.6rem] font-bold tracking-[0.15em] uppercase text-[#5A5248] mb-3 font-['Space_Mono',monospace]">Push / Email</div>
                  <SettingsRow label="Email Digest" desc="Weekly summary of your activity sent by email"><Toggle checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} color="#4ECDC4" /></SettingsRow>
                  <SettingsRow label="Patch Notes" desc="Notify when a new game patch is logged in the Hub"><Toggle checked={notifPatch} onChange={() => setNotifPatch(!notifPatch)} color="#6DD18A" /></SettingsRow>
                  <SettingsRow label="Event Reminders" desc="Get notified before limited-time events expire"><Toggle checked={notifEvent} onChange={() => setNotifEvent(!notifEvent)} color="#C8A96E" /></SettingsRow>
                  <div className="mt-4 p-3 bg-[rgba(200,169,110,0.04)] border border-[rgba(200,169,110,0.1)]" style={clipBadge}><div className="text-[0.65rem] text-[#5A5248] font-['Space_Mono',monospace]">You can manage notification frequency globally. <span className="text-[#C8A96E] cursor-pointer hover:text-[#F0D080]">Manage →</span></div></div>
                </div>
              )}

              {/* DISPLAY */}
              {activeTab === 'display' && (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
                  <WidgetTitle>Display Settings</WidgetTitle>
                  <SettingsRow label="Theme" desc="Choose your Hub color palette"><HexSelect value={theme} onChange={setTheme} options={[{ value: 'astral', label: 'Astral Night' }, { value: 'xianzhou', label: 'Xianzhou Glow' }, { value: 'natlan', label: 'Natlan Ember' }, { value: 'penacony', label: 'Penacony Dream' }, { value: 'fontaine', label: 'Fontaine Blue' }, { value: 'hollow', label: 'Hollow Static' }]} /></SettingsRow>
                  <SettingsRow label="Language" desc="Interface language"><HexSelect value={language} onChange={setLanguage} options={[{ value: 'en', label: 'English' }, { value: 'id', label: 'Indonesian' }, { value: 'ja', label: '日本語' }, { value: 'zh', label: '中文' }, { value: 'ko', label: '한국어' }, { value: 'es', label: 'Español' }, { value: 'fr', label: 'Français' }, { value: 'de', label: 'Deutsch' }, { value: 'it', label: 'Italiano' }, { value: 'pt', label: 'Português' }, { value: 'ru', label: 'Русский' }, { value: 'ar', label: 'العربية' }, { value: 'hi', label: 'हिन्दी' }, { value: 'th', label: 'ไทย' }, { value: 'vi', label: 'Tiếng Việt' }, { value: 'tr', label: 'Türkçe' }, { value: 'pl', label: 'Polski' }, { value: 'nl', label: 'Nederlands' }, { value: 'sv', label: 'Svenska' }, { value: 'no', label: 'Norsk' }, { value: 'da', label: 'Dansk' }, { value: 'fi', label: 'Suomi' }, { value: 'el', label: 'Ελληνικά' }, { value: 'cs', label: 'Čeština' }, { value: 'hu', label: 'Magyar' }, { value: 'ro', label: 'Română' }, { value: 'uk', label: 'Українська' }, { value: 'he', label: 'עברית' }]} /></SettingsRow>
                  <SettingsRow label="Layout Density" desc="Adjust information density across pages"><HexSelect value={density} onChange={setDensity} options={[{ value: 'compact', label: 'Compact' }, { value: 'normal', label: 'Normal' }, { value: 'roomy', label: 'Roomy' }]} /></SettingsRow>
                  <SettingsRow label="Hex Grid Background" desc="Show animated hex grid overlay on banners"><Toggle checked={hexGrid} onChange={() => setHexGrid(!hexGrid)} /></SettingsRow>
                  <SettingsRow label="Animations" desc="Enable motion effects and transitions"><Toggle checked={animations} onChange={() => setAnimations(!animations)} /></SettingsRow>
                </div>
              )}

              {/* PRIVACY */}
              {activeTab === 'privacy' && (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
                  <WidgetTitle>Privacy Settings</WidgetTitle>
                  <SettingsRow label="Public Profile" desc="Allow others to view your profile and reports"><Toggle checked={profilePublic} onChange={() => setProfilePublic(!profilePublic)} color="#6DD18A" /></SettingsRow>
                  <SettingsRow label="Show Activity Heatmap" desc="Display your contribution calendar on your profile"><Toggle checked={showActivity} onChange={() => setShowActivity(!showActivity)} /></SettingsRow>
                  <SettingsRow label="Show Vote Count" desc="Let others see how many votes your reports received"><Toggle checked={showVotes} onChange={() => setShowVotes(!showVotes)} /></SettingsRow>
                  <SettingsRow label="Spoiler Mode Default" desc="Auto-collapse spoiler content when browsing reports"><Toggle checked={spoilerDefault} onChange={() => setSpoilerDefault(!spoilerDefault)} color="#A855F7" /></SettingsRow>
                  <div className="h-[0.5px] bg-[rgba(200,169,110,0.1)] my-4" />
                  <SettingsRow label="Download My Data" desc="Export all your reports and account data as a ZIP file"><button className="px-4 py-[6px] text-[0.72rem] font-['Rajdhani',sans-serif] font-bold border border-[rgba(200,169,110,0.25)] text-[#C8A96E] hover:bg-[rgba(200,169,110,0.1)] bg-transparent cursor-pointer transition-all duration-200" style={clipBadge}>Export →</button></SettingsRow>
                  <SettingsRow label="Delete All Reports" desc="Permanently remove all your submitted reports" danger><button className="px-4 py-[6px] text-[0.72rem] font-['Rajdhani',sans-serif] font-bold border border-[rgba(224,92,122,0.3)] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.1)] bg-transparent cursor-pointer transition-all duration-200" style={clipBadge}>Delete All</button></SettingsRow>
                </div>
              )}

              {/* LINKED */}
              {activeTab === 'linked' && (
                <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
                  <WidgetTitle>Linked Game Accounts</WidgetTitle>
                  <p className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace] mb-5 leading-relaxed">Link your Hoyoverse UIDs to display stats and verify ownership of game-specific reports.</p>
                  <LinkedAccountRow game="hsr" uid="700123456" linked color="#4ECDC4" />
                  <LinkedAccountRow game="gi" uid="900654321" linked color="#6DD18A" />
                  <LinkedAccountRow game="zzz" linked={false} color="#A855F7" />
                  <LinkedAccountRow game="hi3" linked={false} color="#E05C7A" />
                  <div className="mt-5 p-3 bg-[rgba(78,205,196,0.04)] border border-[rgba(78,205,196,0.15)]" style={clipBadge}><div className="text-[0.65rem] text-[#4ECDC4] font-['Space_Mono',monospace]">⬡ Linking accounts lets the system auto-tag your reports with the correct game badge.</div></div>
                </div>
              )}

              {/* SUPPORT TAB */}
              {activeTab === 'support' && (
                <div className="space-y-4">
                  <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.15)] p-5" style={clipCard}>
                    <WidgetTitle>Support Center</WidgetTitle>
                    <p className="text-[0.72rem] text-[#5A5248] font-['Space_Mono',monospace] mb-5 leading-relaxed">Need help? Our team is here. Avg response time under 2 hours.</p>
                    <div className="grid grid-cols-2 gap-3 mb-5 max-sm:grid-cols-1">
                      <button onClick={() => setShowSupport(true)} className="flex items-center gap-3 p-4 border border-[rgba(200,169,110,0.15)] hover:border-[rgba(200,169,110,0.4)] bg-[rgba(200,169,110,0.03)] hover:bg-[rgba(200,169,110,0.06)] transition-all duration-200 cursor-pointer text-left bg-transparent" style={clipWidget}>
                        <span className="text-[1.3rem]">📨</span><div><div className="font-['Rajdhani',sans-serif] text-[0.85rem] font-bold text-[#E8E0CC]">Submit Ticket</div><div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] mt-[2px]">Bug, account or content issue</div></div>
                      </button>
                      <button onClick={() => setShowSupport(true)} className="flex items-center gap-3 p-4 border border-[rgba(78,205,196,0.15)] hover:border-[rgba(78,205,196,0.35)] bg-[rgba(78,205,196,0.03)] hover:bg-[rgba(78,205,196,0.06)] transition-all duration-200 cursor-pointer text-left bg-transparent" style={clipWidget}>
                        <span className="text-[1.3rem]">⬡</span><div><div className="font-['Rajdhani',sans-serif] text-[0.85rem] font-bold text-[#E8E0CC]">FAQ</div><div className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] mt-[2px]">Browse common questions</div></div>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {[{ icon: '💬', label: 'Discord Community', sub: 'discord.gg/hoyohub', color: 'rgba(168,85,247,0.3)' }, { icon: '📧', label: 'Email Support', sub: 'support@hoyohub.gg', color: 'rgba(200,169,110,0.2)' }, { icon: '🐦', label: 'Twitter / X', sub: '@HoyoverseHub', color: 'rgba(78,205,196,0.2)' }].map((c, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border border-[rgba(200,169,110,0.08)] hover:border-[rgba(200,169,110,0.2)] transition-all duration-200 cursor-pointer" style={clipBadge}>
                          <span className="text-[1rem] shrink-0">{c.icon}</span>
                          <div className="flex-1"><div className="text-[0.78rem] font-semibold text-[#E8E0CC] font-['Rajdhani',sans-serif]">{c.label}</div><div className="text-[0.6rem] text-[#5A5248] font-['Space_Mono',monospace]">{c.sub}</div></div>
                          <span className="text-[#5A5248] text-[0.7rem]">→</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#0C1220] border border-[rgba(200,169,110,0.1)] p-5" style={clipWidget}>
                    <WidgetTitle>About Hoyoverse Hub</WidgetTitle>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      {[{ label: 'Version', value: 'v3.2.1' }, { label: 'Build', value: '2025.05' }, { label: 'Reports', value: '1,247' }, { label: 'Members', value: '8,400+' }].map((s, i) => (
                        <div key={i} className="p-3 bg-[rgba(200,169,110,0.03)] border border-[rgba(200,169,110,0.07)]" style={clipBadge}>
                          <div className="font-['Space_Mono',monospace] text-[0.85rem] font-bold text-[#C8A96E]">{s.value}</div>
                          <div className="text-[0.58rem] text-[#5A5248] uppercase tracking-[0.1em] mt-[2px]">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[0.62rem] text-[#5A5248] font-['Space_Mono',monospace] leading-relaxed mt-4">Hoyoverse Hub is a fan community platform and is not affiliated with miHoYo / Hoyoverse Co., Ltd.</p>
                  </div>
                </div>
              )}

              {/* Bottom quick-access buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowSupport(true)} className="flex items-center justify-center gap-2 py-3 border border-[rgba(78,205,196,0.2)] text-[#4ECDC4] hover:bg-[rgba(78,205,196,0.06)] hover:border-[rgba(78,205,196,0.4)] transition-all duration-200 bg-transparent cursor-pointer text-[0.78rem] font-bold font-['Rajdhani',sans-serif] tracking-[0.08em] uppercase" style={clipBtn}><HeadsetIcon /> Customer Service</button>
                <button onClick={() => setShowLogout(true)} className="flex items-center justify-center gap-2 py-3 border border-[rgba(224,92,122,0.25)] text-[#E05C7A] hover:bg-[rgba(224,92,122,0.08)] hover:border-[rgba(224,92,122,0.5)] transition-all duration-200 bg-transparent cursor-pointer text-[0.78rem] font-bold font-['Rajdhani',sans-serif] tracking-[0.08em] uppercase" style={clipBtn}><LogoutIcon /> Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ChangePasswordModal open={showChangePassword} onClose={() => setShowChangePassword(false)} />
      <LogoutModal open={showLogout} onClose={() => setShowLogout(false)} />
      <SupportModal open={showSupport} onClose={() => setShowSupport(false)} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Rajdhani:wght@500;600;700&family=Space+Mono&display=swap');
      `}</style>
    </div>
  );
}