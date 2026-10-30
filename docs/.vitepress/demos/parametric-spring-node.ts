import { Range, Dimension2 } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { ParametricSpringNode } from 'scenerystack/scenery-phet';
import { HBox, Node, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 440;
export const height = 260;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const spring = new ParametricSpringNode( {
    frontColor: '#8AB6E0',
    middleColor: '#3E7CB5',
    backColor: '#204E7A',
    loops: 8,
    radius: 18,
    aspectRatio: 3,
    lineWidth: 3,
    xScale: 2.5
  } );
  const frame = new Node( { children: [ spring ], localBounds: spring.localBounds.dilated( 6 ) } );

  const loopsRange = new Range( 4, 14 );
  const radiusRange = new Range( 8, 28 );
  spring.loopsProperty.value = 8;
  spring.radiusProperty.value = 18;

  const labeledSlider = ( label: string, slider: HSlider ): VBox =>
    new VBox( { spacing: 6, align: 'center', children: [ new Text( label, { fontSize: 13 } ), slider ] } );

  const loopsSlider = new HSlider( spring.loopsProperty, loopsRange, {
    trackSize: new Dimension2( 150, 4 ),
    constrainValue: value => Math.round( value )
  } );
  const radiusSlider = new HSlider( spring.radiusProperty, radiusRange, { trackSize: new Dimension2( 150, 4 ) } );

  const controls = new HBox( {
    spacing: 24,
    align: 'top',
    children: [ labeledSlider( 'loops', loopsSlider ), labeledSlider( 'radius', radiusSlider ) ]
  } );

  const panel = new VBox( { spacing: 20, align: 'center', children: [ frame, controls ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    loopsSlider.dispose();
    radiusSlider.dispose();
    controls.dispose();
    frame.dispose();
    spring.dispose();
    panel.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
