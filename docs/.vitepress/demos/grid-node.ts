import { NumberProperty, Property } from 'scenerystack/axon';
import { Dimension2, Range, Vector2 } from 'scenerystack/dot';
import { ModelViewTransform2 } from 'scenerystack/phetcommon';
import { HSlider } from 'scenerystack/sun';
import { GridNode } from 'scenerystack/scenery-phet';
import { Node, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 360;
export const height = 300;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 15, 40 );
  const spacingProperty = new NumberProperty( 24, { range: range } );

  const transformProperty = new Property( ModelViewTransform2.createIdentity() );

  const gridContainer = new Node();
  let grid: GridNode | null = null;
  const rebuild = ( spacing: number ): void => {
    grid && grid.dispose();
    grid = new GridNode( transformProperty, spacing, new Vector2( 0, 0 ), 4, {
      stroke: '#8AA4C4',
      lineWidth: 1
    } );
    gridContainer.children = [ grid ];
  };
  spacingProperty.link( rebuild );

  const readout = new Text( '' );
  const updateReadout = ( spacing: number ): void => {
    readout.string = `spacing: ${Math.round( spacing )}`;
  };
  spacingProperty.link( updateReadout );

  const slider = new HSlider( spacingProperty, range, { trackSize: new Dimension2( 200, 5 ) } );

  const panel = new VBox( { spacing: 18, align: 'center', children: [ gridContainer, readout, slider ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    spacingProperty.unlink( rebuild );
    spacingProperty.unlink( updateReadout );
    slider.dispose();
    grid && grid.dispose();
    gridContainer.dispose();
    readout.dispose();
    panel.dispose();
    transformProperty.dispose();
    spacingProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
