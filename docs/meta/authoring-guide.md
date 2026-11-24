---
title: Authoring Guide
description: Conventions for adding documents to Almanach - folder taxonomy, required frontmatter schema, and how the generated indexes work.
category: meta
tags: [conventions, frontmatter, contributing]
status: complete
related:
  - /meta/roadmap
  - /meta/page-template
  - /meta/scenerystack-version-compatibility
---

# Authoring Guide

Almanach is designed to grow to hundreds of documents without any configuration edits. Everything — the sidebar, `llms.txt`, `llms-full.txt`, and `manifest.json` — is generated from the Markdown files and their frontmatter. Follow the conventions below and your page appears everywhere automatically.

If you're looking for open work rather than writing an ad hoc page, see [the Roadmap](/meta/roadmap#open-work) first — it tracks what's still `draft`, what's missing cross-links, and other concrete gaps.

## Adding a page

1. Create a `.md` file in the folder matching its category (see taxonomy below); for `api/`, also pick the library subfolder. Use kebab-case filenames: `model-view-transform.md`. [`meta/page-template.md`](/meta/page-template) is a copy-pasteable starting point.
2. Fill in the required frontmatter (schema below).
3. Run `npm run generate` — it validates every page and regenerates the LLM artifacts, failing loudly on schema violations.
4. Preview with `npm run dev`.

## Folder taxonomy

| Folder | Contents |
| --- | --- |
| `getting-started/` | Orientation, installation, first steps |
| `guides/` | Subsystem-level narrative walkthroughs — the layout system, the input system, localization, contributing. Broader in scope than `patterns`: explain how a whole subsystem works, not one narrow convention |
| `api/<library>/` | Reference pages for specific classes/functions, one subfolder per `scenerystack/*` subpath (`api/axon/`, `api/dot/`, `api/scenery/`, …) |
| `patterns/` | Narrow, prescriptive software patterns and architectural conventions — "how to structure X," one convention per page |
| `styling/` | Colors, typography, layout aesthetics, visual design conventions |
| `accessibility/` | PDOM, keyboard input, focus, voicing, sound-as-accessibility |
| `examples/` | Complete, runnable worked scenarios combining multiple concepts end-to-end |
| `cookbook/` | Short, task-oriented "how do I…" recipes that recombine already-documented APIs — narrower than `examples` (one task, not a full scenario) and more concrete than `patterns` (a recipe, not an architectural convention) |
| `meta/` | Documentation about Almanach itself |

New top-level folders may be added as Almanach grows; they appear in the sidebar automatically (add an entry to the `SECTIONS` maps in `docs/.vitepress/sidebar.ts` and `scripts/generate-llm-artifacts.ts` only to control their label and ordering).

**`api/` is subfoldered by library**, one directory per `scenerystack/*` subpath (e.g. `api/axon/property.md`, `api/scenery/node.md`). This is the one deliberate exception to "flat folder of pages": `api/` is expected to hold far more pages than any other category, across many distinct libraries, so it needs a second level of grouping to stay navigable. `docs/.vitepress/sidebar.ts`'s `collectPages` renders each library subfolder as its own collapsible sidebar group automatically — no config needed per library. Every other category stays flat.

Only document libraries that are simulation-author-facing. Internal build/branding subpaths (`chipper`, `perennial`, `brand`, `splash`, `init`, `assert`, `adapted-from-phet`) are out of scope.

## Frontmatter schema

Every page **must** begin with this frontmatter:

```yaml
---
title: ModelViewTransform2                  # required — page title, used in sidebar and indexes
description: One-sentence summary.          # required — shown in llms.txt and manifest.json
category: api                               # required — MUST equal the containing top-level folder name
library: phetcommon                         # required IFF category is "api" — MUST equal the containing subfolder name
tags: [dot, coordinates, transform]         # required — non-empty list of lowercase keywords (library names lowercase, class names PascalCase matching the real export)
status: complete                            # required — "stub" | "draft" | "complete" | "verified"
related:                                    # optional — unordered "see also", site-absolute paths
  - /patterns/model-view-separation
prerequisites:                              # optional — ordered "read this first", site-absolute paths
  - /getting-started/what-is-scenerystack
sourceRefs:                                 # optional — URLs grounding the page's technical claims
  - https://www.npmjs.com/package/scenerystack
navOrder: 10                                # optional — position in the sidebar within this section; see below
---
```

`library` only applies to `api/` pages; omit it everywhere else.

### `navOrder` — sidebar position

`navOrder` is an optional number controlling where a page sits within its section. Pages that set it appear first, ascending; pages without it follow, alphabetical by title. **Omitting it is always safe** — a new page simply lands after any curated entries, A–Z.

The learning-oriented sections (**Getting Started**, **Guides**, **Patterns**) carry a curated reading order via `navOrder`, sequenced to respect each page's own `prerequisites` so a newcomer can read top to bottom. The **API** deliberately leaves `navOrder` unset: it's a reference you scan by name, so it stays alphabetical. Add `navOrder` to a page only when you're intentionally curating its section's order, not as a matter of course.

### The `status` lifecycle

Four stages, each meaningful to an agent or human picking up work later:

| Status | Meaning |
| --- | --- |
| `stub` | Page is scaffolded (frontmatter + a one-paragraph placeholder) — reserves the topic so parallel writers don't duplicate it. Not yet real content. |
| `draft` | Full content is written, but not yet checked against the real SceneryStack source. |
| `complete` | Full content, internally consistent, the author is confident in it. |
| `verified` | `complete`, plus an independent pass has cross-checked the technical claims against real SceneryStack source or the [official reference](https://scenerystack.org/reference/). |

Progress is tracked by reading these real frontmatter values across the tree (see [the Roadmap](/meta/roadmap) and `npm run coverage:status`) — there is no separate hand-maintained checklist to keep in sync.

Validation rules (enforced by `npm run generate`, and by CI on every push):

- `title` and `description` are non-empty strings.
- `category` matches the top-level folder the file lives in.
- If `category` is `api`, `library` is required and must match the immediate subfolder.
- `tags` is a non-empty array of strings.
- `status` is one of `stub`, `draft`, `complete`, `verified`.
- Every `related` and `prerequisites` entry resolves to an existing document — broken cross-references fail the build.
- `sourceRefs`, if present, is an array of URL strings (not resolution-checked — they point outside Almanach).
- `navOrder`, if present, is a finite number.

VitePress additionally fails the build on dead Markdown links, so inline links like `[Drag Listeners](/patterns/drag-listeners)` are also checked.

## Writing style

- **One concept per page.** Small, focused pages retrieve better — for search engines, humans, and LLM context windows alike.
- **Lead with what and why**, then show a complete, runnable TypeScript snippet using real `scenerystack/*` imports.
- Put `<!-- typecheck -->` on the line immediately before a self-contained `ts` fence to check that snippet against the pinned SceneryStack version. Run `npm run examples:typecheck` to check the marked snippets directly.
- **Cross-link generously** with site-absolute paths (`/api/phetcommon/model-view-transform`), and mirror the most important links in `related` (unordered "see also") or `prerequisites` (ordered "read this first").
- Use tables for option/method summaries and `::: tip` / `::: warning` containers for the one thing readers must not miss.

## Live interactive demos

Some pages embed a real SceneryStack control via the globally registered `<SceneryDemo>` component (see `docs/.vitepress/theme/` and `docs/.vitepress/demos/`). Demos are **supplementary UI** — they do not replace the runnable TypeScript snippet above them. `llms-full.txt` and other generated indexes contain only Markdown; agents never execute the embed.

### When to add a demo

Add a live embed when the page documents an **interactive control** (button, slider, checkbox, composite control) where seeing or trying the widget helps more than reading options tables. Skip demos for non-visual APIs (`Range`, `Vector2`, model patterns, meta pages).

### Authoring a new demo

1. Create `docs/.vitepress/demos/<demo-id>.ts` exporting `createDemo( rootNode )` and optional `width` / `height`. In demos and uninstrumented Markdown examples, pass `tandem: Tandem.OPTIONAL` where the component's type requires a Tandem. See [PhET-iO and Instrumentation](/guides/phet-io-and-instrumentation) for instrumented examples.
2. Register the id in `docs/.vitepress/demos/registry.ts`.
3. Add `<SceneryDemo demo="<demo-id>" />` to the Markdown page **after** its primary code snippet.
4. Run `npm run demos:check` and `npm run build`.

`createDemo` must return a dispose function that tears down listeners, Properties, and Nodes — see [Dispose and Memory Management](/patterns/dispose-and-memory-management). Use helpers in `docs/.vitepress/demos/shared/` for common layout (centering in the fixed-size canvas via `centerInDisplay`).

Fixed canvas dimensions (typically 400×120–180) prevent layout shift in the VitePress page chrome. Demos load SceneryStack **client-side only** via dynamic `import()`; do not add static `scenerystack/*` imports to theme components.

Almanach pins `scenerystack@3.0.0` as a devDependency for demos; bump it together with [SceneryStack Version Compatibility Notes](/meta/scenerystack-version-compatibility).

## Generated artifacts

`npm run generate` (also run automatically as part of `npm run build`) writes three files into `docs/public/`, which are served at the site root:

| File | Contents |
| --- | --- |
| `/llms.txt` | Per-page links + descriptions, grouped by category ([llms.txt convention](https://llmstxt.org/)) |
| `/llms-full.txt` | Full text of every page with source-path headers |
| `/manifest.json` | All frontmatter metadata plus URLs and word counts |

These files are committed to the repository so agents browsing GitHub get them without a build step; regenerate them whenever content changes (CI verifies the build regardless).
