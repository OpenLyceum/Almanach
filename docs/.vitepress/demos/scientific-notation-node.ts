import { NumberProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { PhetFont, ScientificNotationNode } from 'scenerystack/scenery-phet';
import { Node, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0.0001, 100000 );
  const valueProperty = new NumberProperty( 8000, { range: range } );

  const notation = new ScientificNotationNode( valueProperty, {
    mantissaDecimalPlaces: 2,
    font: new PhetFont( 30 )
  } );
  const frame = new Node( { children: [ notation ], localBounds: notation.localBounds.dilatedX( 60 ) } );

  const slider = new HSlider( valueProperty, range, { trackSize: new Dimension2( 220, 5 ) } );

  const panel = new VBox( { spacing: 24, align: 'center', children: [ frame, slider ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    slider.dispose();
    frame.dispose();
    notation.dispose();
    panel.dispose();
    valueProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
