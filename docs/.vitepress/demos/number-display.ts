import { NumberProperty } from 'scenerystack/axon';
import { Dimension2, Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { NumberDisplay } from 'scenerystack/scenery-phet';
import { VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 100 );
  const voltageProperty = new NumberProperty( 42, { range: range } );

  const numberDisplay = new NumberDisplay( voltageProperty, range, {
    valuePattern: '{{value}} V',
    decimalPlaces: 1,
    textOptions: { fontSize: 26 },
    backgroundFill: '#ffffff',
    backgroundStroke: 'black',
    cornerRadius: 4,
    xMargin: 12,
    yMargin: 6
  } );

  const slider = new HSlider( voltageProperty, range, {
    trackSize: new Dimension2( 220, 5 )
  } );

  const panel = new VBox( {
    spacing: 18,
    align: 'center',
    children: [
      numberDisplay,
      slider
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    slider.dispose();
    numberDisplay.dispose();
    panel.dispose();
    voltageProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
