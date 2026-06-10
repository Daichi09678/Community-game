// lib/db/drizzle/schema/userProfiles.ts
import { mysqlTable, varchar, int, timestamp, text } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const userProfiles = mysqlTable('user_profile', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  username: varchar('username', { length: 100 }).unique(),
  initials: varchar('initials', { length: 10 }),
  // HAPUS RANK
  level: int('level').default(1),
  xp: int('xp').default(0),
  totalMissions: int('total_missions').default(0),
  totalReports: int('total_reports').default(0),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  
  // Profile additional fields
  bio: text('bio'),
  location: varchar('location', { length: 255 }),
  avatarColor: varchar('avatar_color', { length: 20 }).default('#C8A96E'),
  avatarPhoto: text('avatar_photo'),
  bannerId: varchar('banner_id', { length: 50 }).default('default'),
  bannerPhoto: text('banner_photo'),
  favGames: text('fav_games'), // JSON string array
});