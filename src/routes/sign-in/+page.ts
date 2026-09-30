import { redirect } from '@sveltejs/kit';
import { apiClient } from '$lib/api';
import { localizeHref } from '$lib/paraglide/runtime';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { me } = await parent();
	if (me) redirect(307, localizeHref('/home'));

	const res = await apiClient(fetch).api['sign-in-methods'].$get();
	return { methods: await res.json() };
};
