import { env } from '$env/dynamic/private';
import { createApp } from '$lib/server/api';
import { openDb } from '$lib/server/db';
import type { RequestHandler } from './$types';

const app = createApp({
	db: openDb(env.DATABASE_URL ?? 'file:local.db', env.DATABASE_AUTH_TOKEN),
	now: () => new Date()
});

export const fallback: RequestHandler = ({ request }) => app.fetch(request);
