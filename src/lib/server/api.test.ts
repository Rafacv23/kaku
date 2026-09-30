import { expect, test } from 'bun:test';
import { createApp } from './api';
import { openDb } from './db';
import { migrate } from 'drizzle-orm/libsql/migrator';

test('health reports the injected time and a message read from the database', async () => {
	const db = openDb(':memory:');
	await migrate(db, { migrationsFolder: 'drizzle' });
	const app = createApp({ db, now: () => new Date('2026-01-02T03:04:05Z') });

	const res = await app.request('/api/health');

	expect(res.status).toBe(200);
	expect(await res.json()).toEqual({
		status: 'ok',
		time: '2026-01-02T03:04:05.000Z',
		message: 'ようこそ'
	});
});
