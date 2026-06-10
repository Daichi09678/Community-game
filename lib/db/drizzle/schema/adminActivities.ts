import { mysqlTable, varchar, text, timestamp, int } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const adminActivities = mysqlTable('admin_activities', {
  id: int('id').primaryKey().autoincrement(),
  adminId: varchar('admin_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  actionType: varchar('action_type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  targetType: varchar('target_type', { length: 50 }),
  targetId: varchar('target_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});