import { Node } from 'scenerystack/scenery';
import { ElapsedTimeNode, GameTimer } from 'scenerystack/vegas';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 120;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const gameTimer = new GameTimer();
  gameTimer.start();

  const elapsedTimeNode = new ElapsedTimeNode( gameTimer.elapsedTimeProperty, {
    clockIconRadius: 15,
    textFill: 'black'
  } );

  const container = new Node( { children: [ elapsedTimeNode ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    gameTimer.stop();
    elapsedTimeNode.dispose();
    container.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
