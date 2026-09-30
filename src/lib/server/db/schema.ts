import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

// Skeleton tracer: proves the page -> API -> database path. Drop once a real table backs the landing page.
export const appMeta = sqliteTable('app_meta', {
	key: text('key').primaryKey(),
	value: text('value').notNull()
});

const timestamp = (name: string) => integer(name, { mode: 'timestamp_ms' });
const timestamps = {
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
};

// user, session, account and verification are owned by Better Auth: their columns follow its core schema.
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
	image: text('image'),
	...timestamps
});

const userId = () =>
	text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' });

export const session = sqliteTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: timestamp('expires_at').notNull(),
		token: text('token').notNull().unique(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: userId(),
		...timestamps
	},
	(t) => [index('session_user_id_idx').on(t.userId)]
);

export const account = sqliteTable(
	'account',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: userId(),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at'),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
		scope: text('scope'),
		password: text('password'),
		...timestamps
	},
	(t) => [index('account_user_id_idx').on(t.userId)]
);

export const verification = sqliteTable(
	'verification',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		...timestamps
	},
	(t) => [index('verification_identifier_idx').on(t.identifier)]
);

/** What Kaku knows about a user beyond their sign-in. It exists once onboarding is done. */
export const profile = sqliteTable(
	'profile',
	{
		userId: userId().primaryKey(),
		username: text('username').notNull(),
		dailyGoal: integer('daily_goal').notNull(),
		timeZone: text('time_zone').notNull()
	},
	// "Hanako" and "hanako" are the same public name.
	(t) => [uniqueIndex('profile_username_unique').on(sql`lower(${t.username})`)]
);
