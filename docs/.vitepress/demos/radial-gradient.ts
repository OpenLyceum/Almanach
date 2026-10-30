import { NumberProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { Circle, RadialGradient, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 260;

const RADIUS = 60;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( -1, 1 );
  const highlightProperty = new NumberProperty( -0.4, { range: range } );

  const circle = new Circle( RADIUS, { stroke: '#333' } );

  const readout = new Text( '' );
  const update = ( offset: number ): void => {
    const hx = offset * RADIUS * 0.6;
    const hy = -0.4 * RADIUS;
    circle.fill = new RadialGradient( hx, hy, 0, 0, 0, RADIUS )
      .addColorStop( 0, '#EED8FF' )
      .addColorStop( 1, '#6E2E8A' );
    readout.string = `highlight x: ${offset.toFixed( 2 )}`;
  };
  highlightProperty.link( update );

  const slider = new HSlider( highlightProperty, range, { trackSize: new Dimension2( 200, 5 ) } );

  const panel = new VBox( {
    spacing: 18,
    align: 'center',
    children: [ circle, readout, slider ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    highlightProperty.unlink( update );
    slider.dispose();
    circle.dispose();
    readout.dispose();
    panel.dispose();
    highlightProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
