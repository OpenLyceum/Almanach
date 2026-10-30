import { NumberProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { Line, Node, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 240;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 180 );
  const angleProperty = new NumberProperty( 30, { range: range } );

  const radius = 70;
  const line = new Line( -radius, 0, radius, 0, {
    stroke: '#D9782D',
    lineWidth: 6,
    lineCap: 'round'
  } );
  // A fixed frame so the rotating line does not shift the layout.
  const frame = new Node( { children: [ line ], localBounds: new Line( -radius, -radius, radius, radius ).localBounds } );

  const readout = new Text( '' );
  const update = ( degrees: number ): void => {
    const radians = degrees * Math.PI / 180;
    line.x1 = -radius * Math.cos( radians );
    line.y1 = radius * Math.sin( radians );
    line.x2 = radius * Math.cos( radians );
    line.y2 = -radius * Math.sin( radians );
    readout.string = `angle: ${Math.round( degrees )}°`;
  };
  angleProperty.link( update );

  const slider = new HSlider( angleProperty, range, { trackSize: new Dimension2( 200, 5 ) } );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [ frame, readout, slider ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    angleProperty.unlink( update );
    slider.dispose();
    frame.dispose();
    line.dispose();
    readout.dispose();
    panel.dispose();
    angleProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
