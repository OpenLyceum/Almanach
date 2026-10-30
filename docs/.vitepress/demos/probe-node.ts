import { ProbeNode } from 'scenerystack/scenery-phet';
import { Node } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 240;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const probe = new ProbeNode( {
    radius: 55,
    color: '#3378c4',
    sensorTypeFunction: ProbeNode.crosshairs( { intersectionRadius: 6 } )
  } );

  const container = new Node( { children: [ probe ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    probe.dispose();
    container.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
