---
title: PreferencesModel and PreferencesDialog
description: PreferencesModel declares which Preferences tabs a Sim supports; PreferencesDialog is the tabbed dialog Sim builds automatically from it.
category: api
library: joist
tags: [joist, PreferencesModel, PreferencesDialog, Sim, preferences]
status: verified
related:
  - /api/joist/sim
  - /guides/preferences-and-feature-flags
prerequisites:
  - /api/joist/sim
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PreferencesModel and PreferencesDialog

`PreferencesModel` is the configuration object you pass to [`Sim`](/api/joist/sim) to declare which Preferences features a simulation supports — projector mode, sound, voicing, gesture input, locale switching, and simulation-specific custom controls. `PreferencesDialog` is the tabbed dialog that renders whatever `PreferencesModel` describes; you never construct it yourself — `Sim` wires a `NavigationBarPreferencesButton` to build one lazily (`new PreferencesDialog( preferencesModel, ... )`) the first time the user opens it. This pairing is covered end-to-end, with a full example, in [Preferences and Feature Flags](/guides/preferences-and-feature-flags) — this page is the API-reference companion, focused on what each class actually exposes.

::: warning Both are exported from `scenerystack/sim`, not `scenerystack/joist`
Same gotcha as [`Sim`](/api/joist/sim) and [`Screen`](/api/joist/screen): despite living in the `joist` repository, both `PreferencesModel` and `PreferencesDialog` are exported from **`scenerystack/sim`**.
:::

```ts
import { Sim, onReadyToLaunch, PreferencesModel } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';

const preferencesModel = new PreferencesModel( {
  visualOptions: { supportsProjectorMode: true },
  audioOptions: { supportsSound: true, supportsExtraSound: true }
} );

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'My Simulation' ), [ /* screens */ ], { preferencesModel } );
  sim.start(); // Sim wires up the Preferences button; PreferencesDialog is built lazily on first click
} );
```

::: warning Sound needs a matching `init()` flag
`audioOptions.supportsSound` initializes tambo and shows the Audio tab. It does not unmute playback. Also pass `supportsSound: true` to `init()` in `src/init.ts`; that is the default of `?supportsSound`, which seeds `soundManager.enabledProperty` and keeps the navigation-bar speaker enabled. Set both to the same value. See [Working with Sound](/guides/working-with-sound).
:::

## `PreferencesModel`

### Constructor

```ts
new PreferencesModel( providedOptions?: PreferencesModelOptions )
```

### Options

| Option | Surfaces | Notable sub-options |
| --- | --- | --- |
| `simulationOptions` | The "Simulation" tab | `customPreferences` — your own controls; this tab only appears if you supply at least one |
| `visualOptions` | The "Visual" tab | `supportsProjectorMode`, `supportsInteractiveHighlights`, plus `customPreferences` |
| `audioOptions` | The "Audio" tab | `supportsSound`, `supportsExtraSound`, `supportsVoicing`, `supportsCoreVoicing`, plus `customPreferences` (which can specify a `column: 'left' \| 'right'`) |
| `inputOptions` | The "Input" tab | `supportsGestureControl`, plus `customPreferences` |
| `localizationOptions` | The "Localization" tab | `supportsDynamicLocale`, `includeLocalePanel`, plus `customPreferences` |

Every one of these is optional — an untouched `new PreferencesModel()` supports nothing extra, and `Sim`'s Preferences button only appears at all if `shouldShowDialog()` (below) is `true`.

### Public API

| Member | Description |
| --- | --- |
| `simulationModel`, `visualModel`, `audioModel`, `inputModel`, `localizationModel` | The resolved model for each tab (options merged with defaults, plus derived Properties like `visualModel.interactiveHighlightsEnabledProperty`) |
| `supportsSimulationPreferences()` / `supportsVisualPreferences()` / `supportsAudioPreferences()` / `supportsInputPreferences()` / `supportsLocalizationPreferences()` | Whether each tab has anything to show — `PreferencesDialog` uses these to decide which tabs to build |
| `shouldShowDialog()` | `true` if *any* tab would have content — `Sim` uses this to decide whether to show a Preferences button at all |

## `PreferencesDialog`

### Constructor

```ts
new PreferencesDialog( preferencesModel: PreferencesModel, providedOptions?: PreferencesDialogOptions )
```

You won't call this yourself in ordinary sim code — it's what `Sim`'s `NavigationBarPreferencesButton` constructs internally, once, the first time a user opens Preferences. `PreferencesDialog` is a `Dialog` subclass (see `scenerystack/sim`'s `Dialog`/`Popupable` re-exports), and is never disposed once created (`isDisposable: false`) — subsequent opens reuse the same instance.

### Behavior worth knowing

| Aspect | Detail |
| --- | --- |
| Tab selection | Built from whichever `supports*Preferences()` calls on `preferencesModel` return `true`; the "Overview" tab is always present |
| `focusSelectedTab()` | Public method to move keyboard focus to the currently selected tab — used when the dialog opens |
| Keyboard navigation | Arrow-down from the tab row moves focus into the selected panel; arrow-up from the panel moves focus back to the tab row |

::: tip Configure preferences through `PreferencesModel`; you'll rarely touch `PreferencesDialog`
Everything a sim author controls — which tabs appear, which toggles are in them, custom per-sim controls — is a `PreferencesModel` option. `PreferencesDialog` exists mostly so its shape is documented; the only thing you'd construct one for directly is testing/exploratory code, not ordinary sim wiring.
:::

## Related

- [Preferences and Feature Flags](/guides/preferences-and-feature-flags) — the narrative walkthrough this reference page complements, including query-parameter interactions.
- [Sim](/api/joist/sim) — takes `preferencesModel` as a `SimOptions` field and owns the Preferences button that lazily builds the dialog.
