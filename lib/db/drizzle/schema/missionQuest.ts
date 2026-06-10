// lib/db/drizzle/schema/missionQuest.ts
import { mysqlTable, varchar, text, int, timestamp, mysqlEnum, index } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

// =============================================
// TABEL MAIN QUESTS (Mission & Quest - Main)
// =============================================

export const mainQuests = mysqlTable('main_quests', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar('title', { length: 255 }).notNull(),
  game: mysqlEnum('game', ['hsr', 'gi', 'zzz', 'hi3']).notNull(),
  version: varchar('version', { length: 20 }).notNull(),
  chapter: varchar('chapter', { length: 100 }).notNull(),
  arc: varchar('arc', { length: 255 }).notNull(),
  authorId: varchar('author_id', { length: 36 }).references(() => users.id, { onDelete: 'set null' }),
  author: varchar('author', { length: 100 }).notNull(),
  initials: varchar('initials', { length: 5 }),
  summary: text('summary'),
  content: text('content'),
  tags: text('tags'),
  status: mysqlEnum('status', ['ongoing', 'complete', 'draft', 'archived']).default('ongoing'),
  rating: int('rating').default(0),
  votes: int('votes').default(0),
  views: int('views').default(0),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => ({
  gameIdx: index('game_idx').on(table.game),
  statusIdx: index('status_idx').on(table.status),
  votesIdx: index('votes_idx').on(table.votes),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
}));

// =============================================
// TABEL SIDE MISSIONS
// =============================================

export const sideMissions = mysqlTable('side_missions', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar('title', { length: 255 }).notNull(),
  game: mysqlEnum('game', ['hsr', 'gi', 'zzz', 'hi3']).notNull(),
  version: varchar('version', { length: 20 }).notNull(),
  type: mysqlEnum('type', ['companion', 'world', 'exploration']).notNull(),
  difficulty: mysqlEnum('difficulty', ['easy', 'normal', 'hard']).default('normal'),
  authorId: varchar('author_id', { length: 36 }).references(() => users.id, { onDelete: 'set null' }),
  author: varchar('author', { length: 100 }).notNull(),
  initials: varchar('initials', { length: 5 }),
  summary: text('summary'),
  content: text('content'),
  reward: varchar('reward', { length: 255 }),
  tags: text('tags'),
  status: mysqlEnum('status', ['ongoing', 'complete', 'draft', 'archived']).default('ongoing'),
  rating: int('rating').default(0),
  votes: int('votes').default(0),
  views: int('views').default(0),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => ({
  gameIdx: index('game_idx').on(table.game),
  typeIdx: index('type_idx').on(table.type),
  statusIdx: index('status_idx').on(table.status),
  votesIdx: index('votes_idx').on(table.votes),
}));

// =============================================
// TABEL QUEST PROGRESS (User Progress Tracking)
// =============================================

export const questProgress = mysqlTable('quest_progress', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  questId: varchar('quest_id', { length: 36 }).notNull(),
  questType: mysqlEnum('quest_type', ['main', 'side']).notNull(),
  status: mysqlEnum('progress_status', ['not_started', 'in_progress', 'completed']).default('not_started'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
  questIdIdx: index('quest_id_idx').on(table.questId),
  statusIdx: index('progress_status_idx').on(table.status),
  userQuestIdx: index('user_quest_idx').on(table.userId, table.questId, table.questType),
}));

// =============================================
// TABEL QUEST COMMENTS
// =============================================

export const questComments = mysqlTable('quest_comments', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  questId: varchar('quest_id', { length: 36 }).notNull(),
  questType: mysqlEnum('comment_quest_type', ['main', 'side']).notNull(),
  userId: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  votes: int('votes').default(0),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => ({
  questIdIdx: index('quest_id_idx').on(table.questId),
  userIdIdx: index('user_id_idx').on(table.userId),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
  votesIdx: index('votes_idx').on(table.votes),
}));