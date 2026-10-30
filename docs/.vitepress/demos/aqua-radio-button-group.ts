import { Property } from 'scenerystack/axon';
import { VerticalAquaRadioButtonGroup, type AquaRadioButtonGroupItem } from 'scenerystack/sun';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 220;

type Shape = 'circle' | 'square' | 'triangle';

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const shapeProperty = new Property<Shape>( 'circle' );

  const items: AquaRadioButtonGroupItem<Shape>[] = [
    { value: 'circle', createNode: () => new Text( 'Circle', { fontSize: 18 } ) },
    { value: 'square', createNode: () => new Text( 'Square', { fontSize: 18 } ) },
    { value: 'triangle', createNode: () => new Text( 'Triangle', { fontSize: 18 } ) }
  ];

  const group = new VerticalAquaRadioButtonGroup<Shape>( shapeProperty, items, {
    spacing: 12
  } );

  const readout = new Text( '' );
  const updateReadout = ( shape: Shape ): void => {
    readout.string = `selected: ${shape}`;
  };
  shapeProperty.link( updateReadout );

  const panel = new VBox( {
    spacing: 18,
    align: 'center',
    children: [ group, readout ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    shapeProperty.unlink( updateReadout );
    group.dispose();
    readout.dispose();
    panel.dispose();
    shapeProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
