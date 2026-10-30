import { NumberProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { Node, Rectangle, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 240;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 40 );
  const cornerRadiusProperty = new NumberProperty( 12, { range: range } );

  const rectangle = new Rectangle( 0, 0, 140, 90, {
    fill: '#8FBF5B',
    stroke: '#4F7A2E',
    lineWidth: 2,
    cornerRadius: cornerRadiusProperty.value
  } );
  const frame = new Node( { children: [ rectangle ] } );

  const readout = new Text( '' );
  const update = ( cornerRadius: number ): void => {
    rectangle.cornerRadius = cornerRadius;
    readout.string = `cornerRadius: ${Math.round( cornerRadius )}`;
  };
  cornerRadiusProperty.link( update );

  const slider = new HSlider( cornerRadiusProperty, range, { trackSize: new Dimension2( 200, 5 ) } );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [ frame, readout, slider ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    cornerRadiusProperty.unlink( update );
    slider.dispose();
    frame.dispose();
    rectangle.dispose();
    readout.dispose();
    panel.dispose();
    cornerRadiusProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
