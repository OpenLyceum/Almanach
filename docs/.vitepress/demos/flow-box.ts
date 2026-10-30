import { Circle, HBox, Rectangle } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 420;
export const height = 160;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  // HBox is FlowBox with orientation fixed to 'horizontal' — matching the doc sample.
  const row = new HBox( {
    spacing: 10,
    align: 'center',
    children: [
      new Circle( 15, { fill: 'crimson' } ),
      new Rectangle( 0, 0, 40, 30, { fill: 'teal' } ),
      new Circle( 10, { fill: 'goldenrod' } )
    ]
  } );

  rootNode.addChild( row );
  const unlinkCenter = centerInDisplay( row, width, height );

  return () => {
    unlinkCenter();
    row.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
