import { Atom, AtomNode, Element } from 'scenerystack/nitroglycerin';
import { HBox, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 220;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const elements = [ Element.H, Element.C, Element.N, Element.O ];

  const atoms = elements.map( element => {
    const atom = new AtomNode( element );
    const label = new Text( element.symbol, { fontSize: 16 } );
    return new VBox( { spacing: 8, align: 'center', children: [ atom, label ] } );
  } );

  // Model-layer Atom (per-instance identity around Element.O).
  const oxygenAtom = new Atom( Element.O );
  const atomReadout = new Text( `Atom id: ${oxygenAtom.id}  weight: ${oxygenAtom.atomicWeight}`, {
    fontSize: 14
  } );

  const row = new HBox( { spacing: 26, align: 'bottom', children: atoms } );
  const panel = new VBox( { spacing: 18, align: 'center', children: [ row, atomReadout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    atoms.forEach( a => a.dispose() );
    atomReadout.dispose();
    row.dispose();
    panel.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
