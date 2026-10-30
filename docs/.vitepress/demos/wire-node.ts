import { Property } from 'scenerystack/axon';
import { Vector2 } from 'scenerystack/dot';
import { WireNode } from 'scenerystack/scenery-phet';
import { Circle, Node } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 360;
export const height = 220;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const position1 = new Vector2( 20, 30 );
  const position2 = new Vector2( 260, 150 );

  const position1Property = new Property( position1 );
  const position2Property = new Property( position2 );
  // Normals set the direction the wire leaves each terminal; longer = more slack.
  const normal1Property = new Property( new Vector2( 120, 0 ) );
  const normal2Property = new Property( new Vector2( -120, 0 ) );

  const wire = new WireNode( position1Property, normal1Property, position2Property, normal2Property, {
    stroke: '#B87333',
    lineWidth: 4
  } );

  const terminal1 = new Circle( 7, { fill: '#333', center: position1 } );
  const terminal2 = new Circle( 7, { fill: '#333', center: position2 } );

  const stage = new Node( { children: [ wire, terminal1, terminal2 ] } );

  rootNode.addChild( stage );
  const unlinkCenter = centerInDisplay( stage, width, height );

  return () => {
    unlinkCenter();
    wire.dispose();
    terminal1.dispose();
    terminal2.dispose();
    stage.dispose();
    position1Property.dispose();
    position2Property.dispose();
    normal1Property.dispose();
    normal2Property.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
