import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { NumberControl } from 'scenerystack/scenery-phet';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 420;
export const height = 160;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const frequencyProperty = new NumberProperty( 5, {
    range: new Range( 0, 10 )
  } );

  const frequencyControl = new NumberControl(
    'Frequency',
    frequencyProperty,
    new Range( 0, 10 ),
    {
      delta: 0.5,
      numberDisplayOptions: {
        decimalPlaces: 1,
        valuePattern: '{{value}} Hz'
      }
    }
  );

  rootNode.addChild( frequencyControl );
  const unlinkCenter = centerInDisplay( frequencyControl, width, height );

  return () => {
    unlinkCenter();
    frequencyControl.dispose();
    frequencyProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
