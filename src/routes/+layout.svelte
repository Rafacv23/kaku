<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import favicon from '$lib/assets/favicon.svg';
	import Button from '$lib/components/Button.svelte';
	import LocaleSwitcher from '$lib/components/LocaleSwitcher.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { m } from '$lib/paraglide/messages';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	let { data, children } = $props();

	const repo = 'https://github.com/Rafacv23/kaku';
	const home = $derived(localizeHref('/'));
	const links = $derived([
		{ href: `${home}#modules`, label: m.nav_modules() },
		{ href: `${home}#progress`, label: m.nav_progress() },
		{ href: repo, label: m.nav_source() }
	]);

	async function signOut() {
		await authClient.signOut();
		await goto(home, { invalidateAll: true });
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="canonical" href={new URL(localizeHref(page.url.pathname), page.url.origin).href} />
	{#each locales as locale (locale)}
		<link
			rel="alternate"
			hreflang={locale}
			href={new URL(localizeHref(page.url.pathname, { locale }), page.url.origin).href}
		/>
	{/each}
</svelte:head>

<a
	href="#content"
	class="sr-only bg-paper-raised px-4 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10"
>
	{m.skip_to_content()}
</a>

<div class="mx-auto flex min-h-dvh max-w-page flex-col px-5 sm:px-8">
	<!-- ponytail: the nav wraps to its own row on narrow screens; swap for a menu when it outgrows one row. -->
	<header class="flex flex-wrap items-center gap-x-6 border-b border-rule py-3">
		<a href={home} class="mr-auto flex items-center gap-2.5 font-display text-xl font-bold">
			<span lang="ja" aria-hidden="true" class="grid size-8 place-items-center bg-seal text-paper">
				書
			</span>
			Kaku
		</a>
		<nav aria-label={m.nav_label()} class="order-last w-full md:order-none md:w-auto">
			<ul class="-mx-2 flex flex-wrap">
				{#each links as link (link.href)}
					<li>
						<a
							href={link.href}
							class="flex h-11 items-center px-2 text-ink-muted transition-colors duration-(--duration-quick) hover:text-ink md:px-3"
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="flex items-center gap-1">
			{#if data.me}
				<Button variant="quiet" onclick={signOut} class="mr-2">{m.nav_sign_out()}</Button>
			{:else}
				<Button variant="quiet" href={localizeHref('/sign-in')} class="mr-2">
					{m.nav_sign_in()}
				</Button>
			{/if}
			<LocaleSwitcher />
			<ThemeToggle />
		</div>
	</header>

	<main id="content" class="grow">
		{@render children()}
	</main>

	<footer class="border-t border-rule py-6 text-sm text-ink-muted">
		<p>{m.footer_license()}</p>
	</footer>
</div>
