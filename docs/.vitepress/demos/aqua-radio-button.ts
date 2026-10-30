import { Property } from 'scenerystack/axon';
import { AquaRadioButton } from 'scenerystack/sun';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 320;
export const height = 220;

type Choice = 'red' | 'green' | 'blue';

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const choiceProperty = new Property<Choice>( 'red' );

  // AquaRadioButton is the single-button building block; each is wired to the same Property.
  const buttons = ( [ 'red', 'green', 'blue' ] as Choice[] ).map( value =>
    new AquaRadioButton( choiceProperty, value, new Text( value, { fontSize: 18 } ) )
  );

  const readout = new Text( '' );
  const update = ( choice: Choice ): void => { readout.string = `selected: ${choice}`; };
  choiceProperty.link( update );

  const panel = new VBox( { spacing: 12, align: 'left', children: [ ...buttons, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    choiceProperty.unlink( update );
    buttons.forEach( b => b.dispose() );
    readout.dispose();
    panel.dispose();
    choiceProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
