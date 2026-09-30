# Contributing to Kaku

Thanks for helping. Code, commits, issues and docs are written in English. By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Local setup

You need [Bun](https://bun.sh) and [Docker](https://docs.docker.com/get-docker/). No external accounts or secrets are needed.

```sh
bun install
bun dev
```

`bun dev` starts the local database in Docker, applies pending migrations and serves the app at http://localhost:5173. The [README](README.md#development) lists the other commands.

## Reporting

Open an [issue](https://github.com/Rafacv23/kaku/issues/new/choose) and pick the form that fits: bug, feature proposal or content error. For anything larger than a small fix, open an issue before writing code so the approach can be agreed first.

## Pull requests

1. Branch from `dev` and open the pull request against `dev`. The maintainer promotes `dev` to `staging` to verify it against the staging database, and `staging` to `main`, which is production. Pull requests against `staging` or `main` from any other branch fail CI.
2. Before pushing, run what CI runs:

   ```sh
   bun run check
   bun run lint
   bun test
   bun run build
   ```

3. CI must pass before review. Behaviour changes come with a test.
4. Pull requests into `dev` are squash merged, so the pull request title becomes the commit message. Write it in English, in the imperative ("Add kana timed mode").

## Contributor License Agreement

Your first pull request needs a signed Contributor License Agreement (CLA). A bot comments on the pull request with the agreement and how to sign it; it cannot be merged until you do. You sign once and it covers your later contributions.

The CLA lets the maintainer relicense the project and publish it in app stores whose terms are incompatible with the AGPL. You keep the copyright of your contribution.

## Licensing

Code contributions are licensed under AGPL-3.0 and content contributions under CC BY-NC-SA 4.0. See [NOTICE.md](NOTICE.md).
