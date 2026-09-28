---
title: Sound Design
description: Using scenery-phet/tambo sound generators for non-speech audio feedback.
category: accessibility
tags: [tambo, sound, accessibility]
status: verified
related:
  - /accessibility/voicing
  - /accessibility/describing-dynamic-state
  - /accessibility/screen-reader-testing-checklist
prerequisites:
  - /accessibility/pdom
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# Sound Design

Non-speech sound ("sonification") is a third accessibility channel alongside the [PDOM](/accessibility/pdom) and [Voicing](/accessibility/voicing): short audio cues that confirm an interaction happened or reflect continuous state, independent of whether the user is looking at the screen or using a screen reader. `tambo` (`scenerystack/tambo`) is the sound-generation library used for this; it registers individual **sound generators** with a single global `soundManager`, which owns overall enable/disable, per-category gain, and visibility-based muting.

::: tip soundManager is a ready-made singleton
`soundManager` (and the `sharedSoundPlayers` registry built on top of it) is instantiated once per module and registered by `tambo` itself — a simulation doesn't construct it. `Sim` calls `soundManager.initialize()` when `audioOptions.supportsSound` is true, and `soundManager.enabledProperty` starts from the `?supportsSound` query parameter, whose default is `init({ supportsSound: true })` in `src/init.ts`. Set both. View code just imports the singleton and calls `addSoundGenerator`/`get` on it, as below. See [Working with Sound](/guides/working-with-sound).
:::

## Reuse a shared sound player for common UI sounds

For standard interactions — checkbox toggles, button presses, reset — reach for `sharedSoundPlayers` (from `scenerystack/tambo`) before creating a custom sound. Shared players are created lazily on first use, are automatically registered with `soundManager`, and keep the sound experience consistent (and memory usage low) across every checkbox/button in a project:

```ts
import { sharedSoundPlayers } from 'scenerystack/tambo';

const checkboxSoundPlayer = sharedSoundPlayers.get( 'checkboxChecked' );

gravityEnabledProperty.link( enabled => {
  if ( enabled ) {
    checkboxSoundPlayer.play();
  }
} );
```

Available shared player names include `'checkboxChecked'`, `'checkboxUnchecked'`, `'pushButton'`, `'resetAll'`, `'grab'`, `'release'`, `'boundaryReached'`, `'stepForward'`, `'stepBackward'`, and more — one per common PhET-wide interaction.

## Custom one-shot or looping sounds with SoundClip

For a sound specific to a single simulation, wrap an audio asset in a `SoundClip` (from `scenerystack/tambo`) and add it to `soundManager` directly:

```ts
import { SoundClip, soundManager } from 'scenerystack/tambo';
import collisionSound_mp3 from './sounds/collisionSound_mp3.js';

const collisionSoundClip = new SoundClip( collisionSound_mp3, {
  initialOutputLevel: 0.7
} );

soundManager.addSoundGenerator( collisionSoundClip, {
  categoryName: 'sim-specific'
} );

// Play it when a collision happens in the model
model.collisionEmitter.addListener( () => collisionSoundClip.play() );
```

`SoundClip` supports `loop: true` for continuous sounds (e.g. an ambient hum tied to a running motor) in addition to the default one-shot playback.

## Categories and global control

`soundManager` groups sound generators into categories (by default `'sim-specific'` and `'user-interface'`) so a user's sound preferences can control them independently — e.g. muting UI click sounds while keeping sim-specific feedback. Pass `categoryName` in `addSoundGenerator`'s options to assign a generator to one:

```ts
soundManager.addSoundGenerator( myUiSoundClip, { categoryName: 'user-interface' } );
soundManager.addSoundGenerator( mySimSoundClip, { categoryName: 'sim-specific' } );
```

`soundManager.enabledProperty` and `soundManager.extraSoundEnabledProperty` control sound globally and for "extra"/basic sonification levels respectively; simulations typically expose these through Preferences rather than sound generators managing their own on/off state.

## Relationship to Voicing and the PDOM

Sound design is a distinct, complementary channel: [Voicing](/accessibility/voicing) speaks words, the PDOM structures content for screen readers, and `tambo` sounds are non-verbal cues (a click, a chime, a boundary "boop") that work for every user regardless of whether speech or screen-reader output is enabled. A well-designed interaction often layers a sound (immediate, wordless feedback) with a Voicing/PDOM response (a fuller description) rather than choosing one over the other.

::: tip Don't build custom sounds for interactions sun already covers
Most common component sounds (checkboxes, push buttons, radio buttons, sliders) are wired up by `sun`'s components themselves through `sharedSoundPlayers` — check whether the built-in sound already covers an interaction before adding a redundant custom `SoundClip`.
:::
