import { BooleanProperty, EnumerationProperty } from 'scenerystack/axon';
import { TimeControlNode, TimeSpeed } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const isPlayingProperty = new BooleanProperty( true );
  const timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL );

  const readout = new Text( '' );
  const speedLabel = (): string =>
    timeSpeedProperty.value === TimeSpeed.SLOW ? 'slow' :
    timeSpeedProperty.value === TimeSpeed.FAST ? 'fast' : 'normal';
  const updateReadout = (): void => {
    readout.string = `${isPlayingProperty.value ? 'playing' : 'paused'} · ${speedLabel()}`;
  };
  isPlayingProperty.link( updateReadout );
  timeSpeedProperty.link( updateReadout );

  const timeControl = new TimeControlNode( isPlayingProperty, {
    timeSpeedProperty: timeSpeedProperty,
    playPauseStepButtonOptions: {
      includeStepBackwardButton: true
    }
  } );

  const panel = new VBox( {
    spacing: 14,
    align: 'center',
    children: [
      timeControl,
      readout
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    isPlayingProperty.unlink( updateReadout );
    timeSpeedProperty.unlink( updateReadout );
    timeControl.dispose();
    readout.dispose();
    panel.dispose();
    isPlayingProperty.dispose();
    timeSpeedProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
