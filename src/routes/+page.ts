import { apiClient } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await apiClient(fetch).api.health.$get();
	return { health: await res.json() };
};
