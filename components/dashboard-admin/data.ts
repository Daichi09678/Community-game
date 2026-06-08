export interface UserActivity {
  id: string;
  username: string;
  email: string;
  level: number;
  rank: string;
  totalReports: number;
  joinedAt: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'banned';
  complaints: string[];
  recentReports: { title: string; type: string; date: string; votes: number }[];
}

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalReports: number;
  pendingReports: number;
  totalComplaints: number;
  bannedUsers: number;
}

export const MOCK_USERS: UserActivity[] = [
  {
    id: '1',
    username: 'AetherVoyager',
    email: 'aether@hoyohub.io',
    level: 12,
    rank: 'Elite Omni-Voyager',
    totalReports: 47,
    joinedAt: '2024-01-15',
    lastActive: '2025-06-07',
    status: 'active',
    complaints: [],
    recentReports: [
      { title: 'Penacony Dreamscape Full Guide', type: 'guide', date: '2025-06-06', votes: 342 },
      { title: 'HSR 2.6 Event Walkthrough', type: 'event', date: '2025-06-04', votes: 210 },
    ],
  },
  {
    id: '2',
    username: 'LunarWatcher',
    email: 'lunawatcher@gmail.com',
    level: 8,
    rank: 'Adept Trailblazer',
    totalReports: 23,
    joinedAt: '2024-03-22',
    lastActive: '2025-06-05',
    status: 'active',
    complaints: ['Duplicate report submitted on 2025-05-20'],
    recentReports: [
      { title: 'Genshin Fontaine Puzzle Compendium', type: 'puzzle', date: '2025-06-01', votes: 89 },
    ],
  },
  {
    id: '3',
    username: 'ZZZHackerX',
    email: 'hackr99@yopmail.com',
    level: 2,
    rank: 'Novice Omni-Voyager',
    totalReports: 3,
    joinedAt: '2025-05-30',
    lastActive: '2025-05-31',
    status: 'banned',
    complaints: [
      'Spam reports filed on 2025-05-31',
      'Offensive language in report content',
      'Ban requested by moderator #4',
    ],
    recentReports: [
      { title: '[SPAM] Click here for primos', type: 'guide', date: '2025-05-31', votes: -5 },
    ],
  },
  {
    id: '4',
    username: 'StarRailCrafter',
    email: 'craftsman@hoyofan.net',
    level: 17,
    rank: 'Master Chronicler',
    totalReports: 112,
    joinedAt: '2023-11-04',
    lastActive: '2025-06-07',
    status: 'active',
    complaints: [],
    recentReports: [
      { title: 'Kafka Max Build — v2.5', type: 'build', date: '2025-06-07', votes: 671 },
      { title: 'Silver Wolf S1 Guide', type: 'guide', date: '2025-06-03', votes: 430 },
      { title: 'Memory of Chaos P12 Guide', type: 'event', date: '2025-05-28', votes: 510 },
    ],
  },
  {
    id: '5',
    username: 'NightOwlGamer',
    email: 'nightowl@gmail.com',
    level: 5,
    rank: 'Apprentice Voyager',
    totalReports: 7,
    joinedAt: '2024-09-18',
    lastActive: '2025-04-30',
    status: 'inactive',
    complaints: ['Incomplete report submitted — no version tag'],
    recentReports: [
      { title: 'HI3 Elysian Realm Survival Tips', type: 'guide', date: '2025-04-29', votes: 34 },
    ],
  },
];

export const MOCK_STATS: AdminStats = {
  totalUsers: 2847,
  activeToday: 312,
  totalReports: 9410,
  pendingReports: 47,
  totalComplaints: 18,
  bannedUsers: 23,
};