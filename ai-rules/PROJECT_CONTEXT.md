# Project Context

This file provides guidance to AI coding agents when working with code in this
repository.

**These rules are non-negotiable - follow them exactly.**

## Project Overview

This repo is a single Home Assistant **custom integration**,
`btoddb_ha_reminders` (HACS-installable), that allows the user to set up
reminders and have Home Assistant remind them at the specified time.

The repo is based on the `integration_blueprint` dev scaffold: `config/` is a
throwaway Home Assistant instance for local testing, `scripts/` holds dev
helpers, and `requirements.txt` pins the Home Assistant and lint toolchain.

Every directory under `custom_components/` **except `btoddb_ha_reminders`** is a
**vendored third-party integration** kept only for local testing. Never modify
any of them. If any command, including `scripts/lint`, leaves changes under one
of these directories, revert them; never commit a diff outside
`btoddb_ha_reminders`.

## Implementation Details

- **Python version:** target Python version 3.14 or newer.
- **Ruff formatting:** format all Python code according to the ruff formatting
  rules.
- **Ruff linting:** make coding decisions with ruff linting rules in mind.

## Key Dev Commands

- **Run HA locally:** `scripts/develop` launches Home Assistant against
  `config/`. It runs in the foreground with `--debug` and does not return; to
  verify a change, background it and read `config/home-assistant.log`.
- **Lint:** `scripts/lint` runs ruff format plus ruff check/fix. It rewrites
  files, so expect working-tree changes after it runs.
- **Engine unit tests:** `python3 -m pytest` from the repo root. `pytest.ini`
  sets `testpaths`, and `conftest.py` inserts its own directory into `sys.path`
  so `load_module` is importable regardless of working directory.
- **Validate manifest/HACS:** `python3 -m script.hassfest` and the
  `.github/workflows/validate.yml` workflow.
- **Hassfest locally:** `scripts/validate` runs CI's Hassfest check
  (`ghcr.io/home-assistant/hassfest`) against the working tree. It requires
  Docker.
- **Build the card:** `scripts/deploy-card` builds, bumps the card version, and
  copies the generated bundle into `www/`. Edit TypeScript source at
  `custom_components/btoddb_ha_reminders/card/src/*.ts`; never hand-edit the
  generated `www/*.js` bundle.

## Versioning

There are **two independent version numbers**:

- **Integration:** `custom_components/btoddb_ha_reminders/manifest.json`
  (`"version": "vX.Y.Z"` - the leading `v` is intentional). Bumped by
  `scripts/ship` when cutting a release.
- **Card:** `custom_components/btoddb_ha_reminders/card/package.json`
  (plain `X.Y.Z`). Bumped by `scripts/deploy-card`, which also syncs the
  console banner in `card/src/index.ts`.

## Shared Pipeline

The shared `@btb` command contract is injected at runtime by
`btoddb/btb-pipeline`. Do not paste that shared workflow behavior into this
repo; copied contract text drifts as the pipeline evolves.

This repo's `.github/workflows/btb-client.yml` should stay a tiny caller of
`btoddb/btb-pipeline/.github/workflows/btb.yml@v1`. Put only local facts in
this file and the other `ai-rules` files.

## Codex Rules

- Follow every file in `ai-rules/` before editing.
- Work on a fresh branch from `main`; never edit directly on `main`.
- Preserve unrelated local edits and generated artifacts unless the task
  explicitly requires changing them.
- Run the relevant tests, lint, and validation commands before committing when
  the local environment supports them.
- Keep client repository guidance local and specific; shared `@btb` behavior
  belongs in `btoddb/btb-pipeline`.
