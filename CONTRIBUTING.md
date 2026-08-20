# Contributing to Mentr

Thanks for considering a contribution! This project is open source and welcomes pull requests, bug reports, and ideas.

## Getting set up

Follow the [Getting started](./README.md#getting-started) section of the README to get a local dev environment running.

## Workflow

1. Fork the repo and create a branch from `main`: `git checkout -b my-fix`.
2. Make your changes. Keep pull requests focused — one fix or feature per PR.
3. Run `npm run lint` and make sure `npm run build` succeeds before opening a PR.
4. Write a clear PR description: what changed and why. Link any related issue.
5. Be responsive to review feedback — small, iterative changes are easier to merge than large ones.

## Reporting bugs

Open a [GitHub issue](../../issues) with:

- Steps to reproduce
- What you expected vs. what happened
- Relevant logs, screenshots, or environment details (OS, Node version)

## Reporting security issues

Do **not** open a public issue for security vulnerabilities — see [SECURITY.md](./SECURITY.md).

## Code style

- TypeScript throughout; keep new code typed (avoid `any` where practical).
- Follow existing patterns in `src/` and `server/` rather than introducing new conventions.
- Run `npm run lint` before submitting.

## Commit messages

Keep commit messages short and descriptive of the "why", not just the "what".
