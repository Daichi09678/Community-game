import { mysqlTable, varchar, text, int, timestamp, mysqlEnum, json } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const quests = mysqlTable('quests', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['main', 'side', 'daily', 'weekly', 'event', 'achievement']).notNull(),
  game: mysqlEnum('game', ['hsr', 'gi', 'zzz', 'hi3']).notNull(),
  version: varchar('version', { length: 20 }).notNull(),
  location: varchar('location', { length: 255 }),
  npc: varchar('npc', { length: 100 }),
  requirements: json('requirements'),
  rewards: json('rewards'),
  steps: json('steps'),
  guide: text('guide'),
  difficulty: mysqlEnum('difficulty', ['easy', 'normal', 'hard', 'expert']).default('normal'),
  estimatedTime: int('estimated_time'),
  authorId: varchar('author_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }),
  authorInitials: varchar('author_initials', { length: 10 }),
  votes: int('votes').default(0),
  views: int('views').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});