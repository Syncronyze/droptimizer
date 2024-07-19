import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./drizzle/*",
  out: "./drizzle",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  }
});