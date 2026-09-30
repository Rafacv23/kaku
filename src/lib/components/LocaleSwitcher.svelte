<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { getLocale, locales, localizeHref, type Locale } from '$lib/paraglide/runtime';

	// Each language is named in itself, so these are not translated.
	const names: Record<Locale, string> = { en: 'English', es: 'Español' };
</script>

<nav aria-label={m.language_label()}>
	<ul class="flex">
		{#each locales as locale (locale)}
			<li>
				<!-- A full reload, so every message on the page is rendered again in the new locale. -->
				<a
					href={localizeHref(page.url.pathname, { locale })}
					hreflang={locale}
					lang={locale}
					aria-label={names[locale]}
					aria-current={locale === getLocale() ? 'true' : undefined}
					data-sveltekit-reload
					class="grid h-11 min-w-9 place-items-center text-sm text-ink-muted transition-colors duration-(--duration-quick) hover:text-ink aria-[current]:font-bold aria-[current]:text-ink"
				>
					{locale.toUpperCase()}
				</a>
			</li>
		{/each}
	</ul>
</nav>
