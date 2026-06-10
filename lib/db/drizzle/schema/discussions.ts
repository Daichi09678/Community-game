// lib/db/drizzle/schema/discussions.ts

import { mysqlTable, int, varchar, text, timestamp, boolean, mysqlEnum, primaryKey, index } from 'drizzle-orm/mysql-core';
import { users } from './users';
import { sql } from 'drizzle-orm';

// Tabel threads (diskusi utama)
export const discussionThreads = mysqlTable('discussion_threads', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 200 }).notNull(),
  body: text('body').notNull(),
  game: mysqlEnum('game', ['hsr', 'gi', 'zzz', 'hi3']).notNull(),
  category: mysqlEnum('category', ['meta', 'lore', 'guide', 'discovery', 'help', 'general']).notNull(),
  authorId: varchar('author_id', { length: 36 }).notNull(),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  authorInitials: varchar('author_initials', { length: 10 }).notNull(),
  replies: int('replies').default(0),
  likes: int('likes').default(0),
  views: int('views').default(0),
  pinned: boolean('pinned').default(false),
  locked: boolean('locked').default(false),
  tags: text('tags'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  // Indexes
  gameIdx: index('game_idx').on(table.game),
  categoryIdx: index('category_idx').on(table.category),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
  viewsIdx: index('views_idx').on(table.views),
  likesIdx: index('likes_idx').on(table.likes),
  // Foreign keys
  authorFk: index('author_fk').on(table.authorId),
}));

// Tabel replies (balasan)
export const discussionReplies = mysqlTable('discussion_replies', {
  id: int('id').primaryKey().autoincrement(),
  threadId: int('thread_id').notNull(),
  authorId: varchar('author_id', { length: 36 }).notNull(),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  authorInitials: varchar('author_initials', { length: 10 }).notNull(),
  content: text('content').notNull(),
  likes: int('likes').default(0),
  isSolution: boolean('is_solution').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  // Indexes
  threadIdx: index('thread_idx').on(table.threadId),
  createdAtIdx: index('created_at_idx').on(table.createdAt),
  // Foreign keys
  threadFk: index('thread_fk').on(table.threadId),
  authorFk: index('author_fk').on(table.authorId),
}));

// Tabel thread likes
export const threadLikes = mysqlTable('thread_likes', {
  id: int('id').primaryKey().autoincrement(),
  threadId: int('thread_id').notNull(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  // Unique constraint untuk mencegah like ganda
  uniqueThreadUser: primaryKey({ columns: [table.threadId, table.userId] }),
  // Indexes
  threadIdx: index('thread_idx').on(table.threadId),
  userIdx: index('user_idx').on(table.userId),
}));

// Tabel reply likes
export const replyLikes = mysqlTable('reply_likes', {
  id: int('id').primaryKey().autoincrement(),
  replyId: int('reply_id').notNull(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  // Unique constraint untuk mencegah like ganda
  uniqueReplyUser: primaryKey({ columns: [table.replyId, table.userId] }),
  // Indexes
  replyIdx: index('reply_idx').on(table.replyId),
  userIdx: index('user_idx').on(table.userId),
}));