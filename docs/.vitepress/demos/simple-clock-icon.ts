import { PaperAirplaneNode, SimpleClockIcon } from 'scenerystack/scenery-phet';
import { HBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 320;
export const height = 160;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const clock = new SimpleClockIcon( 34, { fill: '#e9eef5', stroke: '#2E5F8A' } );
  const airplane = new PaperAirplaneNode( { fill: '#5B9BD5', scale: 2.4 } );

  const row = new HBox( { spacing: 40, align: 'center', children: [ clock, airplane ] } );

  rootNode.addChild( row );
  const unlinkCenter = centerInDisplay( row, width, height );

  return () => {
    unlinkCenter();
    clock.dispose();
    airplane.dispose();
    row.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
