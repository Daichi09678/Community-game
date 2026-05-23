import { mysqlTable, varchar, int, timestamp, boolean } from 'drizzle-orm/mysql-core';

export const otpCodes = mysqlTable('otp_codes', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  isUsed: boolean('is_used').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});