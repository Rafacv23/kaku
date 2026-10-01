import { apiClient } from '$lib/api';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	// Null for an anonymous visitor: every page can tell who, if anyone, is signed in.
	const res = await apiClient(fetch).api.me.$get();
	return { me: await res.json() };
};
