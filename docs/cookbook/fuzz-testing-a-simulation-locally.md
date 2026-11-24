---
title: Fuzz-Testing a Simulation Locally
description: Using the ?fuzz query parameter (and its variants) during local development to catch input-handling bugs before release.
category: cookbook
tags: [query-parameters, fuzz, testing, qa]
status: verified
related:
  - /patterns/query-parameters-pattern
  - /guides/testing-and-qa-strategy-overview
  - /guides/continuous-integration-for-scenerystack-projects
prerequisites:
  - /patterns/query-parameters-pattern
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# Fuzz-Testing a Simulation Locally

**Task:** before shipping a change, you want automated confidence that no sequence of rapid, unexpected input (fast clicking, dragging mid-transition, hammering a keyboard shortcut) throws an uncaught exception — without writing a hand-crafted test for every such sequence.

SceneryStack simulations have built-in input fuzzers. Use `?fuzz&ea` to generate mouse and touch input and `?fuzzBoard&ea` for a separate keyboard pass. These crash checks complement headless model tests and manual QA in the [testing strategy](/guides/testing-and-qa-strategy-overview).

## Running a basic fuzz pass

```
http://localhost:5173/my-sim/my-sim_en.html?fuzz&ea
```

- `fuzz` turns on randomized mouse and touch input.
- `ea` ("enable assertions") is normally paired with it, so an invalid internal state throws immediately at the point it first goes wrong, rather than silently corrupting further state and surfacing as a confusing, unrelated exception minutes later.

Let it run for a few minutes while watching the browser console; a clean run producing no console errors is the pass condition. A thrown exception's stack trace points at the code path the fuzzer happened to stumble into — that's the bug to fix, not the fuzzer's behavior to work around.

## Narrowing which input modality is exercised

If a fuzz run finds a crash, narrowing which kind of input is being generated helps isolate whether the bug is in pointer handling, keyboard handling, or both:

| Parameter | Effect |
| --- | --- |
| `fuzz` | Randomizes mouse and touch input together |
| `fuzzMouse` | Randomizes only simulated mouse input |
| `fuzzTouch` | Randomizes only simulated touch input |
| `fuzzBoard` | Randomizes only keyboard input, exercising focus movement and hotkeys instead of pointer events |
| `fuzzRate` | Controls how frequently fuzz events are generated (higher values fire events faster) |

For keyboard fuzzing, enable interactive description, open the sim with `?fuzzBoard&ea`, and keep the simulation document focused. SceneryStack generates keyboard events only while that document has focus. If you open DevTools to inspect the console, return focus to the sim for the run.

## Reproducing a fuzz-found failure

Fuzzing is randomized, so a crash found in one run may not reproduce with the same seed by default — if a failure needs to be isolated for debugging, note the exact console error and stack trace from the run that found it, and use it to write a targeted, deterministic unit test (see [Testing Model Logic Headlessly](/patterns/testing-model-logic-headlessly)) covering that specific input sequence instead of relying on fuzzing to reproduce it again. Fuzzing is best treated as a discovery tool for the *existence* of a bug, not as the regression test that then guards against it recurring.

## Where this fits in a release checklist

| Layer | What it catches | This recipe |
| --- | --- | --- |
| Headless unit tests | Logic/physics bugs in model code | Not this — see [Testing Model Logic Headlessly](/patterns/testing-model-logic-headlessly) |
| Manual QA | Visual/UX/accessibility issues | Not this — a human still needs to look at and navigate the sim |
| Fuzz-testing | Crashes from unexpected/rapid input sequences | This recipe, and running it in CI — see [Continuous Integration for SceneryStack Projects](/guides/continuous-integration-for-scenerystack-projects) |

::: tip Run it after any change to input handling, not just before a release
Run a short pass after changing an input listener. Use `?fuzz&ea` after changing pointer handling and `?fuzzBoard&ea` after changing keyboard handling. Run both passes for interactions that support both.
:::

The `fuzz`, `fuzzMouse`, `fuzzTouch`, `fuzzBoard`, `fuzzRate`, and `ea` flags are registered in SceneryStack's built-in query-parameter schema (`chipper/js/browser/initialize-globals.js` in `scenerystack@3.0.0`); `SimDisplay` reads them when driving the input and keyboard fuzzers.
