import { mysqlTable, varchar, int, timestamp, text, mysqlEnum } from 'drizzle-orm/mysql-core';


// Tabel puzzles
export const puzzles = mysqlTable('puzzles', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 200 }).notNull(),
  game: mysqlEnum('game', ['hsr', 'gi', 'zzz', 'hi3']).notNull(),
  difficulty: mysqlEnum('difficulty', ['easy', 'medium', 'hard']).notNull(),
  type: mysqlEnum('type', ['riddle', 'cipher', 'lore-quiz', 'sequence']).notNull(),
  question: text('question').notNull(),
  options: text('options'), // JSON string untuk multiple choice
  answer: varchar('answer', { length: 100 }).notNull(),
  hint: text('hint').notNull(),
  lore: text('lore').notNull(),
  points: int('points').default(100),
  solvedBy: int('solved_by').default(0),
  timeLimit: int('time_limit').default(0),
  orderIndex: int('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabel user_puzzles untuk melacak puzzle yang sudah diselesaikan user
export const userPuzzles = mysqlTable('user_puzzles', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  puzzleId: int('puzzle_id').notNull(),
  status: mysqlEnum('status', ['solved', 'failed']).default('solved'),
  solvedAt: timestamp('solved_at').defaultNow(),
});