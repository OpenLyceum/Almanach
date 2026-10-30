import { StringProperty } from 'scenerystack/axon';
import { EraserButton } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 180;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const statusProperty = new StringProperty( 'board has marks' );

  const button = new EraserButton( {
    iconWidth: 24,
    listener: () => {
      statusProperty.value = 'board erased';
    }
  } );

  const readout = new Text( '' );
  const updateReadout = ( status: string ): void => {
    readout.string = status;
  };
  statusProperty.link( updateReadout );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [
      button,
      readout
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    statusProperty.unlink( updateReadout );
    button.dispose();
    readout.dispose();
    panel.dispose();
    statusProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
