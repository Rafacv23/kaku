# Kaku

English · [Español](README.es.md)

Gamified web app for learning Japanese: kana, spaced repetition, dictionary and grammar practice.

Kaku covers the beginner path up to JLPT N5 in one place, in Spanish and English: kana drills, vocabulary review with curated and personal decks, Anki deck import, an integrated dictionary, grammar practice and a curated resource list. Everything feeds one progress system with XP, levels, a daily goal, streaks, achievements and a global ranking.

Kaku is in early development; most of the above is not built yet.

## Development

Requires [Bun](https://bun.sh) and [Docker](https://docs.docker.com/get-docker/). No external accounts or secrets are needed.

```sh
bun install
bun dev
```

`bun dev` starts the local database in Docker, applies pending migrations and serves the app at http://localhost:5173.

The local database is a [libSQL server](https://github.com/tursodatabase/libsql) (SQLite, the engine Turso runs in production) listening on http://127.0.0.1:8080, with its data in a Docker volume. Stop it with `docker compose down`; add `-v` to wipe the data.

| Command               | What it does                                                  |
| --------------------- | ------------------------------------------------------------- |
| `bun dev`             | Start the database, apply migrations, start the dev server    |
| `bun test`            | Run the tests (in-memory database, Docker not needed)         |
| `bun run check`       | Type check                                                    |
| `bun run lint`        | Prettier and ESLint                                           |
| `bun run format`      | Format with Prettier                                          |
| `bun run i18n`        | Regenerate the Paraglide runtime from `messages/`             |
| `bun run db:up`       | Start the local database only                                 |
| `bun run db:generate` | Generate a migration after changing the schema                |
| `bun run db:migrate`  | Apply pending migrations to `DATABASE_URL` (local by default) |

Production uses Turso: set `DATABASE_URL` and `DATABASE_AUTH_TOKEN`.

### Accounts

Sign-in uses [Better Auth](https://better-auth.com) with Google and a one-time email code. Locally nothing needs configuring: the email code is printed to the terminal running `bun dev`, and the Google button is hidden.

| Variable                                      | Outside local development                                   |
| --------------------------------------------- | ----------------------------------------------------------- |
| `BETTER_AUTH_SECRET`                          | Required. Signs sessions; generate a long random value      |
| `BETTER_AUTH_URL`                             | Public origin of the app, for example `https://example.com` |
| `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` | Enable Google sign-in when both are set                     |

## Interface

- **Languages**: Spanish and English, with the locale in the URL (`/es`, `/en`). Texts live in `messages/es.json` and `messages/en.json`; a test fails if a key is missing in either. Use them through `m.some_key()` from `$lib/paraglide/messages` and build links with `localizeHref()`.
- **Design tokens**: colour, type and motion are defined once in `src/app.css` and exposed as Tailwind utilities (`bg-paper`, `text-ink`, `font-display`). Every colour is a light/dark pair, so components never style themes themselves.
- **Base components**: `src/lib/components`, built on [Bits UI](https://bits-ui.com).

## Contributing

Bug reports, content fixes and pull requests are welcome. Read the [contributing guide](CONTRIBUTING.md) and the [code of conduct](CODE_OF_CONDUCT.md) first.

- `dev` is the integration branch. Open pull requests against `dev`.
- `main` is what runs in production. It only receives merges from `dev`.

## Licence

The code is licensed under [AGPL-3.0](LICENSE). Kaku's own content is CC BY-NC-SA 4.0, and data derived from JMdict and KANJIDIC stays CC BY-SA 4.0. See [NOTICE.md](NOTICE.md) for details and attribution.
