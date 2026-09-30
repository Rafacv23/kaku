# Kaku

Gamified web app for learning Japanese: kana, spaced repetition, dictionary and grammar practice.

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

## Interface

- **Languages**: Spanish and English, with the locale in the URL (`/es`, `/en`). Texts live in `messages/es.json` and `messages/en.json`; a test fails if a key is missing in either. Use them through `m.some_key()` from `$lib/paraglide/messages` and build links with `localizeHref()`.
- **Design tokens**: colour, type and motion are defined once in `src/app.css` and exposed as Tailwind utilities (`bg-paper`, `text-ink`, `font-display`). Every colour is a light/dark pair, so components never style themes themselves.
- **Base components**: `src/lib/components`, built on [Bits UI](https://bits-ui.com).

## Branches

- `dev` is the integration branch. Open pull requests against `dev`.
- `main` is what runs in production. It only receives merges from `dev`.
