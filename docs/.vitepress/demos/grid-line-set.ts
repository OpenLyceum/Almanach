import { Range } from 'scenerystack/dot';
import { Orientation } from 'scenerystack/phet-core';
import { Node } from 'scenerystack/scenery';
import { ChartRectangle, ChartTransform, GridLineSet, TickLabelSet, TickMarkSet } from 'scenerystack/bamboo';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 380;
export const height = 300;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const chartTransform = new ChartTransform( {
    viewWidth: 280,
    viewHeight: 200,
    modelXRange: new Range( 0, 10 ),
    modelYRange: new Range( 0, 10 )
  } );

  const chartRectangle = new ChartRectangle( chartTransform, { fill: 'white', stroke: 'black' } );

  const majorX = new GridLineSet( chartTransform, Orientation.VERTICAL, 2, { stroke: '#9BB7D6', lineWidth: 1.5 } );
  const majorY = new GridLineSet( chartTransform, Orientation.HORIZONTAL, 2, { stroke: '#9BB7D6', lineWidth: 1.5 } );
  const minorX = new GridLineSet( chartTransform, Orientation.VERTICAL, 0.5, { stroke: '#E1E8F2', lineWidth: 0.5 } );
  const minorY = new GridLineSet( chartTransform, Orientation.HORIZONTAL, 0.5, { stroke: '#E1E8F2', lineWidth: 0.5 } );

  const ticksX = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 2, { edge: 'min' } );
  const ticksY = new TickMarkSet( chartTransform, Orientation.VERTICAL, 2, { edge: 'min' } );

  const labelsX = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 2, { edge: 'min' } );

  const chart = new Node( {
    children: [ chartRectangle, minorX, minorY, majorX, majorY, ticksX, ticksY, labelsX ]
  } );

  rootNode.addChild( chart );
  const unlinkCenter = centerInDisplay( chart, width, height );

  return () => {
    unlinkCenter();
    chart.dispose();
    labelsX.dispose();
    ticksX.dispose();
    ticksY.dispose();
    minorX.dispose();
    minorY.dispose();
    majorX.dispose();
    majorY.dispose();
    chartRectangle.dispose();
    chartTransform.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
