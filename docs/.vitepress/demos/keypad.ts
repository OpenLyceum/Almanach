import { Text, VBox } from 'scenerystack/scenery';
import { Keypad } from 'scenerystack/scenery-phet';
import { RectangularPushButton } from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 380;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const keypad = new Keypad( Keypad.PositiveAndNegativeFloatingPointLayout, {
    accumulatorOptions: {
      maxDigits: 4,
      maxDigitsRightOfMantissa: 2
    }
  } );

  const readout = new Text( 'value: 0' );
  const updateReadout = ( string: string ): void => {
    readout.string = `value: ${string.length ? string : '0'}`;
  };
  keypad.stringProperty.link( updateReadout );

  const clearButton = new RectangularPushButton( {
    content: new Text( 'Clear' ),
    listener: () => {
      keypad.clear();
    }
  } );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [
      readout,
      keypad,
      clearButton
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    keypad.stringProperty.unlink( updateReadout );
    keypad.dispose();
    clearButton.dispose();
    readout.dispose();
    panel.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
