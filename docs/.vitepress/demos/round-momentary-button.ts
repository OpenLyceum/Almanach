import { BooleanProperty } from 'scenerystack/axon';
import { RectangularMomentaryButton, RoundMomentaryButton } from 'scenerystack/sun';
import { HBox, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 360;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const onProperty = new BooleanProperty( false );

  // Value is true only while a button is held down.
  const roundButton = new RoundMomentaryButton( onProperty, false, true, {
    baseColor: '#8FBF5B',
    radius: 34
  } );

  const rectangularButton = new RectangularMomentaryButton( onProperty, false, true, {
    content: new Text( 'Hold' ),
    baseColor: '#8FBF5B'
  } );

  const buttons = new HBox( {
    spacing: 24,
    align: 'center',
    children: [ roundButton, rectangularButton ]
  } );

  const readout = new Text( '' );
  const update = ( on: boolean ): void => { readout.string = on ? 'held down' : 'released'; };
  onProperty.link( update );

  const panel = new VBox( { spacing: 20, align: 'center', children: [ buttons, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    onProperty.unlink( update );
    roundButton.dispose();
    rectangularButton.dispose();
    buttons.dispose();
    readout.dispose();
    panel.dispose();
    onProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
