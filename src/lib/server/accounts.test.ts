import { expect, test } from 'bun:test';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { createApp } from './api';
import { openDb } from './db';

const origin = 'http://localhost';

async function setup() {
	const db = openDb(':memory:');
	await migrate(db, { migrationsFolder: 'drizzle' });
	const codes = new Map<string, string>();
	const app = createApp({
		db,
		now: () => new Date('2026-01-02T03:04:05Z'),
		auth: {
			secret: 'test-secret-test-secret-test-secret',
			baseURL: origin,
			sendSignInCode: async (email, code) => void codes.set(email, code)
		}
	});

	const json = (path: string, method: string, body: unknown, cookie = '') =>
		app.request(path, {
			method,
			headers: { 'content-type': 'application/json', origin, cookie },
			body: JSON.stringify(body)
		});

	/** Signs in with an email one-time code, as a visitor would, and returns the session cookie. */
	async function signIn(email: string) {
		await json('/api/auth/email-otp/send-verification-otp', 'POST', { email, type: 'sign-in' });
		const res = await json('/api/auth/sign-in/email-otp', 'POST', { email, otp: codes.get(email) });
		expect(res.status).toBe(200);
		return res.headers
			.getSetCookie()
			.map((c) => c.split(';')[0])
			.join('; ');
	}

	return { app, json, signIn };
}

test('anonymous requests to signed-in-only endpoints are rejected', async () => {
	const { json } = await setup();
	const profile = { username: 'hanako', dailyGoal: 50, timeZone: 'Europe/Madrid' };

	const res = await json('/api/me/profile', 'PUT', profile);

	expect(res.status).toBe(401);
});

test('an anonymous visitor asking who they are is told nobody', async () => {
	const { app } = await setup();

	const res = await app.request('/api/me');

	expect(res.status).toBe(200);
	expect(await res.json()).toBeNull();
});

test('a new user has no profile until they onboard with a username, daily goal and time zone', async () => {
	const { app, json, signIn } = await setup();
	const cookie = await signIn('hanako@example.com');
	const me = async () => (await app.request('/api/me', { headers: { cookie } })).json();

	expect(await me()).toEqual({ email: 'hanako@example.com', profile: null });

	const profile = { username: 'hanako', dailyGoal: 50, timeZone: 'Europe/Madrid' };
	const res = await json('/api/me/profile', 'PUT', profile, cookie);

	expect(res.status).toBe(200);
	expect(await me()).toEqual({ email: 'hanako@example.com', profile });
});

test('a username already taken by another user is refused, whatever its letter case', async () => {
	const { app, json, signIn } = await setup();
	const hanako = await signIn('hanako@example.com');
	const taro = await signIn('taro@example.com');
	const profile = { username: 'hanako', dailyGoal: 50, timeZone: 'Europe/Madrid' };
	await json('/api/me/profile', 'PUT', profile, hanako);

	const res = await json('/api/me/profile', 'PUT', { ...profile, username: 'Hanako' }, taro);

	expect(res.status).toBe(409);
	expect(await res.json()).toEqual({ error: 'username_taken' });
	const me = await app.request('/api/me', { headers: { cookie: taro } });
	expect(await me.json()).toEqual({ email: 'taro@example.com', profile: null });

	// The owner can keep their own name while changing something else.
	const own = await json('/api/me/profile', 'PUT', { ...profile, dailyGoal: 100 }, hanako);
	expect(own.status).toBe(200);
});

test('onboarding refuses a malformed username, goal or time zone', async () => {
	const { app, json, signIn } = await setup();
	const cookie = await signIn('hanako@example.com');
	const valid = { username: 'hanako', dailyGoal: 50, timeZone: 'Europe/Madrid' };

	for (const bad of [
		{ username: 'ab' },
		{ username: 'has space' },
		{ username: 'a'.repeat(21) },
		{ dailyGoal: 0 },
		{ dailyGoal: 12.5 },
		{ dailyGoal: '50' },
		{ timeZone: 'Mars/Olympus' },
		{ timeZone: undefined }
	]) {
		const res = await json('/api/me/profile', 'PUT', { ...valid, ...bad }, cookie);
		expect(res.status, JSON.stringify(bad)).toBe(400);
	}

	const me = await app.request('/api/me', { headers: { cookie } });
	expect(await me.json()).toEqual({ email: 'hanako@example.com', profile: null });
});

test('signing out ends the session', async () => {
	const { app, json, signIn } = await setup();
	const cookie = await signIn('hanako@example.com');

	const res = await json('/api/auth/sign-out', 'POST', {}, cookie);

	expect(res.status).toBe(200);
	expect(await (await app.request('/api/me', { headers: { cookie } })).json()).toBeNull();
	const profile = { username: 'hanako', dailyGoal: 50, timeZone: 'Europe/Madrid' };
	expect((await json('/api/me/profile', 'PUT', profile, cookie)).status).toBe(401);
});
