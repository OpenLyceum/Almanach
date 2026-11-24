---
title: LevelSelectionButtonGroup
description: Instantiates and lays out a row (or custom arrangement) of LevelSelectionButtons from a declarative list of items, with built-in support for a gameLevels query parameter.
category: api
library: vegas
tags: [vegas, LevelSelectionButtonGroup, LevelSelectionButton, game, FlowBox]
status: verified
related:
  - /api/vegas/level-selection-button
  - /api/vegas/game-audio-player
prerequisites:
  - /api/vegas/level-selection-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# LevelSelectionButtonGroup

`LevelSelectionButtonGroup` (from `scenerystack/vegas`) is a `Node` that builds a whole set of [`LevelSelectionButton`](/api/vegas/level-selection-button)s from a declarative array of items, rather than you constructing and laying out each button by hand. It handles three things a level-select screen otherwise has to duplicate: instantiating one button per item, giving every button in the group a uniform `buttonWidth`/`buttonHeight`, and arranging them (a single horizontal row by default, via an internal `FlowBox`).

<!-- typecheck -->
```ts
import { LevelSelectionButtonGroup, type LevelSelectionButtonGroupItem } from 'scenerystack/vegas';
import { NumberProperty } from 'scenerystack/axon';
import { Text } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';

const level1Score = new NumberProperty( 0 );
const level2Score = new NumberProperty( 0 );
const selectedLevel = new NumberProperty( 0 );

const items: LevelSelectionButtonGroupItem[] = [
  {
    icon: new Text( '1', { fontSize: 40 } ),
    scoreProperty: level1Score,
    options: { listener: () => { selectedLevel.value = 1; } }
  },
  {
    icon: new Text( '2', { fontSize: 40 } ),
    scoreProperty: level2Score,
    options: { listener: () => { selectedLevel.value = 2; } }
  }
];

const buttonGroup = new LevelSelectionButtonGroup( items, {
  tandem: Tandem.OPTIONAL,
  groupButtonWidth: 120,
  groupButtonHeight: 120,
  gameLevels: [ 1, 2 ], // value of the sim's gameLevels query parameter
} );
```

<SceneryDemo demo="level-selection-button-group" />

## Constructor

```ts
new LevelSelectionButtonGroup( items: LevelSelectionButtonGroupItem[], providedOptions?: LevelSelectionButtonGroupOptions )
```

`items` must be non-empty, ordered by increasing level number (level 1 first) — `tandemName`s and the default `level${N}Button` naming both assume that ordering.

### `LevelSelectionButtonGroupItem`

| Field | Required | Description |
| --- | --- | --- |
| `icon` | yes | The icon `Node` for this level's button |
| `scoreProperty` | yes | `ReadOnlyProperty<number>` shown on the button |
| `tandemName` | no | Overrides the default `level${N}Button` tandem name |
| `options` | no | Per-button `LevelSelectionButtonOptions` overrides (everything `LevelSelectionButtonOptions` accepts except `tandem`/`buttonHeight`/`buttonWidth`, which the group controls) |

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `levelSelectionButtonOptions` | — | Options applied to every button in the group; a specific item's `options` overrides these |
| `flowBoxOptions` | `{ orientation: 'horizontal', spacing: 10 }` | Options for the default `FlowBox` layout; ignored if `createLayoutNode` is provided |
| `createLayoutNode` | default `FlowBox` builder | `( buttons: LevelSelectionButton[] ) => LayoutNode` — supply this for a custom arrangement (multiple rows, a grid, etc.) instead of the default single row |
| `gameLevels` | **required** | Array of positive integers (1-based) — only buttons whose level number appears in this array are made `visible`. All buttons are still constructed (so the PhET-iO API doesn't change conditionally), just hidden. Set this from your sim's `gameLevels` query parameter |
| `tandem` | **required** | Use `Tandem.OPTIONAL` for an uninstrumented example, or provide the group's Tandem in an instrumented sim |
| `groupButtonWidth` / `groupButtonHeight` | — | Uniform size applied to every button via `LevelSelectionButtonOptions.buttonWidth`/`buttonHeight` |

## Public API

| Member | Description |
| --- | --- |
| `buttons` | The constructed `LevelSelectionButton[]`, ordered by increasing level number |
| `focusLevelSelectionButton( level )` | Moves keyboard focus to the button for the given 1-based level number — call this when returning to the level-select UI (e.g. after a "Back" or "Start Over" action) so keyboard traversal resumes somewhere sensible |

::: tip Build a custom layout with `createLayoutNode`, not by bypassing the group
If a single row doesn't fit your design (multiple rows, an irregular grid), provide `createLayoutNode` rather than constructing `LevelSelectionButton`s yourself — you still get the group's uniform sizing, `gameLevels` visibility handling, and `buttons`/`focusLevelSelectionButton()` API for free.
:::

::: warning `gameLevels` is required, and levels are 1-indexed
Unlike most options, `gameLevels` has no built-in default — omitting it (in TypeScript) is a type error, and passing an empty array asserts. Level numbers start at `1` to match the convention used by the `gameLevels` query parameter, not `0`.
:::
