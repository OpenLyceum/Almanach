---
title: Testing and QA Strategy Overview
description: The layers of testing a SceneryStack simulation benefits from - headless unit tests, manual QA passes, and automated fuzz-testing.
category: guides
tags: [testing, qa, fuzz-testing, qunit, quality]
status: complete
related:
  - /patterns/testing-model-logic-headlessly
  - /cookbook/fuzz-testing-a-simulation-locally
  - /guides/continuous-integration-for-scenerystack-projects
  - /patterns/query-parameters-pattern
prerequisites:
  - /patterns/model-view-separation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
navOrder: 20
---

# Testing and QA Strategy Overview

No single kind of test catches every class of bug in a SceneryStack simulation. A model's physics can be perfectly correct while a control panel silently fails to render on a narrow window; a screen can look flawless while an aggressive sequence of clicks and drags crashes it after ninety seconds. This page is a map of the three complementary layers a healthy sim project relies on — headless unit tests, manual QA passes, and automated fuzz-testing — and what each one is (and isn't) good for.

## The three layers

| Layer | Catches | Cost | Runs |
| --- | --- | --- | --- |
| Unit-testing model logic headlessly | Physics/logic bugs, regressions in `step()`, incorrect `reset()` | Cheapest — no browser, milliseconds per test | Every commit, in CI |
| Manual QA passes | Visual bugs, UX confusion, accessibility gaps, "does this feel right" | Most expensive — a person's time | Before a release, after major feature work |
| Automated fuzz-testing (`?fuzz`, `?fuzzBoard`) | Crashes and exceptions from unexpected or rapid input sequences | Cheap to run, requires a browser | Regularly in CI or ahead of a release |

None of the three substitutes for the others: a model can be exhaustively unit-tested and still crash the moment a real user drags two things at once during a screen transition, and a sim can survive an hour of fuzzing without a single exception while still being confusing or ugly. Treat them as different nets, each catching what falls through the others.

## Layer 1: unit-testing model logic headlessly

The cheapest and fastest layer is also the one to lean on hardest. Because [Model-View Separation](/patterns/model-view-separation) keeps model classes free of `scenery`/`sun` imports, model logic can be constructed, stepped, and asserted against in plain Node.js — see [Testing Model Logic Headlessly](/patterns/testing-model-logic-headlessly) for the full pattern and a worked `QUnit` example. This is where the bulk of a project's automated test coverage should live: it's fast enough to run on every commit and precise enough that a failure points at the actual broken logic, not a rendering symptom.

## Layer 2: manual QA passes

Some things can only be judged by a person looking at (or listening to, or navigating with a keyboard through) the running sim: does this layout hold up at an unusual window size, is this control's purpose obvious without a caption, does this sound cue feel right paired with this animation. PhET's own process for this is a structured manual QA pass — a checklist walked by a human across every screen, every supported browser/platform combination, and every accessibility mode (keyboard-only, screen reader) before a release. A project without dedicated QA staff can still get most of the value by treating "click through every screen with `?stringTest=double` and a screen reader on" as a release-blocking checklist item, not an afterthought.

## Layer 3: automated fuzz-testing

SceneryStack's built-in fuzzers exercise sequences such as rapid clicks during a screen transition or a drag during reset. Use `?fuzz&ea` for mouse and touch input, and run a separate pass with `?fuzzBoard&ea` for keyboard input. The keyboard pass requires interactive description and a focused simulation document. The `ea` flag enables assertions. See [Fuzz-Testing a Simulation Locally](/cookbook/fuzz-testing-a-simulation-locally) for the procedure.

Fuzzing is a crash-finder, not a correctness-checker: it tells you the sim *didn't throw*, not that the physics is right or the UI makes sense — that's still the job of layers 1 and 2. Its value is coverage breadth at near-zero authoring cost: once wired into a CI job (see [Continuous Integration for SceneryStack Projects](/guides/continuous-integration-for-scenerystack-projects)), it runs the same randomized stress test on every push without anyone having to imagine the failing sequence in advance.

::: tip Layer the checks so the cheapest one runs most often
Run headless model tests on every commit, fuzz-testing on a schedule or before merging significant changes, and reserve full manual QA passes for pre-release milestones. Trying to run a full manual pass on every commit is too slow to sustain; relying only on fuzzing and unit tests risks shipping something technically crash-free but confusing or visually broken.
:::

## Where to go next

- [Testing Model Logic Headlessly](/patterns/testing-model-logic-headlessly) — the concrete pattern for layer 1
- [Fuzz-Testing a Simulation Locally](/cookbook/fuzz-testing-a-simulation-locally) — the concrete recipe for layer 3
- [Continuous Integration for SceneryStack Projects](/guides/continuous-integration-for-scenerystack-projects) — wiring these layers into a pipeline that runs automatically
