---
title: A Sound-Rich Simulation with Tambo
description: A worked example wiring SoundClip, PitchedPopGenerator, and sharedSoundPlayers to several distinct interaction points in one small sim.
category: examples
tags: [example, tambo, SoundClip, PitchedPopGenerator, soundManager, sound]
status: complete
related:
  - /api/tambo/sound-generation-guide
  - /api/tambo/sound-clip
  - /api/tambo/sound-manager
  - /api/tambo/pitched-pop-generator
  - /accessibility/sound-design
  - /patterns/drag-listeners
prerequisites:
  - /getting-started/your-first-simulation
  - /api/tambo/sound-generation-guide
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# A Sound-Rich Simulation with Tambo

[How tambo's Sound Generation Fits Together](/api/tambo/sound-generation-guide) explains the pieces individually — `soundManager`, `SoundClip`, `PitchedPopGenerator`, `sharedSoundPlayers`. This page wires several of them into one small screen at once, each covering a different *kind* of interaction, so the differences between them show up concretely rather than in isolation.

The scenario: a draggable ball on a number line, where dragging plays a pitch that tracks position, hitting either boundary plays a boundary sound, a "launch" button plays a standard UI click, and a reset plays the shared reset sound — four sound-generation techniques, one small sim.

## Enabling sound for the sim

Sound is off unless both sound flags are `true`. They are sim-level settings, not something each sound generator configures itself:

- `init({ supportsSound: true })` in `src/init.ts` defaults `?supportsSound`, which is the initial value of `soundManager.enabledProperty` and what keeps the navigation-bar speaker enabled.
- `audioOptions.supportsSound: true` makes `Sim` call `soundManager.initialize()` and show Audio preferences.

Either flag alone still launches. `audioOptions` alone leaves clips muted and the speaker disabled. `init()` alone does initialize tambo (the preferences option defaults from the query parameter), but set both so they cannot drift. See [Working with Sound](/guides/working-with-sound).

```ts
import { init } from 'scenerystack/init';
import { Sim, onReadyToLaunch, PreferencesModel } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';

init( {
  // ...name, version, splashDataURI
  supportsSound: true
} );

const preferencesModel = new PreferencesModel( {
  audioOptions: {
    supportsSound: true
  }
} );
```

## The model

The ball's position is a `Vector2Property` confined to a thin horizontal strip via `validBounds` — matching the shape `DragListener`/`RichDragListener` expect (see [Drag Listeners](/patterns/drag-listeners)), even though only the x-coordinate is actually meaningful here:

```ts
import { Vector2Property, Vector2, Bounds2 } from 'scenerystack/dot';

class SoundDemoModel {
  public readonly positionProperty: Vector2Property;
  public static readonly DRAG_BOUNDS = new Bounds2( -200, -5, 200, 5 );

  public constructor() {
    this.positionProperty = new Vector2Property( new Vector2( 0, 0 ), {
      validBounds: SoundDemoModel.DRAG_BOUNDS
    } );
  }

  public reset(): void {
    this.positionProperty.reset();
  }
}
```

## Four sound-generation techniques in one view

```ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';
import { Circle, RichDragListener } from 'scenerystack/scenery';
import { RectangularPushButton } from 'scenerystack/sun';
import { ResetAllButton } from 'scenerystack/scenery-phet';
import { SoundClip, PitchedPopGenerator, soundManager } from 'scenerystack/tambo';
import { Vector2, Range } from 'scenerystack/dot';
import { Property } from 'scenerystack/axon';
import launchSound_mp3 from './launchSound_mp3.js';
import boundaryReached_mp3 from './boundaryReached_mp3.js';

class SoundDemoScreenView extends ScreenView {
  public constructor( model: SoundDemoModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    // 1. sharedSoundPlayers - the standard, reused-everywhere reset sound.
    //    No SoundClip/registration to write; this is already wired up sitewide.
    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      right: this.layoutBounds.maxX - 20,
      bottom: this.layoutBounds.maxY - 20
    } );

    // 2. SoundClip - a one-shot custom sound tied to a specific button press.
    const launchSound = new SoundClip( launchSound_mp3, { initialOutputLevel: 0.7 } );
    soundManager.addSoundGenerator( launchSound, { categoryName: 'user-interface' } );

    const launchButton = new RectangularPushButton( {
      content: new Circle( 8, { fill: 'white' } ),
      listener: () => {
        model.positionProperty.value = Vector2.ZERO;
        launchSound.play();
      },
      centerX: this.layoutBounds.centerX,
      top: 20
    } );

    // 3. Another SoundClip - a boundary cue, played only on the transition INTO a boundary.
    const boundarySound = new SoundClip( boundaryReached_mp3, { initialOutputLevel: 0.6 } );
    soundManager.addSoundGenerator( boundarySound );

    const dragBounds = SoundDemoModel.DRAG_BOUNDS;
    let wasAtBoundary = false;
    model.positionProperty.link( position => {
      const isAtBoundary = position.x === dragBounds.minX || position.x === dragBounds.maxX;
      if ( isAtBoundary && !wasAtBoundary ) {
        boundarySound.play();
      }
      wasAtBoundary = isAtBoundary;
    } );

    // 4. PitchedPopGenerator - a synthesized pop whose pitch tracks the ball's position
    //    continuously while dragging, rather than one pre-recorded file per position.
    const dragPopGenerator = new PitchedPopGenerator( {
      pitchRange: new Range( 220, 880 )
    } );
    soundManager.addSoundGenerator( dragPopGenerator );

    const ballNode = new Circle( 15, {
      fill: 'cornflowerblue',
      cursor: 'pointer',
      centerY: this.layoutBounds.centerY + 60
    } );
    model.positionProperty.link( position => {
      ballNode.centerX = this.layoutBounds.centerX + position.x;
    } );

    ballNode.addInputListener( new RichDragListener( {
      positionProperty: model.positionProperty,
      dragBoundsProperty: new Property( dragBounds ),
      drag: () => {
        const relativePitch = ( model.positionProperty.value.x - dragBounds.minX ) /
                               ( dragBounds.maxX - dragBounds.minX );
        dragPopGenerator.playPop( relativePitch );
      }
    } ) );

    this.children = [ ballNode, launchButton, resetAllButton ];
    this.pdomOrder = [ launchButton, ballNode, resetAllButton ];
  }
}
```

| Technique | Trigger | Why this one, not another |
| --- | --- | --- |
| `sharedSoundPlayers.get('resetAll')` (used automatically by `ResetAllButton`) | Any reset-all action across the whole sim | Standard, sitewide interaction — reusing the shared player keeps the sound consistent with every other reset button in any PhET-style sim, with zero registration code |
| `SoundClip` (`launchSound`) | One specific button press | A single custom one-shot tied to one interaction — the ordinary case for [Adding a Custom Sound Effect on Interaction](/cookbook/custom-sound-effect-on-interaction) |
| `SoundClip` (`boundarySound`), guarded by `wasAtBoundary` | A model-state *transition*, not a continuous condition | Fires once per crossing rather than replaying on every position update while already at the boundary — the same one-shot-on-transition pattern used for a "success" chime |
| `PitchedPopGenerator` | Continuous drag, many times per second | The position varies continuously; a `SoundClip` per discrete pitch would need dozens of recorded files, where `playPop(relativePitch)` synthesizes the right pitch on demand |

## Wiring the Screen and Sim

```ts
import { Sim, Screen, onReadyToLaunch } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

const screenTandem = Tandem.ROOT.createTandem( 'soundDemoScreen' );

const soundDemoScreen = new Screen(
  () => new SoundDemoModel(),
  model => new SoundDemoScreenView( model, { tandem: screenTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'Sound Demo' ),
    backgroundColorProperty: new Property( 'white' ),
    tandem: screenTandem
  }
);

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'Sound Demo' ), [ soundDemoScreen ], { preferencesModel } );
  sim.start();
} );
```

::: tip Match the sound-generation technique to how the triggering value changes
The four techniques above aren't interchangeable by preference — they map to four different *shapes* of trigger: a reused sitewide event (`sharedSoundPlayers`), a one-off discrete event (`SoundClip`), a state transition that must not repeat while the state holds (`SoundClip` plus a guard flag), and a continuously-varying value (`PitchedPopGenerator`). Picking the wrong one for a given trigger is the most common way custom sound design in a sim ends up either silent, spammy, or needlessly bloated with recorded assets.
:::

## Where to go next

- [How tambo's Sound Generation Fits Together](/api/tambo/sound-generation-guide) — the conceptual overview this example assembles
- [Adding a Custom Sound Effect on Interaction](/cookbook/custom-sound-effect-on-interaction) — the same `SoundClip` patterns as standalone recipes
- [Sound Design](/accessibility/sound-design) — sound as a distinct accessibility channel alongside Voicing and the PDOM
- [Drag Listeners](/patterns/drag-listeners) — the `RichDragListener` wiring used for the ball above
