import { Range, Vector2 } from 'scenerystack/dot';
import { Orientation } from 'scenerystack/phet-core';
import { Node, VBox } from 'scenerystack/scenery';
import { TextPushButton } from 'scenerystack/sun';
import { AxisLine, ChartRectangle, ChartTransform, ScatterPlot } from 'scenerystack/bamboo';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 300;

function createDataSet(): Vector2[] {
  const points: Vector2[] = [];
  for ( let i = 0; i < 40; i++ ) {
    const x = ( Math.random() * 2 - 1 ) * 10;
    const y = 0.6 * x + ( Math.random() * 2 - 1 ) * 4;
    points.push( new Vector2( x, y ) );
  }
  return points;
}

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const chartTransform = new ChartTransform( {
    viewWidth: 280,
    viewHeight: 180,
    modelXRange: new Range( -10, 10 ),
    modelYRange: new Range( -10, 10 )
  } );

  const chartRectangle = new ChartRectangle( chartTransform, {
    fill: 'white',
    stroke: 'black'
  } );

  const xAxis = new AxisLine( chartTransform, Orientation.HORIZONTAL, { value: 0 } );
  const yAxis = new AxisLine( chartTransform, Orientation.VERTICAL, { value: 0 } );

  const scatterPlot = new ScatterPlot( chartTransform, createDataSet(), {
    fill: '#5B9BD5',
    radius: 3
  } );

  const randomizeButton = new TextPushButton( 'Randomize data', {
    baseColor: '#E8C87A',
    listener: () => {
      scatterPlot.setDataSet( createDataSet() );
    }
  } );

  const chart = new Node( {
    children: [ chartRectangle, xAxis, yAxis, scatterPlot ]
  } );

  const panel = new VBox( {
    spacing: 10,
    align: 'center',
    children: [ chart, randomizeButton ]
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
    scatterPlot.dispose();
    randomizeButton.dispose();
    chartTransform.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
