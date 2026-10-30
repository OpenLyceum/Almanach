import { Range, Vector2 } from 'scenerystack/dot';
import { Orientation } from 'scenerystack/phet-core';
import { Node, VBox } from 'scenerystack/scenery';
import { TextPushButton } from 'scenerystack/sun';
import { AxisLine, BarPlot, ChartRectangle, ChartTransform } from 'scenerystack/bamboo';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 280;

function createDataSet(): Vector2[] {
  return [ 0, 1, 2, 3, 4 ].map( x => new Vector2( x, Math.round( Math.random() * 10 ) ) );
}

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const chartTransform = new ChartTransform( {
    viewWidth: 260,
    viewHeight: 160,
    modelXRange: new Range( -0.5, 4.5 ),
    modelYRange: new Range( 0, 10 )
  } );

  const chartRectangle = new ChartRectangle( chartTransform, {
    fill: 'white',
    stroke: 'black'
  } );

  const xAxis = new AxisLine( chartTransform, Orientation.HORIZONTAL, { value: 0 } );

  const barPlot = new BarPlot( chartTransform, createDataSet(), {
    barWidth: 24,
    pointToPaintableFields: point => ( { fill: point.y > 5 ? '#D9782D' : '#5B9BD5' } )
  } );

  const randomizeButton = new TextPushButton( 'Randomize data', {
    baseColor: '#E8C87A',
    listener: () => {
      barPlot.setDataSet( createDataSet() );
    }
  } );

  const chart = new Node( {
    children: [ chartRectangle, xAxis, barPlot ]
  } );

  const panel = new VBox( {
    spacing: 10,
    align: 'center',
    children: [
      chart,
      randomizeButton
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
    barPlot.dispose();
    randomizeButton.dispose();
    chartTransform.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
