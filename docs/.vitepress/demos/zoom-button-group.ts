import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { MagnifyingGlassZoomButtonGroup, PlusMinusZoomButtonGroup } from 'scenerystack/scenery-phet';
import { HBox, Node, Rectangle, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 420;
export const height = 220;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const zoomLevelProperty = new NumberProperty( 2, { range: new Range( 1, 5 ) } );

  const plusMinusGroup = new PlusMinusZoomButtonGroup( zoomLevelProperty, { orientation: 'vertical' } );
  const magnifyingGroup = new MagnifyingGlassZoomButtonGroup( zoomLevelProperty, { orientation: 'vertical' } );

  const shape = new Rectangle( 0, 0, 40, 40, { fill: '#5B9BD5', cornerRadius: 4 } );
  const shapeContainer = new Node( { children: [ shape ] } );
  // Reserve room for the largest zoom so centering stays put.
  const frame = new Node( { children: [ shapeContainer ], localBounds: new Rectangle( 0, 0, 40 * 5, 40 * 5 ).localBounds } );

  const update = ( zoom: number ): void => {
    shapeContainer.setScaleMagnitude( zoom );
  };
  zoomLevelProperty.link( update );

  const buttonGroups = new VBox( {
    spacing: 16,
    align: 'center',
    children: [ plusMinusGroup, magnifyingGroup ]
  } );

  const panel = new HBox( { spacing: 30, align: 'center', children: [ frame, buttonGroups ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    zoomLevelProperty.unlink( update );
    plusMinusGroup.dispose();
    magnifyingGroup.dispose();
    buttonGroups.dispose();
    frame.dispose();
    shapeContainer.dispose();
    shape.dispose();
    panel.dispose();
    zoomLevelProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
