import { mysqlTable, varchar, text, int, timestamp, boolean, mysqlEnum } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const reports = mysqlTable('reports', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['mission', 'event', 'puzzle', 'guide', 'analysis']).notNull(),
  game: mysqlEnum('game', ['hsr', 'gi', 'zzz', 'hi3']).notNull(),
  version: varchar('version', { length: 20 }).notNull(),
  authorId: varchar('author_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }),
  authorInitials: varchar('author_initials', { length: 10 }),
  authorName: varchar('author_name', { length: 100 }), // Untuk menyimpan nama author
  content: text('content').notNull(),
  summary: text('summary'),
  tags: text('tags'),
  rating: int('rating').default(0),
  votes: int('votes').default(0),
  views: int('views').default(0),
  status: mysqlEnum('status', ['draft', 'published', 'archived', 'pending']).default('published'),
  isFeatured: boolean('is_featured').default(false),
  isPinned: boolean('is_pinned').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});