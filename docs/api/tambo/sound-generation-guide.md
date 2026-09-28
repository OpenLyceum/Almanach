---
title: How tambo's Sound Generation Fits Together
description: A conceptual overview of how soundManager, SoundGenerator subclasses, and enabled-state gating compose into tambo's sonification model.
category: api
library: tambo
tags: [tambo, sound, WebAudio, soundManager, SoundGenerator, overview]
status: verified
prerequisites:
  - /guides/working-with-sound
related:
  - /api/tambo/sound-manager
  - /api/tambo/sound-clip
  - /api/tambo/sound-clip-player
  - /api/tambo/pitched-pop-generator
  - /accessibility/sound-design
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# How tambo's Sound Generation Fits Together

`tambo` (`scenerystack/tambo`) is SceneryStack's sound-generation library. This page connects the pieces documented individually elsewhere — [`soundManager`](/api/tambo/sound-manager), [`SoundClip`](/api/tambo/sound-clip), [`SoundClipPlayer`](/api/tambo/sound-clip-player), and [`PitchedPopGenerator`](/api/tambo/pitched-pop-generator) — into one mental model. It's written as a synthesized overview rather than a single-class reference, so treat it as a map rather than an exhaustive spec; verify specifics against the individual class pages or source.

## The mixer/registry: soundManager

Everything routes through the single `soundManager` singleton. It owns the shared `AudioContext` signal chain — a limiter, a reverb send, per-category gain nodes, and a "ducking" stage that reduces overall volume while, say, Voicing speech is playing — and every sound generator connects into that graph via `soundManager.addSoundGenerator(generator, { categoryName? })`. Nothing plays until a sim calls `soundManager.initialize(...)` once at startup; calls to `addSoundGenerator` made before that are queued and flushed automatically.

## The sound generators: implementations you register

`SoundGenerator` is the abstract base class (also exported from `scenerystack/tambo` for anyone building a custom one). The concrete implementations documented here are all subclasses of it:

- **`SoundClip`** plays a pre-recorded, decoded audio buffer — one-shot or looping. Most sim sound effects (clicks, boundary boops, ambient loops) are `SoundClip`s.
- **`SoundClipPlayer`** wraps a `SoundClip` and self-registers with `soundManager`, exposing only `play()`/`stop()` — meant for a sound that's reused across many unrelated call sites and shouldn't have its output level or rate mutated ad hoc from any one of them.
- **`PitchedPopGenerator`** synthesizes a short oscillator "pop" at a pitch chosen per-call from a configurable range, rather than playing recorded audio — a good fit for sonifying a value moving along a continuum (sliders, spinners) without needing one recorded file per pitch step.

Other `SoundGenerator` subclasses exist in the real package (`NoiseGenerator`, `MultiClip`, `OscillatorSoundGenerator`, `CompositeSoundClip`, and more) but aren't covered on this pass — see `tambo.ts`'s exports if you need one of those.

## Enabled-state gating: why a registered sound might still be silent

Before any of the per-generator gates below, the sim has to turn sound on in two places: `init({ supportsSound: true })` (so `soundManager.enabledProperty` starts `true` and the navigation-bar speaker stays enabled) and `audioOptions.supportsSound: true` (so `Sim` calls `soundManager.initialize()`). See [Working with Sound](/guides/working-with-sound).

Every `SoundGenerator` computes a `fullyEnabledProperty` by combining several signals — not just its own on/off switch:

1. `soundManager.enabledProperty` — the sim-wide sound master switch.
2. The sound generator's own `enabledProperty` (inherited from `EnabledComponent`).
3. Whether the sim is currently mid-"reset all" (`isResettingAllProperty`) — most sounds are suppressed during a reset unless `enabledDuringReset` was set.
4. Whether PhET-iO state is currently being restored (`isSettingPhetioStateProperty`) — sounds are suppressed unless `enabledDuringPhetioStateSetting` was set.
5. Whether an optional `associatedViewNode` is currently displayed — a looping sound tied to a Node that just became invisible is automatically muted.
6. Its `sonificationLevel` (`BASIC` or `EXTRA`) versus `soundManager.extraSoundEnabledProperty` — `EXTRA`-level sounds only play when the sim's "extra sound" preference is on.

A `SoundClip` or `PitchedPopGenerator` being "registered" with `soundManager` is therefore necessary but not sufficient for it to actually make noise — all of the above must also line up. `SoundClip` additionally auto-stops any in-progress one-shot the instant `fullyEnabledProperty` goes false.

## Categories and output levels

`soundManager.initialize()` sets up named gain-node "categories" (default `sim-specific` and `user-interface`); passing `categoryName` to `addSoundGenerator` routes that generator through its category's gain node, so `setOutputLevelForCategory('user-interface', 0.3)` can turn down all UI clicks without touching sim-specific sound effects.

::: tip Start from soundManager, not from the generator classes
When wiring up sound in a new screen, the natural order is: decide what should make sound, pick a `SoundGenerator` subclass for it, construct it, then call `soundManager.addSoundGenerator(...)`. Skipping the registration step is the most common way a sound "silently doesn't work" — the generator plays into a disconnected gain node until it's added.
:::
