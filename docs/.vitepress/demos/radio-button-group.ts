import { Property } from 'scenerystack/axon';
import { HBox, Text, VBox } from 'scenerystack/scenery';
import {
  AquaRadioButtonGroup,
  RectangularRadioButtonGroup,
  type AquaRadioButtonGroupItem,
  type RectangularRadioButtonGroupItem
} from 'scenerystack/sun';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 480;
export const height = 220;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  type Shape = 'circle' | 'square' | 'triangle';
  const rectangularProperty = new Property<Shape>( 'circle' );
  const aquaProperty = new Property<Shape>( 'circle' );

  const rectangularItems: RectangularRadioButtonGroupItem<Shape>[] = [
    { value: 'circle', createNode: () => new Text( 'Circle' ) },
    { value: 'square', createNode: () => new Text( 'Square' ) },
    { value: 'triangle', createNode: () => new Text( 'Triangle' ) }
  ];

  const aquaItems: AquaRadioButtonGroupItem<Shape>[] = [
    { value: 'circle', createNode: () => new Text( 'Circle' ) },
    { value: 'square', createNode: () => new Text( 'Square' ) },
    { value: 'triangle', createNode: () => new Text( 'Triangle' ) }
  ];

  const rectangularGroup = new RectangularRadioButtonGroup( rectangularProperty, rectangularItems, {
    orientation: 'horizontal'
  } );

  const aquaGroup = new AquaRadioButtonGroup( aquaProperty, aquaItems, {
    orientation: 'vertical'
  } );

  const rectangularReadout = new Text( 'Rectangular: circle' );
  const aquaReadout = new Text( 'Aqua: circle' );

  const rectangularColumn = new VBox( {
    spacing: 10,
    align: 'center',
    children: [
      new Text( 'RectangularRadioButtonGroup', { fontSize: 14 } ),
      rectangularGroup,
      rectangularReadout
    ]
  } );

  const aquaColumn = new VBox( {
    spacing: 10,
    align: 'left',
    children: [
      new Text( 'AquaRadioButtonGroup', { fontSize: 14 } ),
      aquaGroup,
      aquaReadout
    ]
  } );

  const panel = new HBox( {
    spacing: 36,
    align: 'top',
    children: [ rectangularColumn, aquaColumn ]
  } );

  const updateRectangular = ( value: Shape ): void => {
    rectangularReadout.string = `Rectangular: ${value}`;
  };
  const updateAqua = ( value: Shape ): void => {
    aquaReadout.string = `Aqua: ${value}`;
  };
  rectangularProperty.link( updateRectangular );
  aquaProperty.link( updateAqua );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    rectangularProperty.unlink( updateRectangular );
    aquaProperty.unlink( updateAqua );
    panel.dispose();
    rectangularGroup.dispose();
    aquaGroup.dispose();
    rectangularProperty.dispose();
    aquaProperty.dispose();
    rectangularReadout.dispose();
    aquaReadout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
