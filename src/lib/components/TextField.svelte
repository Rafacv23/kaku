<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = Omit<HTMLInputAttributes, 'value'> & {
		label: string;
		value: string;
		hint?: string;
		error?: string;
	};

	let { label, value = $bindable(), hint, error, class: className, ...rest }: Props = $props();

	const id = $props.id();
</script>

<div class={className}>
	<label for={id} class="block font-medium">{label}</label>
	<input
		{id}
		bind:value
		aria-describedby={error || hint ? `${id}-note` : undefined}
		aria-invalid={error ? 'true' : undefined}
		class="mt-1 h-11 w-full border border-ink-muted bg-paper-raised px-3 aria-invalid:border-seal"
		{...rest}
	/>
	{#if error}
		<p id="{id}-note" role="alert" class="mt-1 text-sm text-seal">{error}</p>
	{:else if hint}
		<p id="{id}-note" class="mt-1 text-sm text-ink-muted">{hint}</p>
	{/if}
</div>
