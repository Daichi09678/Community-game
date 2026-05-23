import { drizzle } from 'drizzle-orm/mysql2';
import { pool } from '../mysql';
import * as schema from './schema';

export const db = drizzle(pool, { schema, mode: 'planetscale' });
export type Database = typeof db;