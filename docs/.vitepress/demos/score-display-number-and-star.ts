import { NumberProperty } from 'scenerystack/axon';
import { PhetFont } from 'scenerystack/scenery-phet';
import { VBox } from 'scenerystack/scenery';
import { TextPushButton } from 'scenerystack/sun';
import { ScoreDisplayNumberAndStar } from 'scenerystack/vegas';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 160;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const scoreProperty = new NumberProperty( 0 );

  const scoreDisplay = new ScoreDisplayNumberAndStar( scoreProperty, {
    font: new PhetFont( 20 ),
    scoreDecimalPlaces: 0
  } );

  const incrementButton = new TextPushButton( 'Score a point', {
    baseColor: '#F2D94E',
    listener: () => {
      scoreProperty.value++;
    }
  } );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [
      scoreDisplay,
      incrementButton
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    scoreDisplay.dispose();
    incrementButton.dispose();
    scoreProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
