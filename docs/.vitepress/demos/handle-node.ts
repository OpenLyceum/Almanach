import { HandleNode } from 'scenerystack/scenery-phet';
import { HBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const handle = new HandleNode( {
    scale: 0.6,
    gripBaseColor: '#8FBF5B'
  } );

  const wallHandle = new HandleNode( {
    scale: 0.6,
    gripBaseColor: '#8FBF5B',
    hasRightAttachment: false,
    attachmentFill: 'darkgray'
  } );

  const row = new HBox( { spacing: 40, align: 'center', children: [ handle, wallHandle ] } );

  rootNode.addChild( row );
  const unlinkCenter = centerInDisplay( row, width, height );

  return () => {
    unlinkCenter();
    handle.dispose();
    wallHandle.dispose();
    row.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
