import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/svelte';

/** Browser client for the sign-in endpoints Better Auth serves under `/api/auth`. */
export const authClient = createAuthClient({ plugins: [emailOTPClient()] });
