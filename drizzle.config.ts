import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'turso',
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dbCredentials: {
		url: process.env.DATABASE_URL ?? 'http://127.0.0.1:8080',
		authToken: process.env.DATABASE_AUTH_TOKEN
	}
});
