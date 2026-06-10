import { mysqlTable, varchar, int, timestamp, boolean, text } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  isVerified: boolean('is_verified').default(false),
  role: varchar('role', { length: 50 }).default('user'),
  rank: varchar('rank', { length: 100 }).default('Novice Omni-Voyager'),
  level: int('level').default(1),
  xp: int('xp').default(0),
  initials: varchar('initials', { length: 10 }),
  lastLogin: timestamp('last_login'),
  totalReports: int('total_reports').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  passwordChangedAt: timestamp('password_changed_at'),
  
  // ✨ TAMBAHKAN 3 KOLOM INI UNTUK FITUR BAN:
  isBanned: boolean('is_banned').default(false),
  banReason: text('ban_reason'),
  banExpiry: timestamp('ban_expiry'),
});