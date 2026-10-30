import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { ArrowButton } from 'scenerystack/sun';
import { NumberDisplay } from 'scenerystack/scenery-phet';
import { HBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 140;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 20 );
  const valueProperty = new NumberProperty( 10, { range: range } );

  const decrementButton = new ArrowButton( 'left', () => {
    valueProperty.value = Math.max( range.min, valueProperty.value - 1 );
  } );
  const incrementButton = new ArrowButton( 'right', () => {
    valueProperty.value = Math.min( range.max, valueProperty.value + 1 );
  } );

  const numberDisplay = new NumberDisplay( valueProperty, range, {
    textOptions: { fontSize: 24 },
    backgroundStroke: 'black',
    xMargin: 12,
    yMargin: 4
  } );

  const row = new HBox( {
    spacing: 14,
    children: [ decrementButton, numberDisplay, incrementButton ]
  } );

  rootNode.addChild( row );
  const unlinkCenter = centerInDisplay( row, width, height );

  return () => {
    unlinkCenter();
    decrementButton.dispose();
    incrementButton.dispose();
    numberDisplay.dispose();
    row.dispose();
    valueProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
