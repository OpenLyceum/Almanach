import { NumberProperty } from 'scenerystack/axon';
import { AllLevelsCompletedNode } from 'scenerystack/vegas';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 380;
export const height = 300;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const doneProperty = new NumberProperty( 0 );

  const node = new AllLevelsCompletedNode( () => { doneProperty.value += 1; }, {
    scale: 0.9
  } );

  const readout = new Text( '' );
  const update = ( count: number ): void => {
    readout.string = count === 0 ? 'press the button' : `pressed ${count}×`;
  };
  doneProperty.link( update );

  const panel = new VBox( { spacing: 14, align: 'center', children: [ node, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    doneProperty.unlink( update );
    node.dispose();
    readout.dispose();
    panel.dispose();
    doneProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
