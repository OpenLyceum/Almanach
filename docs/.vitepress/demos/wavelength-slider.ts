import { NumberProperty } from 'scenerystack/axon';
import { Dimension2 } from 'scenerystack/dot';
import { WavelengthNumberControl, WavelengthSpectrumNode } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 280;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const wavelengthProperty = new NumberProperty( 500 );

  // A NumberControl whose slider track shows the visible spectrum.
  const control = new WavelengthNumberControl( wavelengthProperty, {
    title: 'Wavelength'
  } );

  // Static spectrum legend bar (non-interactive).
  const legend = new WavelengthSpectrumNode( {
    size: new Dimension2( 200, 20 )
  } );

  const readout = new Text( '' );
  const update = ( wavelength: number ): void => {
    readout.string = `${Math.round( wavelength )} nm`;
  };
  wavelengthProperty.link( update );

  const panel = new VBox( { spacing: 16, align: 'center', children: [ control, legend, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    wavelengthProperty.unlink( update );
    control.dispose();
    legend.dispose();
    readout.dispose();
    panel.dispose();
    wavelengthProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
