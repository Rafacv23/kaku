import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { emailOTP } from 'better-auth/plugins';
import type { Db } from './db';
import * as schema from './db/schema';

export type AuthConfig = {
	secret: string;
	/** Public origin of the app. Left out, Better Auth takes it from the request. */
	baseURL?: string;
	/** Google sign-in is offered only when credentials are configured. */
	google?: { clientId: string; clientSecret: string };
	/** Delivers the one-time sign-in code. Local development prints it; production sends an email. */
	sendSignInCode: (email: string, code: string) => Promise<void>;
};

export function createAuth(db: Db, { secret, baseURL, google, sendSignInCode }: AuthConfig) {
	return betterAuth({
		secret,
		baseURL,
		database: drizzleAdapter(db, { provider: 'sqlite', schema }),
		socialProviders: google ? { google } : {},
		plugins: [
			emailOTP({
				storeOTP: 'hashed',
				sendVerificationOTP: ({ email, otp }) => sendSignInCode(email, otp)
			})
		]
	});
}
