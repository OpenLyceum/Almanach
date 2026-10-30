import { BooleanProperty } from 'scenerystack/axon';
import { Shape } from 'scenerystack/kite';
import { RoundStickyToggleButton } from 'scenerystack/sun';
import { Path, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 300;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const pressedProperty = new BooleanProperty( false );

  // Stays "down" after a press until pressed again.
  const button = new RoundStickyToggleButton( pressedProperty, false, true, {
    content: new Path( Shape.circle( 10 ), { fill: '#C0392B' } ),
    baseColor: 'white'
  } );

  const readout = new Text( '' );
  const update = ( pressed: boolean ): void => { readout.string = pressed ? 'engaged' : 'released'; };
  pressedProperty.link( update );

  const panel = new VBox( { spacing: 20, align: 'center', children: [ button, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    pressedProperty.unlink( update );
    button.dispose();
    readout.dispose();
    panel.dispose();
    pressedProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
