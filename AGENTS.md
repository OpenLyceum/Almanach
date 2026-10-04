# AGENTS.md — Almanach

Almanach is the OpenLyceum SceneryStack knowledge base: a VitePress site built from Markdown files under `docs/`, plus generated LLM artifacts. It is a `type: tool` repo in `Baton/structure/repos.json`, not a sim, so the sim-only rules (six-section README, Baton reusable CI) do not apply.

## Where things are

| Path | Purpose |
| --- | --- |
| `docs/<category>/…/*.md` | One page per file, with required frontmatter. Taxonomy and schema: [`docs/meta/authoring-guide.md`](docs/meta/authoring-guide.md) |
| `docs/public/llms.txt`, `llms-full.txt`, `manifest.json` | **Generated** by `npm run generate`. Committed; never edit by hand |
| `docs/.vitepress/` | Site config (`config.ts`, `BASE`), sidebar builder, and demos |
| `docs/.vitepress/demos/` | Runnable demos, listed in `registry.ts` and checked against their doc pages by `scripts/check-demos.ts` |
| `scripts/` | Generator, demo checks, coverage report, and the built-page checker (`check-pages.ts`) |

## Workflow

1. Add or edit a page in `docs/`; start from `docs/meta/page-template.md`.
2. Run `npm run generate` and **commit the regenerated `docs/public/` files with the page**. CI fails when the committed artifacts differ from a fresh generation. Regeneration is a no-op when nothing changed (the manifest keeps its previous `generated` timestamp).
3. Before a PR: `npm run typecheck && npm run build && npm run check:pages`.

`npm run dev` serves at base `/`; the deployed site uses `/Almanach/`. Build any in-site link from `BASE` in `docs/.vitepress/config.ts`, never a hardcoded `/Almanach/` path.

## CI

- `ci.yml` runs on branch pushes (and on pull requests from forks): generate, the stale-artifact check, demo checks, typecheck, site build, and `check:pages`.
- `deploy.yml` runs on `main`: typecheck, build, `check:pages`, then deploys to GitHub Pages.
