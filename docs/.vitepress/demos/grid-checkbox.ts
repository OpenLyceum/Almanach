import { BooleanProperty, Property } from 'scenerystack/axon';
import { Vector2 } from 'scenerystack/dot';
import { ModelViewTransform2 } from 'scenerystack/phetcommon';
import { GridCheckbox, GridNode } from 'scenerystack/scenery-phet';
import { Node, Rectangle, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 320;
export const height = 260;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const gridVisibleProperty = new BooleanProperty( true );

  const background = new Rectangle( 0, 0, 150, 150, { fill: 'white', stroke: '#999' } );
  const transformProperty = new Property( ModelViewTransform2.createIdentity() );
  const grid = new GridNode( transformProperty, 25, new Vector2( 75, 75 ), 3, {
    stroke: '#8AA4C4',
    lineWidth: 1
  } );
  // Elsewhere, a GridNode reacts to the same Property:
  grid.visibleProperty = gridVisibleProperty;

  const board = new Node( { children: [ background, grid ] } );

  const checkbox = new GridCheckbox( gridVisibleProperty );

  const panel = new VBox( { spacing: 20, align: 'center', children: [ board, checkbox ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    checkbox.dispose();
    board.dispose();
    grid.dispose();
    background.dispose();
    panel.dispose();
    transformProperty.dispose();
    gridVisibleProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
