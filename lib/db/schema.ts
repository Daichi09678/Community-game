import { mysqlTable, text, timestamp, boolean, varchar, int, float, mysqlEnum } from 'drizzle-orm/mysql-core';

// Users table - Better Auth required fields
export const users = mysqlTable('user', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
});

// Sessions table
export const sessions = mysqlTable('session', {
  id: varchar('id', { length: 255 }).primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  ipAddress: varchar('ip_address', { length: 255 }),
  userAgent: text('user_agent'),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
});

// Accounts table for OAuth
export const accounts = mysqlTable('account', {
  id: varchar('id', { length: 255 }).primaryKey(),
  accountId: varchar('account_id', { length: 255 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

// Verifications table - used by Better Auth for OTP/email verification
export const verifications = mysqlTable('verification', {
  id: varchar('id', { length: 255 }).primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// User profiles table - extended game data
export const userProfiles = mysqlTable('user_profile', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  username: varchar('username', { length: 100 }).unique(),
  initials: varchar('initials', { length: 10 }),
  rank: varchar('rank', { length: 100 }).default('Novice Omni-Voyager'),
  level: int('level').default(1),
  xp: int('xp').default(0),
  totalMissions: int('total_missions').default(0),
  totalReports: int('total_reports').default(0),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Reports table
export const reports = mysqlTable('report', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['guide', 'event', 'puzzle', 'lore', 'build', 'other']).notNull().default('guide'),
  game: mysqlEnum('game', ['hsr', 'gi', 'zzz', 'hi3']).notNull(),
  status: mysqlEnum('status', ['draft', 'published', 'archived']).notNull().default('draft'),
  authorId: varchar('author_id', { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  authorInitials: varchar('author_initials', { length: 10 }),
  rating: float('rating').default(0),
  votes: int('votes').default(0),
  version: varchar('version', { length: 20 }),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});



// ... tabel users, userProfiles, otpCodes, reports, adminActivities yang sudah ada ...

// Tambahkan tabel events
export const events = mysqlTable('events', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  game: mysqlEnum('game', ['hsr', 'gi', 'zzz', 'hi3']).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: mysqlEnum('status', ['live', 'upcoming', 'ended']).notNull().default('upcoming'),
  thumbnail: varchar('thumbnail', { length: 500 }),
  createdBy: varchar('created_by', { length: 36 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Tambahkan tabel userEventSubmissions (opsional)
export const userEventSubmissions = mysqlTable('user_event_submissions', {
  id: int('id').primaryKey().autoincrement(),
  eventId: int('event_id').references(() => events.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }),
  status: mysqlEnum('status', ['pending', 'approved', 'rejected']).default('pending'),
  submittedAt: timestamp('submitted_at').defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
  reviewedBy: varchar('reviewed_by', { length: 36 }),
  notes: text('notes'),
});