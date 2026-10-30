import { GridBox, Rectangle, Text } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 360;
export const height = 240;

const COLORS = [ '#5B9BD5', '#8FBF5B', '#D9782D', '#B05BD5', '#D5B15B', '#5BD5B1' ];

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const cells = COLORS.map( ( color, i ) => {
    const cell = new Rectangle( 0, 0, 70, 50, { fill: color, cornerRadius: 6 } );
    cell.addChild( new Text( `${i + 1}`, { fontSize: 20, fill: 'white', center: cell.center } ) );
    return cell;
  } );

  // First cell spans two columns so spanning is visible.
  cells[ 0 ].layoutOptions = { column: 0, row: 0, horizontalSpan: 2 };
  cells[ 1 ].layoutOptions = { column: 2, row: 0 };
  cells[ 2 ].layoutOptions = { column: 0, row: 1 };
  cells[ 3 ].layoutOptions = { column: 1, row: 1 };
  cells[ 4 ].layoutOptions = { column: 2, row: 1 };
  cells[ 5 ].layoutOptions = { column: 0, row: 2 };

  const gridBox = new GridBox( {
    xSpacing: 10,
    ySpacing: 10,
    children: cells
  } );

  rootNode.addChild( gridBox );
  const unlinkCenter = centerInDisplay( gridBox, width, height );

  return () => {
    unlinkCenter();
    gridBox.dispose();
    cells.forEach( c => c.dispose() );
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
