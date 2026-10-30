import { NumberProperty } from 'scenerystack/axon';
import { LevelCompletedNode } from 'scenerystack/vegas';
import { Node, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 380;
export const height = 340;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const continuesProperty = new NumberProperty( 0 );
  const nodeContainer = new Node();

  const build = (): LevelCompletedNode => new LevelCompletedNode(
    3,      // level
    7,      // score
    8,      // perfectScore
    3,      // numberOfStars
    true,   // timerEnabled
    63,     // elapsedTime (seconds)
    90,     // bestTimeAtThisLevel
    false,  // isNewBestTime
    () => { continuesProperty.value += 1; }, // continue handler
    { contentMaxWidth: 260, scale: 0.85 }
  );

  let node = build();
  nodeContainer.addChild( node );

  const readout = new Text( '' );
  const update = ( count: number ): void => {
    readout.string = count === 0 ? 'press Continue' : `continued ${count}×`;
  };
  continuesProperty.link( update );

  const panel = new VBox( { spacing: 12, align: 'center', children: [ nodeContainer, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    continuesProperty.unlink( update );
    node.dispose();
    nodeContainer.dispose();
    readout.dispose();
    panel.dispose();
    continuesProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
