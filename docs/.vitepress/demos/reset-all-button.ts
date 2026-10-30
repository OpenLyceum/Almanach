import { NumberProperty } from 'scenerystack/axon';
import { FireListener, Text, VBox } from 'scenerystack/scenery';
import { ResetAllButton } from 'scenerystack/scenery-phet';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 180;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const countProperty = new NumberProperty( 0 );
  const readout = new Text( 'Count: 0' );
  const hint = new Text( 'Tap the count to increment' );

  const resetAllButton = new ResetAllButton( {
    listener: () => {
      countProperty.reset();
    }
  } );

  const panel = new VBox( {
    spacing: 12,
    align: 'center',
    children: [
      readout,
      hint,
      resetAllButton
    ]
  } );

  countProperty.link( count => {
    readout.string = `Count: ${count}`;
  } );

  readout.addInputListener( new FireListener( {
    fire: () => {
      countProperty.value++;
    }
  } ) );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    resetAllButton.dispose();
    countProperty.dispose();
    readout.dispose();
    hint.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
