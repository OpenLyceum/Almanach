import { Dimension2 } from 'scenerystack/dot';
import { MagnifyingGlassNode, PlusNode } from 'scenerystack/scenery-phet';
import { HBox, Node } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const glassRadius = 45;
  const withIcon = new MagnifyingGlassNode( {
    glassRadius: glassRadius,
    glassFill: '#e8f4ff',
    icon: new PlusNode( { size: new Dimension2( 1.3 * glassRadius, glassRadius / 3 ) } )
  } );

  // Plain magnifying glass, no icon inside.
  const plain = new MagnifyingGlassNode( {
    glassRadius: 20
  } );

  const row = new HBox( { spacing: 40, align: 'center', children: [ withIcon, plain ] } );
  const container = new Node( { children: [ row ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    withIcon.dispose();
    plain.dispose();
    row.dispose();
    container.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
