import { Range, Vector2 } from 'scenerystack/dot';
import { Orientation } from 'scenerystack/phet-core';
import { Node, VBox } from 'scenerystack/scenery';
import { TextPushButton } from 'scenerystack/sun';
import { AxisLine, ChartRectangle, ChartTransform, LinePlot } from 'scenerystack/bamboo';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 280;

function createDataSet( phase: number ): ( Vector2 | null )[] {
  const dataSet: ( Vector2 | null )[] = [];
  for ( let x = 0; x <= 10; x += 0.1 ) {
    // Leave a gap in the middle of the dataset to demonstrate that a null
    // entry breaks the line into separate segments instead of connecting through it.
    if ( x > 4.6 && x < 5.4 ) {
      dataSet.push( null );
    }
    else {
      dataSet.push( new Vector2( x, Math.sin( x + phase ) ) );
    }
  }
  return dataSet;
}

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const chartTransform = new ChartTransform( {
    viewWidth: 300,
    viewHeight: 160,
    modelXRange: new Range( 0, 10 ),
    modelYRange: new Range( -1.2, 1.2 )
  } );

  const chartRectangle = new ChartRectangle( chartTransform, {
    fill: 'white',
    stroke: 'black'
  } );

  const xAxis = new AxisLine( chartTransform, Orientation.HORIZONTAL );
  const yAxis = new AxisLine( chartTransform, Orientation.VERTICAL );

  const linePlot = new LinePlot( chartTransform, createDataSet( 0 ), {
    stroke: '#2E6DA4',
    lineWidth: 2
  } );

  let phase = 0;
  const shiftButton = new TextPushButton( 'Shift phase', {
    baseColor: '#B7D8E8',
    listener: () => {
      phase += Math.PI / 4;
      linePlot.setDataSet( createDataSet( phase ) );
    }
  } );

  const chart = new Node( {
    children: [ chartRectangle, xAxis, yAxis, linePlot ]
  } );

  const panel = new VBox( {
    spacing: 10,
    align: 'center',
    children: [
      chart,
      shiftButton
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    chart.dispose();
    chartRectangle.dispose();
    xAxis.dispose();
    yAxis.dispose();
    linePlot.dispose();
    shiftButton.dispose();
    chartTransform.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
