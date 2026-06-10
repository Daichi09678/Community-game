import { mysqlTable, varchar, int, timestamp, boolean } from 'drizzle-orm/mysql-core';

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
  initials: varchar('initials', { length: 10 }), // Tambahan untuk inisial user
  lastLogin: timestamp('last_login'), // Tambahan untuk last login
  totalReports: int('total_reports').default(0), // Total laporan yang dibuat user
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  passwordChangedAt: timestamp('password_changed_at'),
  
  
});