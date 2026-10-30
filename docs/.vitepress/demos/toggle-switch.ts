import { Property } from 'scenerystack/axon';
import { Text, VBox } from 'scenerystack/scenery';
import { ToggleSwitch } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 140;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  type Units = 'metric' | 'imperial';
  const unitsProperty = new Property<Units>( 'metric' );

  const readout = new Text( 'Units: metric' );

  const toggleSwitch = new ToggleSwitch( unitsProperty, 'metric', 'imperial' );

  const panel = new VBox( {
    spacing: 12,
    align: 'center',
    children: [
      readout,
      toggleSwitch
    ]
  } );

  unitsProperty.link( value => {
    readout.string = `Units: ${value}`;
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    toggleSwitch.dispose();
    unitsProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
