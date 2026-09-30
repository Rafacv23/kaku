<script lang="ts">
	import { Toggle } from 'bits-ui';
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages';

	let dark = $state(false);

	onMount(() => {
		// app.html has already applied a saved theme; without one the system preference rules.
		const saved = document.documentElement.dataset.theme;
		dark = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
	});

	function apply(pressed: boolean) {
		const theme = pressed ? 'dark' : 'light';
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('theme', theme);
		} catch {
			// Storage is unavailable (private mode): the choice lasts for this page only.
		}
	}
</script>

<Toggle.Root
	bind:pressed={dark}
	onPressedChange={apply}
	aria-label={m.theme_dark()}
	title={m.theme_dark()}
	class="grid size-11 place-items-center text-ink-muted transition-colors duration-(--duration-quick) hover:text-ink"
>
	<svg viewBox="0 0 20 20" class="size-5" aria-hidden="true">
		<circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" stroke-width="1.5" />
		<path d="M10 2.75a7.25 7.25 0 0 1 0 14.5z" fill="currentColor" />
	</svg>
</Toggle.Root>
