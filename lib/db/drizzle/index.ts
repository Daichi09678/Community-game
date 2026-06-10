import { drizzle } from 'drizzle-orm/mysql2';
import { pool } from '../mysql';
import * as schema from './schema';

// Mode 'default' lebih stabil untuk MySQL biasa
export const db = drizzle(pool, { schema, mode: 'default' });
export type Database = typeof db;