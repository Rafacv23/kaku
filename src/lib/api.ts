import { hc } from 'hono/client';
import type { AppType } from './server/api';

/** Typed client for the Hono API. Pass SvelteKit's `fetch` from a load function so it works during SSR. */
export const apiClient = (fetch: typeof globalThis.fetch) => hc<AppType>('/', { fetch });
