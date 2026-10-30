import { NumberProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { Rectangle, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 280;

const COLORS = [ '#5B9BD5', '#8FBF5B', '#D9782D', '#B05BD5' ];

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 30 );
  const spacingProperty = new NumberProperty( 8, { range: range } );

  const boxes = COLORS.map( ( color, i ) => new Rectangle( 0, 0, 60 + i * 24, 26, { fill: color, cornerRadius: 4 } ) );
  const vbox = new VBox( { spacing: spacingProperty.value, align: 'left', children: boxes } );

  const readout = new Text( '' );
  const update = ( spacing: number ): void => {
    vbox.spacing = spacing;
    readout.string = `spacing: ${Math.round( spacing )}`;
  };
  spacingProperty.link( update );

  const slider = new HSlider( spacingProperty, range, { trackSize: new Dimension2( 200, 5 ) } );

  const panel = new VBox( {
    spacing: 18,
    align: 'center',
    children: [ vbox, readout, slider ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    spacingProperty.unlink( update );
    slider.dispose();
    vbox.dispose();
    boxes.forEach( b => b.dispose() );
    readout.dispose();
    panel.dispose();
    spacingProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
