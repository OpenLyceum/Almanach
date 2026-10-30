import { StopSignNode } from 'scenerystack/scenery-phet';
import { Node } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 180;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const stopSign = new StopSignNode( {
    fillRadius: 55
  } );

  const container = new Node( { children: [ stopSign ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    stopSign.dispose();
    container.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
