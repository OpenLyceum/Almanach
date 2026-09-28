---
title: soundManager
description: The singleton that registers tambo sound generators, routes them to the Web Audio output, and controls global enable/disable, per-category gain, and reverb.
category: api
library: tambo
tags: [tambo, soundManager, sound, singleton, WebAudio]
status: verified
prerequisites:
  - /api/tambo/sound-generation-guide
related:
  - /api/tambo/sound-clip
  - /api/tambo/sound-clip-player
  - /api/tambo/pitched-pop-generator
  - /accessibility/sound-design
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# soundManager

`soundManager` (from `scenerystack/tambo`) is a singleton — not a class you instantiate — that every tambo sound generator ultimately connects through. It owns the shared `AudioContext` signal chain (a dynamics compressor limiter, a convolver-based reverb send, per-category gain nodes, and a "ducking" gain stage), and exposes the register/unregister API that individual `SoundGenerator` instances (like `SoundClip` and `PitchedPopGenerator`) use to reach the speakers. `Sim` calls `soundManager.initialize(...)` once when `audioOptions.supportsSound` is true; until then, `addSoundGenerator` calls are queued and flushed automatically on initialization. Playback still starts muted unless `init({ supportsSound: true })` defaults `?supportsSound`, the initial value of `enabledProperty`. Set both flags. See [Working with Sound](/guides/working-with-sound).

```ts
import { soundManager } from 'scenerystack/tambo';
import { SoundClip } from 'scenerystack/tambo';
import myClick_mp3 from './myClick_mp3.js';
```

## Registering a sound generator

```ts
const clickSound = new SoundClip( myClick_mp3, { initialOutputLevel: 0.7 } );

// Connects clickSound into the shared audio graph (reverb + dry paths).
soundManager.addSoundGenerator( clickSound, {
  categoryName: 'user-interface' // one of the categories passed to initialize(), or omit for the default routing
} );

// Later, if the sound generator is disposed:
soundManager.removeSoundGenerator( clickSound );
```

If `soundManager.initialize()` hasn't run yet (e.g. sound isn't supported in this sim), `addSoundGenerator` silently queues the request rather than throwing — it's flushed once `initialize()` completes.

## Key members

| Member | Description |
| --- | --- |
| `enabledProperty` | `BooleanProperty` — master on/off switch for all sound; sound generators go silent (via their own `fullyEnabledProperty`) when this is `false` |
| `extraSoundEnabledProperty` | `BooleanProperty` — enables sound generators registered at the "extra" sonification level (see `SoundLevelEnum`), used for supplementary sounds aimed at learners with visual disabilities |
| `initialized` | `boolean` — becomes `true` after `initialize()` runs; sound generators can't be meaningfully added before this |
| `mainOutputLevel` / `getMainOutputLevel()` / `setMainOutputLevel(level)` | Overall gain (0-1) applied to all registered sound, when `enabledProperty` is true |
| `reverbLevel` / `getReverbLevel()` / `setReverbLevel(level)` | Wet/dry mix (0-1) for the shared convolver-based reverb send |

## Methods

| Method | Effect |
| --- | --- |
| `initialize(simConstructionCompleteProperty, audioEnabledProperty, simVisibleProperty, simActiveProperty, simSettingPhetioStateProperty, options?)` | One-time setup: builds the audio graph, wires the gain-shutoff `Multilink`, and flushes any queued sound generators. `options.categories` (default `['sim-specific', 'user-interface']`) defines the category names available to `addSoundGenerator` |
| `hasSoundGenerator(soundGenerator)` | Returns whether a given sound generator is currently registered |
| `addSoundGenerator(soundGenerator, options?)` | Connects the sound generator into the graph — either a named `categoryName` gain node or the default convolver/dry paths — and adds it to the internal list |
| `removeSoundGenerator(soundGenerator)` | Disconnects and removes a previously-added sound generator |
| `setOutputLevelForCategory(categoryName, level)` / `getOutputLevelForCategory(categoryName)` | Per-category gain control, e.g. turning down all `'user-interface'` sounds independent of `'sim-specific'` ones |
| `addDuckingProperty(property)` / `removeDuckingProperty(property)` | Registers a `TReadOnlyProperty<boolean>` that, when `true`, temporarily reduces overall output (used so sound effects duck under Voicing speech) |

::: tip Sound generators still gate themselves
`soundManager.enabledProperty` being `true` doesn't guarantee a given `SoundClip` or `PitchedPopGenerator` actually plays — each `SoundGenerator` computes its own `fullyEnabledProperty` from `soundManager.enabledProperty` **and** its own `enabledProperty`, sonification level, associated-view-node visibility, and whether the sim is mid-reset or setting PhET-iO state. See [How tambo's Sound Generation Fits Together](/api/tambo/sound-generation-guide) for how these layers compose.
:::
