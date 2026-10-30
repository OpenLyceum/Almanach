import { Property } from 'scenerystack/axon';
import { ABSwitch } from 'scenerystack/sun';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 180;

type Mode = 'slow' | 'fast';

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const modeProperty = new Property<Mode>( 'slow' );

  const labelA = new Text( 'Slow', {
    fontSize: 18
  } );
  const labelB = new Text( 'Fast', {
    fontSize: 18
  } );

  const abSwitch = new ABSwitch( modeProperty, 'slow', labelA, 'fast', labelB );

  const readout = new Text( '' );
  const updateReadout = ( mode: Mode ): void => {
    readout.string = `mode: ${mode}`;
  };
  modeProperty.link( updateReadout );

  const panel = new VBox( {
    spacing: 18,
    align: 'center',
    children: [ abSwitch, readout ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    modeProperty.unlink( updateReadout );
    abSwitch.dispose();
    labelA.dispose();
    labelB.dispose();
    readout.dispose();
    panel.dispose();
    modeProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
