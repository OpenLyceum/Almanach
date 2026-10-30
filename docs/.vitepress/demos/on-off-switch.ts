import { BooleanProperty } from 'scenerystack/axon';
import { Text, VBox } from 'scenerystack/scenery';
import { OnOffSwitch } from 'scenerystack/sun';
import { Tandem } from 'scenerystack/tandem';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 140;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const soundEnabledProperty = new BooleanProperty( true );

  const readout = new Text( 'Sound: on' );

  // Tandem.OPTIONAL satisfies the required options argument; demos are not instrumented.
  const soundSwitch = new OnOffSwitch( soundEnabledProperty, { tandem: Tandem.OPTIONAL } );

  soundEnabledProperty.link( enabled => {
    readout.string = `Sound: ${enabled ? 'on' : 'off'}`;
  } );

  const panel = new VBox( {
    spacing: 12,
    align: 'center',
    children: [
      readout,
      soundSwitch
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    soundSwitch.dispose();
    soundEnabledProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
