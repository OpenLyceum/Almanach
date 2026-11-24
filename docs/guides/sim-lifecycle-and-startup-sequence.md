---
title: Sim Lifecycle and Startup Sequence
description: The real sequence from Sim construction through start(), screen selection, and the running animation loop that steps Properties and listeners every frame.
category: guides
tags: [joist, Sim, Screen, lifecycle, animation-loop]
status: complete
related:
  - /api/joist/sim
  - /api/joist/screen
  - /api/joist/screen-view
  - /guides/scenery-basics
  - /api/axon/timer
prerequisites:
  - /api/joist/sim
  - /getting-started/your-first-simulation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
navOrder: 16
---

# Sim Lifecycle and Startup Sequence

SceneryStack loads startup resources, constructs the simulation, initializes its screens, and starts the browser animation loop. The order determines when screen models are available and what state a frame callback can read.

## Phase 1: asset loading, via `onReadyToLaunch`

A simulation never constructs its `Sim` directly at module scope — it wraps construction in `onReadyToLaunch` (from `scenerystack/sim`), which waits for SceneryStack's asynchronous asset loader (fonts, images, translated string files) to finish before the callback runs:

```ts
import { Sim, Screen, onReadyToLaunch } from 'scenerystack/sim';

onReadyToLaunch( () => {
  const sim = new Sim( /* ... */ );
  sim.start();
} );
```

Create UI that depends on startup assets inside this callback or in a screen factory. For example, a `Text` node created before its font is ready can initially measure bounds using a fallback font. Each [`Screen`](/api/joist/screen) stores factories that `Sim.start()` calls during initialization.

## Phase 2: `new Sim(...)` construction

Constructing `Sim` itself does relatively little work: it records the list of `Screen`s, builds a `HomeScreen` and navigation bar if there's more than one, and sets up its own top-level Properties (`selectedScreenProperty`, `activeProperty`, `dimensionProperty`) — see [`Sim`](/api/joist/sim) for the full option/member list. Crucially, **no individual screen's `createModel`/`createView` factory has run yet** at this point; `Screen` only holds those factories, it doesn't call them.

## Phase 3: `sim.start()` — screen initialization

Calling `start()` schedules initialization of every screen in the simulation's selected screen set. Each screen's model is created before its view. `sim.isConstructionCompleteProperty.value` becomes `true` after initialization finishes. The [`detachInactiveScreenViews`](/api/joist/sim) option controls which views are attached to the scene graph after they are created.

The constructor sets `selectedScreenProperty` using the screen configuration and query parameters. Once construction finishes, `start()` begins the `requestAnimationFrame` loop.

## Phase 4: the running animation loop

Once started, a `Sim` drives a `requestAnimationFrame` loop. A simulation step runs in this order.

1. `Sim` computes `dt` in seconds, applies the simulation's speed multiplier, and caps it at the selected screen's `maxDT`.
2. `stepTimer` emits `dt` and runs due callbacks. These callbacks run before the model advances for this step.
3. `Sim` calls the selected screen model's `step( dt )` when it has one and `dt` is nonzero.
4. `Sim` steps the [`Display`](/api/scenery/display), calls the selected [`ScreenView`](/api/joist/screen-view)'s `step( dt )`, then updates the display to render the result.

Advance time-based model state in the model's `step( dt )`. Use the view's `step( dt )` for visual updates that need the new model state. Joist calls both methods separately, so forwarding the view's step to the model would advance the model twice. Input listeners can still update model state in response to user actions.

::: tip Sim activity and frame callbacks
Set `sim.activeProperty.value = false` to suspend automatic simulation steps. Joist still requests browser animation frames and emits `animationFrameTimer` when they run. `browserTabVisibleProperty` separately reports the tab's visibility.
:::

## Where to go next

- [Sim](/api/joist/sim) — the full constructor/option/member reference for the class this page walks through
- [Screen](/api/joist/screen) — the lazy model/view factory pattern `start()` invokes
- [Timer, animationFrameTimer, and stepTimer](/api/axon/timer) — the two timer singletons driven by (or independent of) this loop
- [Scenery Basics](/guides/scenery-basics) — the `Display`/repaint mechanism the loop drives each frame
