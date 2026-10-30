import { NumberProperty, Property } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Text, VBox } from 'scenerystack/scenery';
import { NumberPicker } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 180;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const countProperty = new NumberProperty( 3, {
    numberType: 'Integer',
    range: new Range( 0, 10 )
  } );
  const countRangeProperty = new Property( new Range( 0, 10 ) );

  const readout = new Text( 'Apples: 3' );

  const countPicker = new NumberPicker( countProperty, countRangeProperty );

  countProperty.link( count => {
    readout.string = `Apples: ${count}`;
  } );

  const panel = new VBox( {
    spacing: 14,
    align: 'center',
    children: [
      readout,
      countPicker
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    countPicker.dispose();
    countProperty.dispose();
    countRangeProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
