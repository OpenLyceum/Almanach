import { NumberProperty } from 'scenerystack/axon';
import { InfoButton } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 180;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const pressCountProperty = new NumberProperty( 0 );

  const button = new InfoButton( {
    scale: 0.9,
    listener: () => {
      pressCountProperty.value += 1;
    }
  } );

  const readout = new Text( '' );
  const updateReadout = ( count: number ): void => {
    readout.string = `pressed ${count} time${count === 1 ? '' : 's'}`;
  };
  pressCountProperty.link( updateReadout );

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
    pressCountProperty.unlink( updateReadout );
    button.dispose();
    readout.dispose();
    panel.dispose();
    pressCountProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
