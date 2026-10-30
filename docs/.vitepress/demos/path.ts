import { NumberProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { Shape } from 'scenerystack/kite';
import { HSlider } from 'scenerystack/sun';
import { Node, Path, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 260;

function polygonShape( sides: number, radius: number ): Shape {
  const shape = new Shape();
  for ( let i = 0; i < sides; i++ ) {
    const angle = -Math.PI / 2 + i * 2 * Math.PI / sides;
    const x = radius * Math.cos( angle );
    const y = radius * Math.sin( angle );
    i === 0 ? shape.moveTo( x, y ) : shape.lineTo( x, y );
  }
  return shape.close();
}

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 3, 10 );
  const sidesProperty = new NumberProperty( 5, { range: range } );

  const path = new Path( polygonShape( sidesProperty.value, 55 ), {
    fill: '#B05BD5',
    stroke: '#6E2E8A',
    lineWidth: 3
  } );
  const frame = new Node( { children: [ path ], localBounds: polygonShape( 4, 55 ).bounds } );

  const readout = new Text( '' );
  const update = ( sides: number ): void => {
    path.shape = polygonShape( Math.round( sides ), 55 );
    readout.string = `sides: ${Math.round( sides )}`;
  };
  sidesProperty.link( update );

  const slider = new HSlider( sidesProperty, range, {
    trackSize: new Dimension2( 200, 5 ),
    constrainValue: value => Math.round( value )
  } );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [ frame, readout, slider ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    sidesProperty.unlink( update );
    slider.dispose();
    frame.dispose();
    path.dispose();
    readout.dispose();
    panel.dispose();
    sidesProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
