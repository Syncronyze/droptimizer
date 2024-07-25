'use server';
import { neon } from '@neondatabase/serverless';
import { classes } from '@tables';
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export async function getData() {
    const results = await db.select().from(classes);
    console.log(results);
    return results;
}
