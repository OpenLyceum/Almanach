---
title: Preferences and Feature Flags
description: Using the Preferences dialog and query parameters to configure sim behavior.
category: guides
tags: [preferences, query-parameters, joist]
status: verified
related:
  - /getting-started/your-first-simulation
  - /guides/translation-and-localization
  - /getting-started/running-and-building-a-simulation
  - /guides/working-with-sound
prerequisites:
  - /getting-started/your-first-simulation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
navOrder: 17
---

# Preferences and Feature Flags

SceneryStack simulations expose two different mechanisms for configuring behavior that aren't part of the core interaction: the **Preferences dialog**, a user-facing settings panel built into every `Sim`, and **query parameters**, developer/deployment-facing flags read once at startup. Both exist so features like localization, sound, and accessibility options don't need bespoke UI in every simulation.

## The Preferences dialog

Every `Sim` gets a Preferences button in its navigation bar automatically; what appears inside it is configured by a `PreferencesModel` passed to `Sim`:

```ts
import { Sim, onReadyToLaunch, PreferencesModel } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';

const preferencesModel = new PreferencesModel( {
  visualOptions: {
    supportsProjectorMode: true // adds a high-contrast "projector mode" toggle
  },
  audioOptions: {
    supportsSound: true,
    supportsExtraSound: true
  }
} );

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'My Simulation' ), [ /* screens */ ], {
    preferencesModel
  } );
  sim.start();
} );
```

| `PreferencesModel` section | Surfaces |
| --- | --- |
| `simulationOptions` | Sim-specific custom preferences you supply yourself |
| `visualOptions` | Projector/high-contrast mode, interactive highlights |
| `audioOptions` | Sound on/off, extra sound, voicing (speech output) |
| `inputOptions` | Alternative input customization (e.g. gesture control settings) |
| `localizationOptions` | Locale switching, region-and-culture selection |

If none of these `Options` are supplied, the corresponding Preferences tab simply doesn't appear — the dialog only shows tabs relevant to what the simulation actually supports, so passing an empty `new PreferencesModel()` (the `Sim` default) yields a minimal dialog.

::: warning `audioOptions.supportsSound` does not unmute playback
`supportsSound` on `PreferencesModel` initializes tambo and shows Audio preferences. The navigation-bar speaker and `soundManager.enabledProperty` start from the `?supportsSound` query parameter, whose default comes from `init({ supportsSound: true })` in `src/init.ts`. Set both flags to the same value. `audioOptions` alone leaves every clip muted and disables the speaker button; `init()` alone does initialize tambo, because this option defaults from that query parameter, but declare it in `audioOptions` too so the two sites cannot drift. A sim with no sound sets neither. See [Working with Sound](/guides/working-with-sound).
:::

## Query parameters

Query parameters are read once, at launch, from the page URL — they're the mechanism for developer tooling and deployment configuration, not for anything a shipped simulation should let end users toggle from within the running page. Two you'll use constantly during development:

| Query parameter | Effect |
| --- | --- |
| `?ea` | Enables assertions (`assert && assert(...)` checks throughout SceneryStack) — see [Running and Building a Simulation](/getting-started/running-and-building-a-simulation) |
| `?locale=fr` | Launches directly in a given locale, bypassing the Preferences dialog's language picker |
| `?screens=1,2` | Restricts which screens are available, by 1-based index — useful for testing one screen in isolation |

Simulation-specific flags follow the same pattern using `QueryStringMachine` (from `scenerystack/query-string-machine`), the schema-validated query parameter parser SceneryStack itself uses internally:

```ts
import { QueryStringMachine } from 'scenerystack/query-string-machine';

const myQueryParameters = QueryStringMachine.getAll( {
  // ?showAnswers=true
  showAnswers: {
    type: 'flag'
  },

  // ?initialSpeed=2.5
  initialSpeed: {
    type: 'number',
    defaultValue: 1
  }
} );

if ( myQueryParameters.showAnswers ) {
  // reveal debug-only content
}
```

`QueryStringMachine.getAll` validates every parameter against its declared `type`/`defaultValue` at startup, so a malformed URL fails fast with a clear error rather than silently misconfiguring the sim.

::: warning Query parameters are a developer/QA surface, not an end-user settings UI
It's tempting to add a query parameter as a quick way to make a feature "configurable" and stop there. If end users are meant to change the setting, it belongs in the **Preferences dialog** (or in-sim UI) instead — query parameters aren't discoverable, aren't documented in-product, and are easy to lose (e.g. on a bookmarked or shared URL that omits them). Reserve query parameters for developer flags, QA/testing switches, and deployment-time configuration.
:::

## Where to go next

- [Translation and Localization](/guides/translation-and-localization) — how `?locale=` interacts with the string pipeline
- [Running and Building a Simulation](/getting-started/running-and-building-a-simulation) — where query parameters get appended during development
- [Your First Simulation](/getting-started/your-first-simulation) — the minimal `Sim` this guide's `preferencesModel` option extends
