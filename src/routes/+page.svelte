<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { m } from '$lib/paraglide/messages';

	const modules = [
		{ ja: 'かな', name: m.module_kana_name, body: m.module_kana_body },
		{ ja: '復習', reading: 'ふくしゅう', name: m.module_review_name, body: m.module_review_body },
		{
			ja: '辞書',
			reading: 'じしょ',
			name: m.module_dictionary_name,
			body: m.module_dictionary_body
		},
		{ ja: '取り込み', reading: 'とりこみ', name: m.module_import_name, body: m.module_import_body },
		{ ja: '文法', reading: 'ぶんぽう', name: m.module_grammar_name, body: m.module_grammar_body },
		{
			ja: '資料',
			reading: 'しりょう',
			name: m.module_resources_name,
			body: m.module_resources_body
		}
	];

	// A sheet of genkō yōshi, written top to bottom in its rightmost column.
	const columns = [[], [], ['書', 'く']];
	const rows = 4;
</script>

<svelte:head>
	<title>Kaku: {m.hero_title()}</title>
	<meta name="description" content={m.site_description()} />
</svelte:head>

<section class="grid items-center gap-x-16 gap-y-12 py-14 md:grid-cols-[1fr_auto] md:py-24">
	<div class="max-w-prose">
		<h1 class="font-display text-3xl leading-[1.15] text-balance md:text-4xl">
			{m.hero_title()}
		</h1>
		<p class="mt-6 text-lg text-ink-muted">{m.hero_lead()}</p>
		<Button href="#modules" class="mt-8">{m.hero_cta()}</Button>
	</div>

	<figure class="[--cell:clamp(4rem,11vw,7.5rem)]">
		<div
			lang="ja"
			aria-hidden="true"
			class="flex w-fit gap-px border-2 border-rule bg-rule font-display"
		>
			{#each columns as column, c (c)}
				<div class="grid gap-px">
					{#each { length: rows }, r (r)}
						<div class="grid size-(--cell) place-items-center bg-paper-raised">
							{#if column[r]}
								<span
									class="animate-ink text-[calc(var(--cell)*0.7)] leading-none"
									style:animation-delay="{r * 350}ms"
								>
									{column[r]}
								</span>
							{/if}
						</div>
					{/each}
				</div>
				<!-- The narrow strip beside each column is where readings are written. -->
				<div class="w-[calc(var(--cell)*0.3)] bg-paper-raised">
					{#if column.length}
						<div class="grid h-(--cell) place-items-center">
							<span
								class="animate-ink text-[calc(var(--cell)*0.2)] leading-none text-seal [animation-delay:700ms]"
							>
								か
							</span>
						</div>
					{/if}
				</div>
			{/each}
		</div>
		<figcaption class="mt-3 text-sm text-ink-muted">{m.hero_sheet_caption()}</figcaption>
	</figure>
</section>

<section id="modules" class="border-t border-rule py-14 md:py-20">
	<div class="max-w-prose">
		<h2 class="font-display text-2xl leading-tight">{m.modules_title()}</h2>
		<p class="mt-3 text-ink-muted">{m.modules_lead()}</p>
	</div>
	<ol class="mt-10">
		{#each modules as module (module.ja)}
			<li class="grid gap-x-10 gap-y-2 border-t border-rule py-6 sm:grid-cols-[11rem_1fr]">
				<p lang="ja" aria-hidden="true" class="font-display text-2xl leading-[1.6]">
					{#if module.reading}
						<ruby>{module.ja}<rt>{module.reading}</rt></ruby>
					{:else}
						{module.ja}
					{/if}
				</p>
				<div class="max-w-prose">
					<h3 class="text-lg font-bold">{module.name()}</h3>
					<p class="mt-1 text-ink-muted">{module.body()}</p>
				</div>
			</li>
		{/each}
	</ol>
</section>

<section id="progress" class="border-t border-rule py-14 md:py-20">
	<div class="max-w-prose">
		<h2 class="font-display text-2xl leading-tight">{m.progress_title()}</h2>
		<p class="mt-3 text-ink-muted">{m.progress_body()}</p>
	</div>
</section>

<section class="border-t border-rule py-14 md:py-20">
	<div class="max-w-prose">
		<h2 class="font-display text-2xl leading-tight">{m.status_title()}</h2>
		<p class="mt-3 text-ink-muted">{m.status_body()}</p>
		<Button href="https://github.com/Rafacv23/kaku" variant="quiet" class="mt-4">
			{m.status_cta()}
		</Button>
	</div>
</section>
