import { BracketNode } from 'scenerystack/scenery-phet';
import { HBox, Text } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const bracket = new BracketNode( {
    orientation: 'down',
    bracketLength: 220,
    labelNode: new Text( 'wavelength', { fontSize: 16 } ),
    bracketStroke: '#2E5F8A',
    bracketLineWidth: 3
  } );

  const sideBracket = new BracketNode( {
    orientation: 'right',
    bracketLength: 80,
    bracketTipPosition: 0.3,
    labelNode: new Text( 'Δy', { fontSize: 16 } ),
    bracketStroke: '#2E5F8A',
    bracketLineWidth: 3
  } );

  const row = new HBox( { spacing: 40, align: 'center', children: [ bracket, sideBracket ] } );

  rootNode.addChild( row );
  const unlinkCenter = centerInDisplay( row, width, height );

  return () => {
    unlinkCenter();
    bracket.dispose();
    sideBracket.dispose();
    row.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
