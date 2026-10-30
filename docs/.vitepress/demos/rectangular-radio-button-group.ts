import { Property } from 'scenerystack/axon';
import { RectangularRadioButton, RectangularRadioButtonGroup, type RectangularRadioButtonGroupItem } from 'scenerystack/sun';
import { Circle, Node, Path, Rectangle, Text, VBox } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 340;
export const height = 280;

type Shape3 = 'circle' | 'square' | 'triangle';
type Mode = 'on' | 'off';

function triangle(): Node {
  const s = new Shape().moveTo( 0, -16 ).lineTo( 16, 14 ).lineTo( -16, 14 ).close();
  return new Path( s, { fill: '#333' } );
}

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const shapeProperty = new Property<Shape3>( 'circle' );

  const items: RectangularRadioButtonGroupItem<Shape3>[] = [
    { value: 'circle', createNode: () => new Circle( 15, { fill: '#333' } ) },
    { value: 'square', createNode: () => new Rectangle( 0, 0, 28, 28, { fill: '#333' } ) },
    { value: 'triangle', createNode: () => triangle() }
  ];

  const group = new RectangularRadioButtonGroup<Shape3>( shapeProperty, items, {
    orientation: 'horizontal',
    spacing: 12
  } );

  // Standalone RectangularRadioButton (the page's subject class), outside a group.
  const modeProperty = new Property<Mode>( 'off' );
  const standalone = new RectangularRadioButton( modeProperty, 'on', {
    content: new Text( 'On' )
  } );

  const readout = new Text( '' );
  const update = (): void => {
    readout.string = `shape: ${shapeProperty.value}  |  mode: ${modeProperty.value}`;
  };
  shapeProperty.link( update );
  modeProperty.link( update );

  const panel = new VBox( { spacing: 22, align: 'center', children: [ group, standalone, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    shapeProperty.unlink( update );
    modeProperty.unlink( update );
    group.dispose();
    standalone.dispose();
    readout.dispose();
    panel.dispose();
    shapeProperty.dispose();
    modeProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
