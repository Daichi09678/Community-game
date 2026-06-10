// types/event.ts
export type GameKey = 'hsr' | 'gi' | 'zzz' | 'hi3';
export type EventStatus = 'live' | 'upcoming' | 'ended';
export type EventCategory = 'limited' | 'permanent' | 'collab' | 'seasonal';

export interface HoyoEvent {
  id: string | number;
  title: string;
  game: GameKey;
  status: EventStatus;
  category: EventCategory;
  startDate: string;
  endDate: string;
  daysLeft: number;
  rewards: string[];
  description: string;
  tag: string;
  version: string;
  featured?: boolean;
  thumbnail?: string;
  content?: string;
  authorName?: string;
  authorInitials?: string;
  votes?: number;
  views?: number;
}