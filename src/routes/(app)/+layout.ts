import { redirect } from '@sveltejs/kit';
import { deLocalizeUrl, localizeHref } from '$lib/paraglide/runtime';
import type { LayoutLoad } from './$types';

// Everything in this group requires a signed-in user who has finished onboarding.
export const load: LayoutLoad = async ({ parent, url }) => {
	const { me } = await parent();
	if (!me) redirect(307, localizeHref('/sign-in'));

	const onboarding = deLocalizeUrl(url).pathname === '/onboarding';
	if (!me.profile && !onboarding) redirect(307, localizeHref('/onboarding'));
	if (me.profile && onboarding) redirect(307, localizeHref('/home'));

	return { me };
};
