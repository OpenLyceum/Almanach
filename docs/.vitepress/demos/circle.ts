import { NumberProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { Circle, Node, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 260;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 10, 60 );
  const radiusProperty = new NumberProperty( 40, { range: range } );

  const circle = new Circle( radiusProperty.value, {
    fill: '#5B9BD5',
    stroke: '#2E5F8A',
    lineWidth: 2
  } );

  // A fixed-size frame keeps the layout from jumping as the circle grows.
  const frame = new Node( { children: [ circle ], localBounds: new Circle( 60 ).localBounds } );

  const readout = new Text( '' );
  const update = ( radius: number ): void => {
    circle.radius = radius;
    readout.string = `radius: ${Math.round( radius )}`;
  };
  radiusProperty.link( update );

  const slider = new HSlider( radiusProperty, range, { trackSize: new Dimension2( 200, 5 ) } );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [ frame, readout, slider ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    radiusProperty.unlink( update );
    slider.dispose();
    frame.dispose();
    circle.dispose();
    readout.dispose();
    panel.dispose();
    radiusProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
