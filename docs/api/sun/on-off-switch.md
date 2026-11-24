---
title: OnOffSwitch
description: The iOS-style sliding toggle for a boolean Property, one of three sun affordances for the same on/off pattern.
category: api
library: sun
tags: [sun, OnOffSwitch, BooleanProperty]
status: verified
related:
  - /api/sun/checkbox
  - /api/sun/toggle-button
prerequisites:
  - /api/axon/boolean-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# OnOffSwitch

`OnOffSwitch` (from `scenerystack/sun`) is a sliding switch bound to a `Property<boolean>` — off on the left, on on the right, styled like iOS's `UISwitch`. It's a thin subclass of the more general `ToggleSwitch<T>` with `leftValue`/`rightValue` fixed to `false`/`true`. `scenerystack/sun` gives you three different affordances for the exact same "toggle a boolean" pattern, and they read differently to users:

| Component | Reads as | Typical use |
| --- | --- | --- |
| [`Checkbox`](/api/sun/checkbox) | A labeled option to enable/disable | A settings list, "Show velocity vectors" |
| [`BooleanRectangularToggleButton`](/api/sun/toggle-button) | A momentary-feeling control with two icon states | Play/pause, mute/unmute |
| `OnOffSwitch` | A physical on/off switch | A single prominent power/enable toggle, sound on/off |

<!-- typecheck -->
```ts
import { OnOffSwitch } from 'scenerystack/sun';
import { BooleanProperty } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

const soundEnabledProperty = new BooleanProperty( true );

const soundSwitch = new OnOffSwitch( soundEnabledProperty, {
  accessibleName: 'Sound',
  tandem: Tandem.OPTIONAL
} );
```

`OnOffSwitch` takes a required options argument. Use `accessibleName` to name the control for assistive technology. For a visible label, put a `Text` node next to the switch in an `HBox`.

<SceneryDemo demo="on-off-switch" />

## Interaction

`OnOffSwitch` (via its `ToggleSwitch` base) supports both click-to-toggle and drag-to-set: clicking anywhere on the switch toggles the value; dragging the thumb past the track's midpoint and releasing snaps it to whichever side it's closest to; dragging the thumb far enough outside the track toggles the value immediately, even before release.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `size` | `60 x 30` | `Dimension2` for the switch; use `2 x height` for width if you want a circular thumb |
| `trackFillLeft` | `'white'` | Track fill when the Property is `false` (off) |
| `trackFillRight` | `'rgb( 0, 200, 0 )'` | Track fill when the Property is `true` (on) |
| `thumbFill` / `thumbStroke` | computed gradient / `'black'` | Thumb appearance |
| `toggleWhileDragging` | `null` | `null`: iOS-style (change on far drag); `true`: change as soon as thumb crosses center; `false`: only change on release |
| `thumbTouchAreaXDilation` / `thumbTouchAreaYDilation` | `8` / `8` | Expand the thumb's touch hit area |
| `accessibleSwitch` | `true` | Adds `role="switch"` and `aria-checked` PDOM semantics; set `false` if you need non-boolean-style ARIA |

::: warning `OnOffSwitch` requires reference-equality Properties
Both `OnOffSwitch` and its `ToggleSwitch` base assert that the bound `Property`'s `valueComparisonStrategy` is `'reference'` (the default for `BooleanProperty`) — they compare `property.value` against `true`/`false` with `===`. If you've customized `valueComparisonStrategy` on the Property you're binding, `OnOffSwitch` will fail its assertion.
:::
