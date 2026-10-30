import { BooleanProperty } from 'scenerystack/axon';
import { PlayPauseButton } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const isPlayingProperty = new BooleanProperty( true );

  const button = new PlayPauseButton( isPlayingProperty, {
    radius: 32
  } );

  const readout = new Text( '' );
  const updateReadout = ( isPlaying: boolean ): void => {
    readout.string = isPlaying ? 'playing' : 'paused';
  };
  isPlayingProperty.link( updateReadout );

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
    isPlayingProperty.unlink( updateReadout );
    button.dispose();
    readout.dispose();
    panel.dispose();
    isPlayingProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
