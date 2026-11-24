---
title: State Persistence and Save/Restore Patterns
description: Capturing the model state needed to resume a simulation and restoring it before notifying observers.
category: patterns
tags:
  - Property
  - state
  - persistence
status: verified
related:
  - /patterns/model-view-separation
  - /patterns/reset-all-pattern
prerequisites:
  - /patterns/model-view-separation
sourceRefs:
  - 'https://www.npmjs.com/package/scenerystack'
  - 'https://scenerystack.org/reference/'
navOrder: 21
---

# State Persistence and Save/Restore Patterns

A snapshot explicitly records the model state needed to resume a simulation. Include values that affect what happens next, such as position, velocity, elapsed time, and any random generator state the model depends on. Copy mutable vectors, arrays, or records so subsequent simulation steps cannot change a saved snapshot.

## Capture the state the model needs to resume

Use Axon Properties for values that need change notifications. Ordinary fields can also belong in a snapshot. A derived value can be recomputed from the restored inputs. Hover state and other transient view details can stay in the view.

## Restore the inputs before notifying observers

Writing several Properties in sequence normally notifies listeners after each write. A listener that reads both position and velocity can then see values from two different snapshots. In this example, Axon defers notifications until both Property values and the elapsed time have been installed.

<!-- typecheck -->
```ts
import { NumberProperty } from 'scenerystack/axon';

type MotionSnapshot = {
  position: number;
  velocity: number;
  elapsedTime: number;
};

class MotionModel {
  public readonly positionProperty = new NumberProperty( 0 );
  public readonly velocityProperty = new NumberProperty( 1 );
  private elapsedTime = 0;

  public step( dt: number ): void {
    this.elapsedTime += dt;
    this.positionProperty.value += this.velocityProperty.value * dt;
  }

  public captureState(): MotionSnapshot {
    return {
      position: this.positionProperty.value,
      velocity: this.velocityProperty.value,
      elapsedTime: this.elapsedTime
    };
  }

  public restoreState( snapshot: MotionSnapshot ): void {
    this.positionProperty.setDeferred( true );
    this.velocityProperty.setDeferred( true );

    this.positionProperty.value = snapshot.position;
    this.velocityProperty.value = snapshot.velocity;
    this.elapsedTime = snapshot.elapsedTime;

    const notifyPosition = this.positionProperty.setDeferred( false );
    const notifyVelocity = this.velocityProperty.setDeferred( false );
    notifyPosition?.();
    notifyVelocity?.();
  }
}
```

This restore method accepts a snapshot from the model. When loading from a file, validate the schema, numeric ranges, and relationships between fields before passing the snapshot to the model. If listeners perform additional work such as writing to history, coordinate that work with the restore and test the resulting state.

## Test that the restored model resumes correctly

Capture a snapshot, advance the model, and restore it. Check both the restored values and the state after running the same next step again. A [Reset All](/patterns/reset-all-pattern) test checks a single initial state. A save/restore test should also cover states reached during an interaction.
