import { NumberProperty } from 'scenerystack/axon';
import { Range, Dimension2 } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { StarNode, StarShape } from 'scenerystack/scenery-phet';
import { HBox, Node, Path, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 240;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 1 );
  const valueProperty = new NumberProperty( 0.65, { range: range } );

  const readout = new Text( '' );
  const starContainer = new Node();
  let star: StarNode | null = null;

  // Bare StarShape outline, usable in any Path.
  const outline = new Path( new StarShape( { outerRadius: 20, innerRadius: 10 } ), {
    fill: '#fcff03',
    stroke: 'black',
    lineWidth: 1.5
  } );

  const rebuild = ( value: number ): void => {
    if ( star ) {
      star.dispose();
    }
    star = new StarNode( {
      value: value,
      starShapeOptions: { outerRadius: 45, innerRadius: 22 }
    } );
    starContainer.children = [ star ];
    readout.string = `fill: ${Math.round( value * 100 )}%`;
  };
  valueProperty.link( rebuild );

  const slider = new HSlider( valueProperty, range, {
    trackSize: new Dimension2( 200, 5 )
  } );

  const stars = new HBox( { spacing: 24, align: 'center', children: [ starContainer, outline ] } );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [
      stars,
      readout,
      slider
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    valueProperty.unlink( rebuild );
    if ( star ) {
      star.dispose();
    }
    outline.dispose();
    slider.dispose();
    starContainer.dispose();
    stars.dispose();
    readout.dispose();
    panel.dispose();
    valueProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
