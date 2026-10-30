import { NumberProperty } from 'scenerystack/axon';
import { Text, VBox } from 'scenerystack/scenery';
import { StarNode } from 'scenerystack/scenery-phet';
import { LevelSelectionButton, ScoreDisplayNumberAndStar } from 'scenerystack/vegas';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 240;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const scoreProperty = new NumberProperty( 0 );

  const readout = new Text( 'Score: 0' );

  const levelButton = new LevelSelectionButton( new StarNode(), scoreProperty, {
    buttonWidth: 110,
    buttonHeight: 110,
    createScoreDisplay: score => new ScoreDisplayNumberAndStar( score ),
    listener: () => {
      scoreProperty.value = ( scoreProperty.value + 1 ) % 4;
    }
  } );

  const hint = new Text( 'Click the button to change the score' );

  const panel = new VBox( {
    spacing: 12,
    align: 'center',
    children: [
      readout,
      levelButton,
      hint
    ]
  } );

  scoreProperty.link( score => {
    readout.string = `Score: ${score}`;
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    levelButton.dispose();
    scoreProperty.dispose();
    readout.dispose();
    hint.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
