# Kaku

Gamified web app for learning Japanese: kana, spaced repetition, dictionary and grammar practice.

## Development

Requires [Bun](https://bun.sh). No external accounts or secrets are needed.

```sh
bun install
bun dev
```

`bun dev` applies pending migrations to a local SQLite file (`local.db`) and starts the app at http://localhost:5173.

| Command               | What it does                                                |
| --------------------- | ----------------------------------------------------------- |
| `bun dev`             | Apply migrations and start the dev server                   |
| `bun test`            | Run the tests                                               |
| `bun run check`       | Type check                                                  |
| `bun run lint`        | Prettier and ESLint                                         |
| `bun run format`      | Format with Prettier                                        |
| `bun run db:generate` | Generate a migration after changing the schema              |
| `bun run db:migrate`  | Apply pending migrations (`DATABASE_URL`, local by default) |

Set `DATABASE_URL` and `DATABASE_AUTH_TOKEN` to point at a Turso database instead of the local file.
