import { BooleanProperty, Property } from 'scenerystack/axon';
import { BooleanRectangularToggleButton, RectangularToggleButton } from 'scenerystack/sun';
import { Path, Text, VBox } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 300;
export const height = 280;

type Speed = 'normal' | 'slow';

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const isPlayingProperty = new BooleanProperty( false );

  // A simple triangular "play" glyph and a two-bar "pause" glyph, built by hand.
  const playShape = new Shape().moveTo( -8, -10 ).lineTo( 10, 0 ).lineTo( -8, 10 ).close();
  const pauseShape = new Shape()
    .rect( -9, -10, 6, 20 )
    .rect( 3, -10, 6, 20 );

  // Swaps between the pause icon (isPlayingProperty === true) and the play icon (false).
  const button = new BooleanRectangularToggleButton(
    isPlayingProperty,
    new Path( pauseShape, { fill: 'black' } ), // shown when isPlayingProperty === true
    new Path( playShape, { fill: 'black' } ),  // shown when isPlayingProperty === false
    { baseColor: 'yellow' }
  );

  // Generic RectangularToggleButton<T>: one content Node, flips Property between two values.
  const speedProperty = new Property<Speed>( 'normal' );
  const speedButton = new RectangularToggleButton(
    speedProperty,
    'normal', // valueOff
    'slow',   // valueOn
    { content: new Text( 'x' ) }
  );

  const readout = new Text( '' );
  const update = (): void => {
    const playState = isPlayingProperty.value ? 'playing' : 'paused';
    readout.string = `${playState}  |  speed: ${speedProperty.value}`;
  };
  isPlayingProperty.link( update );
  speedProperty.link( update );

  const panel = new VBox( {
    spacing: 20,
    align: 'center',
    children: [ button, speedButton, readout ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    isPlayingProperty.unlink( update );
    speedProperty.unlink( update );
    button.dispose();
    speedButton.dispose();
    readout.dispose();
    panel.dispose();
    isPlayingProperty.dispose();
    speedProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
