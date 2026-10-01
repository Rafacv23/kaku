import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { createApp } from '$lib/server/api';
import { openDb } from '$lib/server/db';
import type { RequestHandler } from './$types';

function build(origin: string) {
	// Local development needs no configuration; anywhere else a missing secret must not fall back to a known one.
	const secret = env.BETTER_AUTH_SECRET ?? (dev ? 'kaku-local-development-only-secret' : undefined);
	if (!secret) throw new Error('BETTER_AUTH_SECRET is not set');

	return createApp({
		db: openDb(env.DATABASE_URL ?? 'http://127.0.0.1:8080', env.DATABASE_AUTH_TOKEN),
		now: () => new Date(),
		auth: {
			secret,
			baseURL: env.BETTER_AUTH_URL ?? (dev ? origin : undefined),
			google:
				env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
					? { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET }
					: undefined,
			sendSignInCode: async (email, code) => {
				// ponytail: no email provider yet, so codes are only delivered in development. Wire one in with production (#4).
				if (!dev) throw new Error('Email delivery is not configured');
				console.log(`\n  Sign-in code for ${email}: ${code}\n`);
			}
		}
	});
}

// Built on the first request, so `vite build` can load this module without any configuration.
let app: ReturnType<typeof build> | undefined;

export const fallback: RequestHandler = ({ request, url }) =>
	(app ??= build(url.origin)).fetch(request);
