---
title: Roadmap
description: What Almanach currently covers, the taxonomy behind that coverage, and the concrete work that remains open.
category: meta
tags: [roadmap, planning, contributing, conventions]
status: complete
related:
  - /meta/authoring-guide
  - /meta/page-template
  - /meta/scenerystack-version-compatibility
---

# Roadmap

Almanach covers 19 simulation-author-facing `scenerystack/*` libraries across 9 top-level categories (`getting-started`, `guides`, `api`, `patterns`, `styling`, `accessibility`, `examples`, `cookbook`, `meta`) — more than 400 pages. Run `npm run coverage:status` for the live count broken down by category/library and frontmatter `status`.

**This document does not itself write the content.** It explains the taxonomy so a new page lands in the right place, and lists the concrete work still open so a contributor (human or agent) can pick something up instead of guessing.

## Taxonomy

- `getting-started/`, `patterns/`, `styling/`, `accessibility/`, `guides/`, `examples/`, and `meta/` are flat folders, one file per concept.
- **`api/` is subfoldered by library**: `api/axon/`, `api/dot/`, `api/scenery/`, etc. — one directory per `scenerystack/*` subpath. `docs/.vitepress/sidebar.ts` renders each subfolder as its own collapsible group automatically.
- **`cookbook/`** holds short, task-oriented "how do I…" recipes, one recipe per page, that recombine APIs documented elsewhere rather than introducing new ones. Narrower than `examples` (a full worked scenario) and more concrete than `patterns` (an architectural convention).

Full rationale and the frontmatter schema (`library`, `prerequisites`, `sourceRefs`, and the 4-stage `status` enum) live in [the Authoring Guide](/meta/authoring-guide) — read that before writing a page, this document is about *what's covered and what's missing*, not *how to write a page*.

**In-scope libraries** (confirmed against the installed `scenerystack` package's `exports` map and source): `axon, dot, kite, scenery, sun, scenery-phet, joist, twixt, tandem, phetcommon, tambo, bamboo, vegas, mobius, nitroglycerin, utterance-queue, phet-core, query-string-machine, tappi`. `adapted-from-phet, alpenglow, assert, brand, chipper, init, perennial, sim, splash` are internal build/branding/rendering-primitive concerns and are **out of scope** — don't create `api/<one of these>/` folders for them.

Coverage depth is intentionally uneven: the libraries most simulation authors touch daily (`axon, dot, kite, scenery, sun, scenery-phet, joist, twixt, tandem, phetcommon`) go deepest; libraries like `mobius`, `nitroglycerin`, and `tappi` have only first-pass coverage of their most central classes. Almanach documents "the classes and patterns a simulation author actually reaches for," not every export — `scenery` and `scenery-phet` alone have several hundred exports each, most of them internal helpers, string modules, or image/audio assets that don't warrant their own page.

## How to contribute a page

1. Read [the Authoring Guide](/meta/authoring-guide) and [the Page Template](/meta/page-template).
2. Run `npm run coverage:status` to see per-category/library page counts and which pages are still `stub`/`draft`, and check [Open work](#open-work) below for known gaps.
3. If you're adding coverage for a class not yet documented, verify it actually exists and matches your description by checking https://scenerystack.org/reference/ or introspecting the installed `scenerystack` package — don't invent plausible-sounding names.
4. Create the file with `status: stub` first if you're not finishing it in one pass — this reserves the topic for parallel contributors without claiming false completeness.
5. Write the page following the Authoring Guide's conventions (one concept, a real runnable snippet, cross-links). Move `status` to `draft`, then `complete` once you're confident, citing `sourceRefs` for anything you had to look up.
6. Run `npm run generate` (frontmatter + cross-link validation) and `npm run build` (adds dead-link checking) before considering a page done.

There is no separate checklist to tick — progress is read directly from frontmatter `status` values across the tree via `npm run coverage:status`. Don't hand-maintain a duplicate progress list; it will drift.

## Open work

- **Independent verification pass**: many pages are `status: complete` but haven't yet had an independent pass cross-check their technical claims against real SceneryStack source (`status: verified`). Highest concentrations: `api/scenery-phet/*`, `api/sun/*`, and `cookbook/*`. `npm run coverage:status` prints the live count — pick a library folder or category cluster and verify 5–10 pages at a time.
- **Cross-link gaps**: `npm run coverage:status` reports live counts for pages missing `prerequisites` or `sourceRefs` (most remaining `sourceRefs` gaps are `meta/*` pages, which intentionally don't cite SceneryStack source). `related` is fully populated across the tree.
- **Re-verification against newer `scenerystack` releases**: Almanach's content was checked against `scenerystack@3.0.0`; see [SceneryStack Version Compatibility Notes](/meta/scenerystack-version-compatibility) for what to do once a newer major version ships.
- **Deeper class-level coverage**: each in-scope library has more real exports than Almanach documents (internal helpers and asset modules aside). Find genuine gaps by introspecting the installed package (read its `src/<lib>.ts` barrel file, or inspect https://scenerystack.org/reference/) and cross-checking against what's already documented before adding a page.
- The `meta/*` pages (`authoring-guide`, `faq`, `glossary`, `page-template`, `scenerystack-version-compatibility`, this file) stay at `complete` rather than `verified` — that status is about checking claims against SceneryStack source, which doesn't apply to pages that are about Almanach itself.
