import { NumberProperty, Property } from 'scenerystack/axon';
import { Range, Vector2 } from 'scenerystack/dot';
import { BicyclePumpNode } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 340;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 200 );
  const numberProperty = new NumberProperty( 0, { range: range } );
  const rangeProperty = new Property( range );

  const pump = new BicyclePumpNode( numberProperty, rangeProperty, {
    width: 200,
    height: 250,
    hoseAttachmentOffset: new Vector2( 100, -50 )
  } );

  const readout = new Text( '' );
  const updateReadout = ( value: number ): void => {
    readout.string = `particles: ${Math.round( value )}`;
  };
  numberProperty.link( updateReadout );

  const panel = new VBox( {
    spacing: 10,
    align: 'center',
    children: [
      readout,
      pump
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    numberProperty.unlink( updateReadout );
    pump.dispose();
    readout.dispose();
    panel.dispose();
    numberProperty.dispose();
    rangeProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
