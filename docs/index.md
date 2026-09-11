---
title: Almanach
---

# Almanach

API guides, software patterns, styling, and accessibility conventions for building interactive [SceneryStack](https://scenerystack.org) simulations — 420 pages, browsable here or ingestible by LLM agents.

Use the sidebar to navigate the full knowledge base, or jump into a section below.

## Getting Started

New to SceneryStack? Start with the framework overview, set up a project, and build your first simulation.

- [What is SceneryStack?](/getting-started/what-is-scenerystack)
- [Installation and Setup](/getting-started/installation-and-setup)
- [Your First Simulation](/getting-started/your-first-simulation)

## Guides

In-depth tutorials on scenery, layout, input, sound, i18n, phet-io, and more.

- [Scenery Basics](/guides/scenery-basics)
- [Building Your First Screen](/guides/building-your-first-screen)
- [Scenery Layout](/guides/scenery-layout)

## API Reference

Per-class and per-module reference for every SceneryStack library — axon, dot, scenery, sun, joist, and dozens more. Browse by library in the sidebar.

- [Property (axon)](/api/axon/property)
- [Node (scenery)](/api/scenery/node)
- [Sim (joist)](/api/joist/sim)

## Patterns

Recurring design patterns used across SceneryStack simulations.

- [Model–View Separation](/patterns/model-view-separation)
- [Options Pattern](/patterns/options-pattern)
- [Dispose and Memory Management](/patterns/dispose-and-memory-management)

## Styling

Visual design conventions: color profiles, typography, spacing, panels, and responsive layout.

- [Color Profiles](/styling/color-profiles)
- [Typography and Fonts](/styling/typography-and-fonts)
- [Spacing and Sizing Constants](/styling/spacing-and-sizing-constants)

## Accessibility

PDOM, voicing, keyboard input, screen reader testing, and sound design for inclusive simulations.

- [PDOM](/accessibility/pdom)
- [Voicing](/accessibility/voicing)
- [Keyboard Input and Hotkeys](/accessibility/keyboard-input-and-hotkeys)

## Examples

End-to-end walkthroughs and sample simulations that tie multiple topics together.

- [Demo Simulation Walkthrough](/examples/demo-simulation-walkthrough)
- [Building a Two-Screen Simulation](/examples/building-a-two-screen-simulation)
- [Full Accessible Multi-Screen Sim](/examples/full-accessible-multi-screen-sim)

## Cookbook

Focused recipes for common tasks — drag listeners, custom sliders, sound effects, chart binding, and more.

- [Draggable Node Bounded to an Area](/cookbook/draggable-node-bounded-to-an-area)
- [Custom Slider Thumb and Track](/cookbook/custom-slider-thumb-and-track)
- [Animating a Property Value on a Timer](/cookbook/animating-a-property-value-on-a-timer)

## For LLM agents

Three machine-readable views of Almanach are generated from the same Markdown sources and served at the site root:

| File | Purpose |
| --- | --- |
| [`/llms.txt`](/llms.txt) | Index of every page with a one-line description ([llms.txt convention](https://llmstxt.org/)) |
| [`/llms-full.txt`](/llms-full.txt) | Full text of every page in a single file, for one-shot ingestion |
| [`/manifest.json`](/manifest.json) | Structured metadata (title, category, tags, related pages, word counts) |

The raw Markdown sources live in [the GitHub repository](https://github.com/OpenLyceum/Almanach) under `docs/`.

---

Contributors: see the [Authoring Guide](/meta/authoring-guide) for frontmatter schema and how to add pages.
