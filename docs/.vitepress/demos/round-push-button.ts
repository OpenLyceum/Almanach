import { NumberProperty } from 'scenerystack/axon';
import { RoundPushButton } from 'scenerystack/sun';
import { Path, Text, VBox } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 300;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const countProperty = new NumberProperty( 0 );

  const plusShape = new Shape().moveTo( -10, 0 ).lineTo( 10, 0 ).moveTo( 0, -10 ).lineTo( 0, 10 );
  const button = new RoundPushButton( {
    content: new Path( plusShape, { stroke: 'white', lineWidth: 4, lineCap: 'round' } ),
    baseColor: '#5B9BD5',
    radius: 30,
    listener: () => { countProperty.value += 1; }
  } );

  const readout = new Text( '' );
  const update = ( count: number ): void => { readout.string = `count: ${count}`; };
  countProperty.link( update );

  const panel = new VBox( { spacing: 20, align: 'center', children: [ button, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    countProperty.unlink( update );
    button.dispose();
    readout.dispose();
    panel.dispose();
    countProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
