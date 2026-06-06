import { mysqlTable, varchar, text, int, timestamp, mysqlEnum, json } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const missions = mysqlTable('missions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['main', 'side', 'companion', 'world', 'exploration', 'hangout']).notNull(),
  game: mysqlEnum('game', ['hsr', 'gi', 'zzz', 'hi3']).notNull(),
  version: varchar('version', { length: 20 }).notNull(),
  chapter: varchar('chapter', { length: 100 }),
  arc: varchar('arc', { length: 100 }),
  difficulty: mysqlEnum('difficulty', ['easy', 'normal', 'hard']).default('normal'),
  rewards: json('rewards'),
  summary: text('summary'),
  guide: text('guide'),
  tags: json('tags'),
  authorId: varchar('author_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }),
  authorInitials: varchar('author_initials', { length: 10 }),
  votes: int('votes').default(0),
  views: int('views').default(0),
  status: mysqlEnum('status', ['complete', 'ongoing', 'upcoming']).default('complete'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});