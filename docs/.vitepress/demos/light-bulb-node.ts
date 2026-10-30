import { NumberProperty } from 'scenerystack/axon';
import { Range, Dimension2 } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { LightBulbNode } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 300;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 1 );
  const brightnessProperty = new NumberProperty( 0.5, { range: range } );

  const lightBulb = new LightBulbNode( brightnessProperty, {
    bulbImageScale: 0.5
  } );

  const readout = new Text( '' );
  const updateReadout = ( value: number ): void => {
    readout.string = `brightness: ${Math.round( value * 100 )}%`;
  };
  brightnessProperty.link( updateReadout );

  const slider = new HSlider( brightnessProperty, range, {
    trackSize: new Dimension2( 200, 5 )
  } );

  const panel = new VBox( {
    spacing: 14,
    align: 'center',
    children: [
      lightBulb,
      readout,
      slider
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    brightnessProperty.unlink( updateReadout );
    slider.dispose();
    lightBulb.dispose();
    readout.dispose();
    panel.dispose();
    brightnessProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
