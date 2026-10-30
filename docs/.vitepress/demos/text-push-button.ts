import { NumberProperty } from 'scenerystack/axon';
import { Text, VBox } from 'scenerystack/scenery';
import { TextPushButton } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 140;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const countProperty = new NumberProperty( 0 );

  const readout = new Text( 'Count: 0' );

  const button = new TextPushButton( 'Increment', {
    baseColor: '#3575D8',
    listener: () => {
      countProperty.value++;
    }
  } );

  const panel = new VBox( {
    spacing: 12,
    align: 'center',
    children: [
      readout,
      button
    ]
  } );

  countProperty.link( count => {
    readout.string = `Count: ${count}`;
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    button.dispose();
    countProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
