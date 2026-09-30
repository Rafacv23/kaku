import { compile } from '@inlang/paraglide-js';

// Shared by the Vite plugin and by `bun run i18n`, so both generate the same runtime.
export const paraglide = {
	project: './project.inlang',
	outdir: './src/lib/paraglide',
	strategy: ['url', 'cookie', 'preferredLanguage', 'baseLocale'],
	// Every locale gets a prefix, so a shared link always carries its language.
	urlPatterns: [
		{
			pattern: '/:path(.*)?',
			localized: [
				['es', '/es/:path(.*)?'],
				['en', '/en/:path(.*)?']
			]
		}
	]
} satisfies Parameters<typeof compile>[0];

// `bun paraglide.config.ts` generates the runtime without Vite, for type checking and linting.
if (import.meta.main) await compile(paraglide);
