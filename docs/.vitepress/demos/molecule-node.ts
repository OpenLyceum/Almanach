import { Property } from 'scenerystack/axon';
import { Text, VBox } from 'scenerystack/scenery';
import { TextPushButton } from 'scenerystack/sun';
import { CH4Node, CO2Node, H2ONode, NH3Node } from 'scenerystack/nitroglycerin';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 220;

type MoleculeId = 'H2O' | 'CO2' | 'NH3' | 'CH4';

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const molecules: MoleculeId[] = [ 'H2O', 'CO2', 'NH3', 'CH4' ];
  const moleculeProperty = new Property<MoleculeId>( 'H2O' );

  const label = new Text( 'H2O — water' );
  const names: Record<MoleculeId, string> = {
    H2O: 'H2O — water',
    CO2: 'CO2 — carbon dioxide',
    NH3: 'NH3 — ammonia',
    CH4: 'CH4 — methane'
  };

  const atomNodeOptions = { opacity: 0.9 };

  let moleculeNode = new H2ONode( { atomNodeOptions: atomNodeOptions } );

  const stage = new VBox( { children: [ moleculeNode ] } );

  const nextButton = new TextPushButton( 'Next molecule', {
    baseColor: '#9AD1D4',
    listener: () => {
      const index = molecules.indexOf( moleculeProperty.value );
      moleculeProperty.value = molecules[ ( index + 1 ) % molecules.length ];
    }
  } );

  const createMoleculeNode = ( id: MoleculeId ) => {
    switch( id ) {
      case 'H2O': return new H2ONode( { atomNodeOptions: atomNodeOptions } );
      case 'CO2': return new CO2Node( { atomNodeOptions: atomNodeOptions } );
      case 'NH3': return new NH3Node( { atomNodeOptions: atomNodeOptions } );
      case 'CH4': return new CH4Node( { atomNodeOptions: atomNodeOptions } );
    }
  };

  const updateMolecule = ( id: MoleculeId ): void => {
    stage.children.forEach( child => child.dispose() );
    moleculeNode = createMoleculeNode( id );
    stage.children = [ moleculeNode ];
    label.string = names[ id ];
  };
  moleculeProperty.link( updateMolecule );

  const panel = new VBox( {
    spacing: 14,
    align: 'center',
    children: [
      label,
      stage,
      nextButton
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    moleculeProperty.unlink( updateMolecule );
    panel.dispose();
    stage.children.forEach( child => child.dispose() );
    stage.dispose();
    nextButton.dispose();
    moleculeProperty.dispose();
    label.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
