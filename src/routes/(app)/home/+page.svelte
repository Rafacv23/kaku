<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	let { data } = $props();

	// The group layout only lets onboarded users through.
	const profile = $derived(data.me.profile!);
</script>

<svelte:head>
	<title>Kaku</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="max-w-prose py-14 md:py-20">
	<h1 class="font-display text-2xl leading-tight">
		{m.home_title({ username: profile.username })}
	</h1>
	<p class="mt-3">{m.home_goal({ xp: profile.dailyGoal })}</p>
	<p class="mt-3 text-ink-muted">{m.home_body()}</p>
</section>
