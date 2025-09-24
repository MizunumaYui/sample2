
import { neon } from "@neondatabase/serverless";
// Neon のクライアントをそのままエクスポート
export const sql = neon(process.env.DATABASE_URL!);


/*
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
*/