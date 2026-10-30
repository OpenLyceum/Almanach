import { NumberProperty } from 'scenerystack/axon';
import { Range, Dimension2 } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { ScoreDisplayLabeledNumber, ScoreDisplayLabeledStars, ScoreDisplayStars } from 'scenerystack/vegas';
import { VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 360;
export const height = 260;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 5 );
  const scoreProperty = new NumberProperty( 3, { range: range } );

  const labeledNumber = new ScoreDisplayLabeledNumber( scoreProperty );

  const labeledStars = new ScoreDisplayLabeledStars( scoreProperty, {
    scoreDisplayStarsOptions: {
      numberOfStars: 5,
      perfectScore: 5,
      starNodeOptions: { starShapeOptions: { outerRadius: 16, innerRadius: 8 } }
    }
  } );

  const bareStars = new ScoreDisplayStars( scoreProperty, {
    numberOfStars: 5,
    perfectScore: 5,
    starNodeOptions: { starShapeOptions: { outerRadius: 20, innerRadius: 10 } }
  } );

  const slider = new HSlider( scoreProperty, range, { trackSize: new Dimension2( 220, 5 ) } );

  const panel = new VBox( {
    spacing: 18,
    align: 'center',
    children: [ labeledNumber, labeledStars, bareStars, slider ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    slider.dispose();
    labeledNumber.dispose();
    labeledStars.dispose();
    bareStars.dispose();
    panel.dispose();
    scoreProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
