<script lang="ts">
	import { Button, type ButtonRootProps } from 'bits-ui';

	type Props = ButtonRootProps & { variant?: 'primary' | 'quiet' };

	let { variant = 'primary', class: className, children, ...rest }: Props = $props();

	const variants = {
		primary: 'px-5 bg-accent text-on-accent hover:bg-ink hover:text-paper',
		quiet: 'text-ink underline decoration-rule underline-offset-4 hover:decoration-ink'
	};
</script>

<!-- Renders a link when given an href, a button otherwise. -->
<Button.Root
	class={[
		'inline-flex min-h-11 items-center font-medium transition-colors duration-(--duration-quick)',
		'disabled:cursor-not-allowed disabled:opacity-50',
		variants[variant],
		className
	]}
	{...rest}
>
	{@render children?.()}
</Button.Root>
