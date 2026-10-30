import { NumberProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { LinearGradient, Rectangle, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 220;

const RECT_WIDTH = 240;
const RECT_HEIGHT = 90;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0.05, 0.95 );
  const stopProperty = new NumberProperty( 0.5, { range: range } );

  const rectangle = new Rectangle( 0, 0, RECT_WIDTH, RECT_HEIGHT, { cornerRadius: 8, stroke: '#333' } );

  const readout = new Text( '' );
  const update = ( stop: number ): void => {
    rectangle.fill = new LinearGradient( 0, 0, RECT_WIDTH, 0 )
      .addColorStop( 0, '#5B9BD5' )
      .addColorStop( stop, '#8FBF5B' )
      .addColorStop( 1, '#D9782D' );
    readout.string = `middle stop: ${stop.toFixed( 2 )}`;
  };
  stopProperty.link( update );

  const slider = new HSlider( stopProperty, range, { trackSize: new Dimension2( 200, 5 ) } );

  const panel = new VBox( {
    spacing: 18,
    align: 'center',
    children: [ rectangle, readout, slider ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    stopProperty.unlink( update );
    slider.dispose();
    rectangle.dispose();
    readout.dispose();
    panel.dispose();
    stopProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
