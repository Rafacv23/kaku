import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Skeleton tracer: proves the page -> API -> database path. Drop once a real table backs the landing page.
export const appMeta = sqliteTable('app_meta', {
	key: text('key').primaryKey(),
	value: text('value').notNull()
});
