import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import type { Db } from './db';
import { appMeta } from './db/schema';

export type AppDeps = {
	db: Db;
	/** Injected so time-dependent rules (streaks, scheduling) are testable. Never read the system clock in handlers. */
	now: () => Date;
};

export function createApp({ db, now }: AppDeps) {
	return new Hono().basePath('/api').get('/health', async (c) => {
		const [row] = await db.select().from(appMeta).where(eq(appMeta.key, 'greeting'));
		return c.json({ status: 'ok' as const, time: now().toISOString(), message: row.value });
	});
}

export type AppType = ReturnType<typeof createApp>;
