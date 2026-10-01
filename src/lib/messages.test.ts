import { expect, test } from 'bun:test';
import settings from '../../project.inlang/settings.json';

const load = async (locale: string): Promise<Record<string, string>> => {
	const messages = await Bun.file(`messages/${locale}.json`).json();
	delete messages.$schema;
	return messages;
};

test('every locale translates every message', async () => {
	const base = Object.keys(await load(settings.baseLocale)).sort();
	expect(base.length).toBeGreaterThan(0);

	for (const locale of settings.locales) {
		const messages = await load(locale);
		expect(Object.keys(messages).sort(), locale).toEqual(base);
		for (const [key, value] of Object.entries(messages)) {
			expect(value.trim(), `${locale}: ${key}`).not.toBe('');
		}
	}
});
