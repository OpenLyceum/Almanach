import { NumberProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { HBox, Rectangle, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 420;
export const height = 220;

const COLORS = [ '#5B9BD5', '#8FBF5B', '#D9782D', '#B05BD5' ];

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 40 );
  const spacingProperty = new NumberProperty( 12, { range: range } );

  const boxes = COLORS.map( ( color, i ) => new Rectangle( 0, 0, 44, 30 + i * 12, { fill: color, cornerRadius: 4 } ) );
  const hbox = new HBox( { spacing: spacingProperty.value, align: 'bottom', children: boxes } );

  const readout = new Text( '' );
  const update = ( spacing: number ): void => {
    hbox.spacing = spacing;
    readout.string = `spacing: ${Math.round( spacing )}`;
  };
  spacingProperty.link( update );

  const slider = new HSlider( spacingProperty, range, { trackSize: new Dimension2( 220, 5 ) } );

  const panel = new VBox( {
    spacing: 18,
    align: 'center',
    children: [ hbox, readout, slider ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    spacingProperty.unlink( update );
    slider.dispose();
    hbox.dispose();
    boxes.forEach( b => b.dispose() );
    readout.dispose();
    panel.dispose();
    spacingProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
