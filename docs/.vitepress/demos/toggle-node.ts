import { BooleanProperty, Property } from 'scenerystack/axon';
import {
  BooleanToggleNode,
  ToggleNode,
  type ToggleNodeElement,
  ToggleSwitch,
  VerticalAquaRadioButtonGroup,
  type AquaRadioButtonGroupItem
} from 'scenerystack/sun';
import { Circle, Node, Rectangle, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 300;
export const height = 380;

type Phase = 'solid' | 'liquid' | 'gas';

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const phaseProperty = new Property<Phase>( 'liquid' );

  const phaseElements: ToggleNodeElement<Phase>[] = [
    { value: 'solid', createNode: () => new Text( 'Solid', { fontSize: 18 } ) },
    { value: 'liquid', createNode: () => new Text( 'Liquid', { fontSize: 18 } ) },
    { value: 'gas', createNode: () => new Text( 'Gas', { fontSize: 18 } ) }
  ];
  const phaseNode = new ToggleNode( phaseProperty, phaseElements );

  const phaseItems: AquaRadioButtonGroupItem<Phase>[] = [
    { value: 'solid', createNode: () => new Text( 'Solid', { fontSize: 14 } ) },
    { value: 'liquid', createNode: () => new Text( 'Liquid', { fontSize: 14 } ) },
    { value: 'gas', createNode: () => new Text( 'Gas', { fontSize: 14 } ) }
  ];
  const phaseControl = new VerticalAquaRadioButtonGroup( phaseProperty, phaseItems, { spacing: 8 } );

  const phaseSection = new VBox( {
    spacing: 12,
    align: 'center',
    children: [ phaseNode, phaseControl ]
  } );

  const onProperty = new BooleanProperty( false );

  const trueNode = new Circle( 32, { fill: '#5B9BD5' } );
  const falseNode = new Rectangle( 0, 0, 60, 60, { fill: '#D9782D', cornerRadius: 6 } );
  const toggleNode = new BooleanToggleNode( onProperty, trueNode, falseNode );
  // Reserve the union of both element footprints so switching does not shift layout.
  const frame = new Node( { children: [ toggleNode ], localBounds: new Rectangle( -32, -32, 64, 64 ).localBounds } );

  const label = new Text( 'show circle', { fontSize: 16 } );
  const toggle = new ToggleSwitch( onProperty, false, true );
  const booleanSection = new VBox( { spacing: 6, align: 'center', children: [ frame, label, toggle ] } );

  const panel = new VBox( { spacing: 28, align: 'center', children: [ phaseSection, booleanSection ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    toggle.dispose();
    label.dispose();
    booleanSection.dispose();
    frame.dispose();
    toggleNode.dispose();
    phaseControl.dispose();
    phaseNode.dispose();
    phaseSection.dispose();
    panel.dispose();
    onProperty.dispose();
    phaseProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
