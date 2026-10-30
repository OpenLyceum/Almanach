import { BooleanProperty } from 'scenerystack/axon';
import { EyeDropperNode } from 'scenerystack/scenery-phet';
import { Checkbox } from 'scenerystack/sun';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 320;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const isDispensingProperty = new BooleanProperty( false );
  const isEmptyProperty = new BooleanProperty( false );

  const eyeDropper = new EyeDropperNode( {
    isDispensingProperty: isDispensingProperty,
    isEmptyProperty: isEmptyProperty,
    fluidColor: '#4a90d9'
  } );

  const readout = new Text( 'button up' );
  const updateReadout = ( isDispensing: boolean ): void => {
    readout.string = isDispensing ? 'dispensing…' : 'button up';
  };
  isDispensingProperty.link( updateReadout );

  const emptyCheckbox = new Checkbox(
    isEmptyProperty,
    new Text( 'empty', { fontSize: 13 } )
  );

  const panel = new VBox( {
    spacing: 12,
    align: 'center',
    children: [
      eyeDropper,
      readout,
      emptyCheckbox
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    isDispensingProperty.unlink( updateReadout );
    eyeDropper.dispose();
    emptyCheckbox.dispose();
    readout.dispose();
    panel.dispose();
    isDispensingProperty.dispose();
    isEmptyProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
