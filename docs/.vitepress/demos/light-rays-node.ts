import { NumberProperty } from 'scenerystack/axon';
import { Range, Dimension2 } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { LightRaysNode } from 'scenerystack/scenery-phet';
import { Circle, Node, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 360;
export const height = 300;

const BULB_RADIUS = 26;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 1 );
  const brightnessProperty = new NumberProperty( 0.6, { range: range } );

  const rays = new LightRaysNode( BULB_RADIUS, {
    stroke: '#E8B33A',
    lineWidth: 2,
    maxRayLength: 60,
    maxRays: 40
  } );
  const bulb = new Circle( BULB_RADIUS, { fill: '#FFE9A8', stroke: '#E8B33A', lineWidth: 2 } );
  const lamp = new Node( { children: [ rays, bulb ] } );
  // Reserve maximum extent so ray growth does not shift the layout.
  const frame = new Node( { children: [ lamp ], localBounds: new Circle( BULB_RADIUS + 60 ).localBounds } );

  const readout = new Text( '' );
  const update = ( brightness: number ): void => {
    rays.setBrightness( brightness );
    readout.string = `brightness: ${Math.round( brightness * 100 )}%`;
  };
  brightnessProperty.link( update );

  const slider = new HSlider( brightnessProperty, range, { trackSize: new Dimension2( 200, 5 ) } );

  const panel = new VBox( { spacing: 16, align: 'center', children: [ frame, readout, slider ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    brightnessProperty.unlink( update );
    slider.dispose();
    frame.dispose();
    lamp.dispose();
    rays.dispose();
    bulb.dispose();
    readout.dispose();
    panel.dispose();
    brightnessProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
