import { TriangleNode } from 'scenerystack/scenery-phet';
import { HBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 160;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const up = new TriangleNode( {
    pointDirection: 'up',
    triangleWidth: 50,
    triangleHeight: 50,
    fill: '#5B9BD5'
  } );
  const right = new TriangleNode( {
    pointDirection: 'right',
    triangleWidth: 50,
    triangleHeight: 50,
    fill: '#8FBF5B'
  } );
  const down = new TriangleNode( {
    pointDirection: 'down',
    triangleWidth: 50,
    triangleHeight: 50,
    fill: '#D9782D'
  } );

  const row = new HBox( {
    spacing: 24,
    children: [ up, right, down ]
  } );

  rootNode.addChild( row );
  const unlinkCenter = centerInDisplay( row, width, height );

  return () => {
    unlinkCenter();
    up.dispose();
    right.dispose();
    down.dispose();
    row.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
