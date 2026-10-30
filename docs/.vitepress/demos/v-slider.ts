import { NumberProperty } from 'scenerystack/axon';
import { Range, Dimension2 } from 'scenerystack/dot';
import { Text, VBox } from 'scenerystack/scenery';
import { VSlider } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 340;
export const height = 240;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const volumeProperty = new NumberProperty( 50, {
    range: new Range( 0, 100 )
  } );

  const readout = new Text( '50%' );

  const slider = new VSlider( volumeProperty, new Range( 0, 100 ), {
    trackSize: new Dimension2( 8, 120 )
  } );
  slider.addMajorTick( 0, new Text( '0%', { fontSize: 14 } ) );
  slider.addMajorTick( 100, new Text( '100%', { fontSize: 14 } ) );

  const panel = new VBox( {
    spacing: 10,
    align: 'center',
    children: [
      readout,
      slider
    ]
  } );

  const updateReadout = ( value: number ): void => {
    readout.string = `${Math.round( value )}%`;
  };
  volumeProperty.link( updateReadout );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    volumeProperty.unlink( updateReadout );
    panel.dispose();
    slider.dispose();
    volumeProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
