export const reportsData = [
  { title: "Deep Dive: 'Where the Stairway Leads' Quest Analysis", type: "mission", game: "hsr", author: "AstreaN_7",     initials: "AN", rating: 5, votes: 248, date: "2h ago", version: "3.2" },
  { title: "Natlan Archon Quest Act II — Full Story Recap",         type: "mission", game: "gi",  author: "VoidHunter_X",  initials: "VH", rating: 4, votes: 186, date: "5h ago", version: "5.3" },
  { title: "Complete Simulated Universe World 10 Guide",            type: "puzzle",  game: "hsr", author: "QuantumGale",   initials: "QG", rating: 5, votes: 412, date: "1h ago", version: "3.1" },
  { title: "HoloFest Event — All Stages & Reward Breakdown",        type: "event",   game: "zzz", author: "Mei_Stellaron", initials: "MS", rating: 5, votes: 334, date: "2h ago", version: "1.4" },
  { title: "Honkai Impact 3rd: Elysian Realm Full Clear Tips",      type: "puzzle",  game: "hi3", author: "TrailBossKai",  initials: "TK", rating: 3, votes: 92,  date: "1h ago", version: "7.4" },
  { title: "Genshin: Hidden Achievement Guide — Liyue Region",      type: "puzzle",  game: "gi",  author: "SilverWolf_Fan",initials: "SW", rating: 4, votes: 178, date: "3h ago", version: "5.2" },
  { title: "Robin Companion Quest — Character Analysis",            type: "mission", game: "hsr", author: "Cocolia_Arc",   initials: "CA", rating: 5, votes: 521, date: "4h ago", version: "3.1" },
  { title: "ZZZ: Hollow Zero District 6 — Fastest Clear Path",      type: "puzzle",  game: "zzz", author: "ImaginaryRift", initials: "IR", rating: 4, votes: 67,  date: "6h ago", version: "1.3" },
  { title: "'Clouded Sanctuary' Event — Full Content Review",       type: "event",   game: "hsr", author: "QuantumGale",   initials: "QG", rating: 4, votes: 143, date: "8h ago", version: "3.2" },
  { title: "Genshin Impact: Chasca Hangout Quest — All Endings",    type: "mission", game: "gi",  author: "AstreaN_7",     initials: "AN", rating: 5, votes: 298, date: "1h ago", version: "5.3" },
];

export const topItemsData = [
  { title: "Robin Companion Quest — Character Analysis", score: "521 votes" },
  { title: "Simulated Universe World 10 — Full Guide",   score: "412 votes" },
  { title: "HoloFest Event — All Stages & Rewards",      score: "334 votes" },
  { title: "Chasca Hangout Quest — All Endings",         score: "298 votes" },
  { title: "Where the Stairway Leads — Review",          score: "248 votes" },
];

export const tagsData = [
  { label: 'Natlan',             variant: 'default', game: 'gi'  },
  { label: 'Robin',              variant: 'gold',    game: 'hsr' },
  { label: 'HSR 3.2',            variant: 'cyan',    game: 'hsr' },
  { label: 'Simulated Universe', variant: 'purple',  game: 'hsr' },
  { label: 'Liyue Lore',         variant: 'default', game: 'gi'  },
  { label: 'Acheron',            variant: 'default', game: 'hsr' },
  { label: 'Hollow Zero',        variant: 'purple',  game: 'zzz' },
  { label: 'Elysian Realm',      variant: 'cyan',    game: 'hi3' },
  { label: 'Zenless 1.4',        variant: 'default', game: 'zzz' },
  { label: 'Hidden Achievement', variant: 'default', game: 'gi'  },
];

export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const vals = [24, 38, 31, 52, 44, 67, 48];
export const maxVal = Math.max(...vals);

export const rankStyles = [
  'text-[#C8A96E]',
  'text-[#C8A96E]',
  'text-[#9AA0AA]',
  'text-[#9AA0AA]',
  'text-[#CD7F32]',
];

export const gameBadgeMap: Record<string, { label: string; className: string }> = {
  hsr: { label: 'Star Rail',  className: 'bg-[rgba(78,205,196,0.1)]   text-[#4ECDC4] border border-[rgba(78,205,196,0.3)]'   },
  gi:  { label: 'Genshin',    className: 'bg-[rgba(109,209,138,0.1)]  text-[#6DD18A] border border-[rgba(109,209,138,0.3)]'  },
  zzz: { label: 'Zenless',    className: 'bg-[rgba(168,85,247,0.1)]   text-[#A855F7] border border-[rgba(168,85,247,0.3)]'   },
  hi3: { label: 'Honkai 3rd', className: 'bg-[rgba(224,92,122,0.1)]   text-[#E05C7A] border border-[rgba(224,92,122,0.3)]'   },
};

export const coverage = [
  { label: 'Honkai: Star Rail', pct: 42, fill: 'bg-[#4ECDC4]' },
  { label: 'Genshin Impact',    pct: 35, fill: 'bg-[#6DD18A]' },
  { label: 'Zenless Zone Zero', pct: 15, fill: 'bg-[#A855F7]' },
  { label: 'Honkai Impact 3rd', pct: 8,  fill: 'bg-[#E05C7A]' },
];

export type GameFilter = 'all' | 'hsr' | 'gi' | 'zzz' | 'hi3';
export type TypeFilter = 'all' | 'mission' | 'event' | 'puzzle';

export const gameAccentMap: Record<GameFilter, string> = {
  all: '#C8A96E',
  hsr: '#4ECDC4',
  gi:  '#6DD18A',
  zzz: '#A855F7',
  hi3: '#E05C7A',
};

export const gameLabels: Record<string, string> = {
  all: 'All Games', 
  hsr: 'Honkai: Star Rail',
  gi: 'Genshin Impact', 
  zzz: 'Zenless Zone Zero', 
  hi3: 'Honkai Impact 3rd',
};