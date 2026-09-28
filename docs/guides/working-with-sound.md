---
title: Working with Sound (tambo Overview)
description: How tambo fits into a SceneryStack simulation - soundManager as the central mixer, and the sound-generator classes you compose to drive it.
category: guides
tags: [tambo, sound, audio]
status: verified
related:
  - /accessibility/sound-design
  - /guides/preferences-and-feature-flags
  - /guides/scenery-basics
  - /patterns/dispose-and-memory-management
prerequisites:
  - /guides/scenery-basics
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
navOrder: 10
---

# Working with Sound (tambo Overview)

`tambo` (`scenerystack/tambo`) is SceneryStack's sound-generation library: instead of every part of a simulation calling into the Web Audio API directly, each sound-producing thing in the sim is a small **sound generator** object, and a single global **`soundManager`** owns the actual audio graph — enabling/disabling sound globally, mixing generators together, applying per-category gain, and connecting the result to the browser's audio output. This page is a subsystem-level tour of that architecture; for using sound specifically as an accessibility channel (sonification alongside Voicing and the PDOM), see [Sound Design](/accessibility/sound-design).

## Turning sound on

Sound stays off until two flags are both `true`. They are easy to treat as duplicates, and a sim that sets only one of them still launches — clips stay muted, or the navigation-bar speaker is disabled.

| Flag | Where | What it actually does |
| --- | --- | --- |
| `supportsSound: true` | `init()` in `src/init.ts` | Defaults the `?supportsSound` query parameter. That value is the initial state of `soundManager.enabledProperty`, so playback starts unmuted. It also keeps the navigation-bar speaker enabled. |
| `supportsSound: true` | `PreferencesModel` `audioOptions` in `src/main.ts` | Makes `Sim` call `soundManager.initialize()` and offer Audio preferences. This option *defaults* from the query parameter, so `init()` alone is enough to initialize tambo — but `audioOptions` alone leaves `enabledProperty` at `false`. |

```ts
import { init } from 'scenerystack/init';

init( {
  // ...name, version, splashDataURI
  supportsSound: true
} );
```

```ts
import { PreferencesModel } from 'scenerystack/sim';

const preferencesModel = new PreferencesModel( {
  audioOptions: {
    supportsSound: true
  }
} );
```

Set them to the same value. A sim with no sound sets neither; `false` is the default. Write `audioOptions.supportsSound: false` only when that `audioOptions` object exists for another reason (voicing or custom audio controls) and sonification should stay off — and leave `init()` unset in that case. When sound is the only audio feature, Preferences hides its own sound toggle and routes mute through the navigation-bar speaker, which cannot unmute a sim whose `enabledProperty` started `false`.

## soundManager: the mixer

`soundManager` is a singleton — you don't construct it, you register generators with it. Conceptually it's the mixing desk: every sound generator you create gets `add`ed to it once, and from then on `soundManager` controls whether it's audible, how loud, and through which category-level gain it's routed:

```ts
import { soundManager } from 'scenerystack/tambo';
import { SoundClip } from 'scenerystack/tambo';
import popSound_mp3 from './sounds/popSound_mp3.js';

const popSoundClip = new SoundClip( popSound_mp3 );

soundManager.addSoundGenerator( popSoundClip, {
  categoryName: 'sim-specific'
} );
```

A generator that's never added to `soundManager` never produces audible output — construction alone doesn't connect it to anything. `removeSoundGenerator` reverses this, and should be called as part of disposing whatever owns the generator (see [Dispose and Memory Management](/patterns/dispose-and-memory-management)) so a long-running sim doesn't accumulate generators nothing plays through anymore.

`soundManager` also exposes `setOutputLevelForCategory( categoryName, outputLevel )`, letting you (or a Preferences panel) turn a whole category up or down together — the standard categories are `'sim-specific'` and `'user-interface'`, so a user can, for instance, mute UI click sounds while keeping model-driven sonification audible.

## The sound generator hierarchy

Every concrete generator (`SoundClip`, `PitchedPopGenerator`, `OscillatorSoundGenerator`, and others) extends a common `SoundGenerator` base class, which is what `soundManager.addSoundGenerator` actually expects. That shared base is what lets `soundManager` treat "play a recorded clip" and "synthesize a tone" identically for the purposes of enabling, disabling, and mixing — the differences between generator types are only in *how* each produces its waveform, not in how it's registered or controlled.

| Generator | Produces | Typical use |
| --- | --- | --- |
| `SoundClip` | Plays a decoded audio asset, one-shot or looping | The default choice for any pre-recorded sound effect |
| `SoundClipPlayer` | A thin wrapper managing a pool of `SoundClip`-like players for rapid repeated triggering | Sounds fired often enough that overlapping playback needs pooling rather than one clip instance |
| `PitchedPopGenerator` | A synthesized "pop" with a controllable pitch, no audio asset needed | Feedback tied to a continuous value (a slider position, a count) where discrete recorded pitches would be impractical |
| `OscillatorSoundGenerator` | A raw oscillator tone | Low-level procedural sound, rarely used directly outside other generators built on it |
| `NoiseGenerator` | Synthesized noise (not a recorded sample) | Ambient/textural sound rather than a discrete event |
| `CompositeSoundClip` | Plays several `SoundClip`s together as one logical unit | Layering (e.g. a base hit sound plus a variable layer) without hand-managing multiple independent clips |

## Playing a recorded sound: SoundClip

`SoundClip` is the generator you reach for most: it wraps a single decoded audio asset (imported the same way an image asset would be) and exposes `play()`/`stop()`:

```ts
import { SoundClip, soundManager } from 'scenerystack/tambo';
import collisionSound_mp3 from './sounds/collisionSound_mp3.js';

const collisionSoundClip = new SoundClip( collisionSound_mp3, {
  loop: false,
  initialPlaybackRate: 1
} );

soundManager.addSoundGenerator( collisionSoundClip );

model.collisionEmitter.addListener( () => collisionSoundClip.play() );
```

`play( delay )` and `stop( delay )` both accept an optional delay in seconds — useful for lining a sound up with an animation rather than triggering it the instant the model event fires. Setting `loop: true` turns the same class into a continuous ambient sound (a running motor, an idle hum) instead of a one-shot effect; a looping clip is started once and left playing (or its `initialOutputLevel`/gain adjusted) rather than re-triggered per event.

## Synthesized feedback: PitchedPopGenerator

Not every sound corresponds to a discrete recorded asset — feedback tied to a continuously varying value (dragging a slider, a running count) is often better served by a synthesized tone whose pitch tracks the value than by trying to pre-record enough discrete pitches to sound smooth. `PitchedPopGenerator` is tambo's built-in example of this pattern: it produces a short "pop" whose pitch you control per-call, pooling a small number of oscillator/gain pairs internally so rapid successive calls don't cut each other off:

```ts
import { PitchedPopGenerator, soundManager } from 'scenerystack/tambo';
import { Range } from 'scenerystack/dot';

const popGenerator = new PitchedPopGenerator( {
  pitchRange: new Range( 220, 660 )
} );

soundManager.addSoundGenerator( popGenerator );

// relativePitch is 0-1; 0 maps to pitchRange.min, 1 to pitchRange.max
countProperty.link( count => {
  const relativePitch = countProperty.range!.getNormalizedValue( count );
  popGenerator.playPop( relativePitch );
} );
```

This is the general shape for any procedurally-driven feedback: construct one generator, register it once with `soundManager`, then call its play method repeatedly as the underlying value changes, rather than constructing a new sound generator per event.

## Where to go next

- [Sound Design](/accessibility/sound-design) — using `soundManager`/`SoundClip`/shared sound players specifically as an accessibility (sonification) channel, and the `sharedSoundPlayers` registry for common UI sounds
- [Dispose and Memory Management](/patterns/dispose-and-memory-management) — why generators need `removeSoundGenerator` on disposal, same as any other listener-holding object
- [Scenery Basics](/guides/scenery-basics) — the Node tree that sound-triggering interactions (drag, press, model events) live alongside
