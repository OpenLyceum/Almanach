import { RulerNode } from 'scenerystack/scenery-phet';
import { Node } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 160;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const rulerWidth = 300;
  const rulerHeight = 60;
  const majorTickWidth = 50;
  const majorTickLabels = [ '0', '1', '2', '3', '4', '5', '6' ];

  const ruler = new RulerNode(
    rulerWidth,
    rulerHeight,
    majorTickWidth,
    majorTickLabels,
    'cm',
    {
      minorTicksPerMajorTick: 4,
      insetsWidth: 15
    }
  );

  const container = new Node( { children: [ ruler ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    ruler.dispose();
    container.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
