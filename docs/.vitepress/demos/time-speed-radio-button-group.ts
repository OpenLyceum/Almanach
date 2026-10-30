import { EnumerationProperty } from 'scenerystack/axon';
import { TimeSpeed, TimeSpeedRadioButtonGroup } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 320;
export const height = 220;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL );

  const group = new TimeSpeedRadioButtonGroup(
    timeSpeedProperty,
    [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
    { spacing: 10 }
  );

  const labels = new Map<TimeSpeed, string>( [
    [ TimeSpeed.SLOW, 'slow' ],
    [ TimeSpeed.NORMAL, 'normal' ]
  ] );
  const readout = new Text( '' );
  const update = ( speed: TimeSpeed ): void => {
    readout.string = `speed: ${labels.get( speed )}`;
  };
  timeSpeedProperty.link( update );

  const panel = new VBox( { spacing: 20, align: 'center', children: [ group, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    timeSpeedProperty.unlink( update );
    group.dispose();
    readout.dispose();
    panel.dispose();
    timeSpeedProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
