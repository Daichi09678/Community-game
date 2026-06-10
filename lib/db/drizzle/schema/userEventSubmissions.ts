// lib/db/drizzle/schema/events.ts
import { mysqlTable, int, varchar, text, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const events = mysqlTable('events', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  game: mysqlEnum('game', ['hsr', 'gi', 'zzz', 'hi3']).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: mysqlEnum('status', ['live', 'upcoming', 'ended']).notNull().default('upcoming'),
  category: mysqlEnum('category', ['limited', 'permanent', 'collab', 'seasonal']).default('limited'),
  rewards: text('rewards'),
  tag: varchar('tag', { length: 100 }),
  version: varchar('version', { length: 20 }).default('1.0'),
  featured: mysqlEnum('featured', ['true', 'false']).default('false'),
  thumbnail: varchar('thumbnail', { length: 500 }),
  createdBy: varchar('created_by', { length: 36 }).references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});