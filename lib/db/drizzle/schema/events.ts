// lib/db/drizzle/schema/event.ts
import { mysqlTable, int, varchar, text, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { users } from './users';

// Enum untuk game
export const gameEnum = mysqlEnum('game', ['hsr', 'gi', 'zzz', 'hi3']);
export const eventStatusEnum = mysqlEnum('event_status', ['live', 'upcoming', 'ended']);
export const eventCategoryEnum = mysqlEnum('event_category', ['limited', 'permanent', 'collab', 'seasonal']);
export const submissionStatusEnum = mysqlEnum('submission_status', ['pending', 'approved', 'rejected']);

// Tabel events
export const events = mysqlTable('events', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  game: gameEnum.notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: eventStatusEnum.notNull().default('upcoming'),
  category: eventCategoryEnum.notNull().default('limited'),
  rewards: text('rewards'),
  tag: varchar('tag', { length: 100 }),
  version: varchar('version', { length: 20 }).notNull().default('1.0'),
  featured: mysqlEnum('featured', ['true', 'false']).default('false'),
  thumbnail: varchar('thumbnail', { length: 500 }),
  createdBy: varchar('created_by', { length: 36 }).references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Tabel user event submissions
export const userEventSubmissions = mysqlTable('user_event_submissions', {
  id: int('id').primaryKey().autoincrement(),
  eventId: int('event_id').references(() => events.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }),
  status: submissionStatusEnum.default('pending'),
  submittedAt: timestamp('submitted_at').defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
  reviewedBy: varchar('reviewed_by', { length: 36 }).references(() => users.id, { onDelete: 'set null' }),
  notes: text('notes'),
});