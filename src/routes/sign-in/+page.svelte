<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import Button from '$lib/components/Button.svelte';
	import TextField from '$lib/components/TextField.svelte';
	import { m } from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { data } = $props();

	let email = $state('');
	let code = $state('');
	let sent = $state(false);
	let busy = $state(false);
	let error = $state('');

	// New users have no profile yet: the signed-in area sends them to onboarding.
	const next = localizeHref('/home');

	async function run(action: () => Promise<string | void>) {
		busy = true;
		error = '';
		try {
			error = (await action()) ?? '';
		} catch {
			error = m.error_generic();
		}
		busy = false;
	}

	const sendCode = (event: SubmitEvent) => {
		event.preventDefault();
		return run(async () => {
			const res = await authClient.emailOtp.sendVerificationOtp({ email, type: 'sign-in' });
			if (res.error) return m.error_generic();
			sent = true;
		});
	};

	const verify = (event: SubmitEvent) => {
		event.preventDefault();
		return run(async () => {
			const res = await authClient.signIn.emailOtp({ email, otp: code.trim() });
			if (res.error) return m.sign_in_error_code();
			await goto(next, { invalidateAll: true });
		});
	};

	const google = () =>
		run(async () => {
			const res = await authClient.signIn.social({ provider: 'google', callbackURL: next });
			if (res.error) return m.error_generic();
		});

	function changeEmail() {
		sent = false;
		code = '';
		error = '';
	}
</script>

<svelte:head>
	<title>{m.sign_in_title()}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="max-w-sm py-14 md:py-20">
	<h1 class="font-display text-2xl leading-tight">{m.sign_in_title()}</h1>
	<p class="mt-3 text-ink-muted">{m.sign_in_lead()}</p>

	{#if sent}
		<form onsubmit={verify} class="mt-8">
			<p>{m.sign_in_code_sent({ email })}</p>
			<!-- Focused on arrival: the visitor just asked for this code, typing it is the only next step. -->
			<TextField
				label={m.sign_in_code_label()}
				bind:value={code}
				{error}
				required
				autofocus
				inputmode="numeric"
				autocomplete="one-time-code"
				maxlength={6}
				class="mt-6"
			/>
			<div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
				<Button type="submit" disabled={busy}>{m.sign_in_verify()}</Button>
				<Button variant="quiet" onclick={changeEmail}>{m.sign_in_change_email()}</Button>
			</div>
		</form>
	{:else}
		{#if data.methods.google}
			<Button onclick={google} disabled={busy} class="mt-8 w-full justify-center">
				{m.sign_in_google()}
			</Button>
		{/if}
		<form
			onsubmit={sendCode}
			class={data.methods.google ? 'mt-8 border-t border-rule pt-8' : 'mt-8'}
		>
			<TextField
				label={m.sign_in_email_label()}
				bind:value={email}
				{error}
				required
				type="email"
				autocomplete="email"
			/>
			<Button type="submit" disabled={busy} class="mt-6">{m.sign_in_send_code()}</Button>
		</form>
	{/if}
</section>
