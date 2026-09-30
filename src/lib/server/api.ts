import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { validator } from 'hono/validator';
import { createAuth, type AuthConfig } from './auth';
import type { Db } from './db';
import { appMeta, profile } from './db/schema';

export type AppDeps = {
	db: Db;
	/** Injected so time-dependent rules (streaks, scheduling) are testable. Never read the system clock in handlers. */
	now: () => Date;
	auth: AuthConfig;
};

const isTimeZone = (value: string) => {
	try {
		new Intl.DateTimeFormat('en', { timeZone: value });
		return true;
	} catch {
		return false;
	}
};

const profileInput = validator('json', (body, c) => {
	const { username, dailyGoal, timeZone } = body ?? {};
	const valid =
		typeof username === 'string' &&
		/^[A-Za-z0-9_]{3,20}$/.test(username) &&
		Number.isInteger(dailyGoal) &&
		dailyGoal >= 10 &&
		dailyGoal <= 500 &&
		typeof timeZone === 'string' &&
		isTimeZone(timeZone);
	if (!valid) return c.json({ error: 'invalid_profile' as const }, 400);
	return { username, dailyGoal, timeZone } as {
		username: string;
		dailyGoal: number;
		timeZone: string;
	};
});

export function createApp({ db, now, auth: authConfig }: AppDeps) {
	const auth = createAuth(db, authConfig);

	const currentUser = async (headers: Headers) =>
		(await auth.api.getSession({ headers }))?.user ?? null;

	/** Rejects anonymous requests and exposes the signed-in user to the handler. */
	const signedIn = createMiddleware<{ Variables: { user: { id: string } } }>(async (c, next) => {
		const user = await currentUser(c.req.raw.headers);
		if (!user) return c.json({ error: 'unauthorized' as const }, 401);
		c.set('user', user);
		await next();
	});

	return (
		new Hono()
			.basePath('/api')
			.on(['GET', 'POST'], '/auth/*', (c) => auth.handler(c.req.raw))
			.get('/health', async (c) => {
				const [row] = await db.select().from(appMeta).where(eq(appMeta.key, 'greeting'));
				return c.json({ status: 'ok' as const, time: now().toISOString(), message: row.value });
			})
			.get('/sign-in-methods', (c) => c.json({ google: Boolean(authConfig.google) }))
			// Open to anyone, so a page can ask who is signed in: an anonymous visitor gets null.
			.get('/me', async (c) => {
				const user = await currentUser(c.req.raw.headers);
				if (!user) return c.json(null);
				const [row] = await db
					.select({
						username: profile.username,
						dailyGoal: profile.dailyGoal,
						timeZone: profile.timeZone
					})
					.from(profile)
					.where(eq(profile.userId, user.id));
				return c.json({ email: user.email, profile: row ?? null });
			})
			.put('/me/profile', signedIn, profileInput, async (c) => {
				const values = c.req.valid('json');
				try {
					await db
						.insert(profile)
						.values({ userId: c.get('user').id, ...values })
						.onConflictDoUpdate({ target: profile.userId, set: values });
				} catch (e) {
					// The unique index decides, so two people racing for one name cannot both win.
					// The user id conflict is handled above, which leaves the username as the only unique column.
					const cause = e instanceof Error && e.cause instanceof Error ? e.cause : e;
					if (!/UNIQUE constraint failed/.test(String(cause))) throw e;
					return c.json({ error: 'username_taken' as const }, 409);
				}
				return c.json({ profile: values }, 200);
			})
	);
}

export type AppType = ReturnType<typeof createApp>;
