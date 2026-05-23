import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/drizzle/schema/index.ts',
  out: './lib/db/drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});