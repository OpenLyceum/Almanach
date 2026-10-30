import { NumberProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { Orientation } from 'scenerystack/phet-core';
import { Slider } from 'scenerystack/sun';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 280;
export const height = 300;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 100 );
  const valueProperty = new NumberProperty( 40, { range: range } );

  // Slider is the base class; orientation is chosen explicitly rather than via HSlider/VSlider.
  // Vertical trackSize is orientation-specific (thin × tall); Slider swaps it internally.
  const slider = new Slider( valueProperty, range, {
    orientation: Orientation.VERTICAL,
    trackSize: new Dimension2( 5, 160 ),
    majorTickLength: 18
  } );
  slider.addMajorTick( 0, new Text( '0', { fontSize: 14 } ) );
  slider.addMajorTick( 50, new Text( '50', { fontSize: 14 } ) );
  slider.addMajorTick( 100, new Text( '100', { fontSize: 14 } ) );

  const readout = new Text( '' );
  const updateReadout = ( value: number ): void => {
    readout.string = `value: ${Math.round( value )}`;
  };
  valueProperty.link( updateReadout );

  const panel = new VBox( {
    spacing: 18,
    align: 'center',
    children: [ readout, slider ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    valueProperty.unlink( updateReadout );
    slider.dispose();
    readout.dispose();
    panel.dispose();
    valueProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
