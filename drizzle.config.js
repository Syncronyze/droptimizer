import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './drizzle/*',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        // eslint-disable-next-line no-undef
        url: process.env.DATABASE_URL,
    },
});
