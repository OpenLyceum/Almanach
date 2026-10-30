import { NumberProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { Node, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 220;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 12, 48 );
  const fontSizeProperty = new NumberProperty( 28, { range: range } );

  const text = new Text( 'Scenery', { fontSize: fontSizeProperty.value, fill: '#2E5F8A' } );
  const frame = new Node( { children: [ text ], localBounds: new Text( 'Scenery', { fontSize: 48 } ).localBounds } );

  const readout = new Text( '' );
  const update = ( fontSize: number ): void => {
    text.fontSize = fontSize;
    readout.string = `fontSize: ${Math.round( fontSize )}px`;
  };
  fontSizeProperty.link( update );

  const slider = new HSlider( fontSizeProperty, range, { trackSize: new Dimension2( 200, 5 ) } );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [ frame, readout, slider ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    fontSizeProperty.unlink( update );
    slider.dispose();
    frame.dispose();
    text.dispose();
    readout.dispose();
    panel.dispose();
    fontSizeProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
