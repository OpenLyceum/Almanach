import { NumberProperty } from 'scenerystack/axon';
import { Bounds2, Range, Dimension2 } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { ShadedRectangle, ShadedSphereNode } from 'scenerystack/scenery-phet';
import { HBox, Node, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 420;
export const height = 260;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( -0.9, 0.9 );
  const highlightProperty = new NumberProperty( -0.4, { range: range } );

  const rectangle = new ShadedRectangle( new Bounds2( 0, 0, 110, 90 ), {
    baseColor: '#8FBF5B',
    cornerRadius: 8,
    lightSource: 'leftTop'
  } );

  const sphereContainer = new Node();
  let sphere: ShadedSphereNode | null = null;
  const rebuild = ( highlightXOffset: number ): void => {
    sphere && sphere.dispose();
    sphere = new ShadedSphereNode( 90, {
      mainColor: '#5B9BD5',
      highlightColor: '#DCEBFB',
      shadowColor: 'darkred',
      highlightXOffset: highlightXOffset
    } );
    sphereContainer.children = [ sphere ];
  };
  highlightProperty.link( rebuild );

  const row = new HBox( { spacing: 30, align: 'center', children: [ sphereContainer, rectangle ] } );
  const slider = new HSlider( highlightProperty, range, { trackSize: new Dimension2( 220, 5 ) } );

  const panel = new VBox( { spacing: 22, align: 'center', children: [ row, slider ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    highlightProperty.unlink( rebuild );
    slider.dispose();
    row.dispose();
    sphere && sphere.dispose();
    sphereContainer.dispose();
    rectangle.dispose();
    panel.dispose();
    highlightProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
