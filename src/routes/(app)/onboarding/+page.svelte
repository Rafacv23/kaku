<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiClient } from '$lib/api';
	import Button from '$lib/components/Button.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import { m } from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { onMount } from 'svelte';

	const goals = [
		{ xp: 20, name: m.onboarding_goal_relaxed },
		{ xp: 50, name: m.onboarding_goal_regular },
		{ xp: 100, name: m.onboarding_goal_intense }
	];

	let username = $state('');
	let dailyGoal = $state(50);
	let timeZone = $state('');
	let busy = $state(false);
	let taken = $state(false);
	let failed = $state(false);

	// The browser knows the visitor's time zone; the server does not.
	onMount(() => {
		timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	});

	async function save(event: SubmitEvent) {
		event.preventDefault();
		busy = true;
		taken = failed = false;
		try {
			const res = await apiClient(fetch).api.me.profile.$put({
				json: { username, dailyGoal, timeZone }
			});
			if (res.ok) return await goto(localizeHref('/home'), { invalidateAll: true });
			taken = res.status === 409;
			failed = !taken;
		} catch {
			failed = true;
		} finally {
			busy = false;
		}
	}
</script>

<svelte:head>
	<title>{m.onboarding_title()}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="max-w-prose py-14 md:py-20">
	<h1 class="font-display text-2xl leading-tight">{m.onboarding_title()}</h1>
	<p class="mt-3 text-ink-muted">{m.onboarding_lead()}</p>

	<form onsubmit={save} class="mt-8">
		<TextField
			label={m.onboarding_username_label()}
			bind:value={username}
			hint={m.onboarding_username_hint()}
			error={taken ? m.onboarding_username_taken() : undefined}
			required
			pattern="[A-Za-z0-9_]+"
			minlength={3}
			maxlength={20}
			autocomplete="username"
			autocapitalize="none"
			spellcheck="false"
			class="max-w-sm"
		/>

		<fieldset class="mt-8">
			<legend class="font-medium">{m.onboarding_goal_label()}</legend>
			<p class="mt-1 text-sm text-ink-muted">{m.onboarding_goal_hint()}</p>
			<div class="mt-3 flex flex-wrap gap-3">
				{#each goals as goal (goal.xp)}
					<label
						class="flex min-h-11 cursor-pointer items-center gap-3 border border-ink-muted bg-paper-raised px-4 py-2 has-checked:border-accent has-checked:outline has-checked:outline-accent has-focus-visible:outline-2 has-focus-visible:outline-offset-3"
					>
						<input
							type="radio"
							name="dailyGoal"
							value={goal.xp}
							bind:group={dailyGoal}
							class="accent-accent outline-none"
						/>
						<span>
							<span class="block font-medium">{goal.name()}</span>
							<span class="block text-sm text-ink-muted">
								{m.onboarding_goal_xp({ xp: goal.xp })}
							</span>
						</span>
					</label>
				{/each}
			</div>
		</fieldset>

		{#if timeZone}
			<p class="mt-8 text-sm text-ink-muted">{m.onboarding_time_zone({ timeZone })}</p>
		{/if}
		{#if failed}
			<p role="alert" class="mt-6 text-seal">{m.error_generic()}</p>
		{/if}
		<!-- Disabled until the time zone is known, which is as soon as the page is interactive. -->
		<Button type="submit" disabled={busy || !timeZone} class="mt-6">{m.onboarding_submit()}</Button>
	</form>
</section>
