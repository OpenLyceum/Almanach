import { Range, Vector2 } from 'scenerystack/dot';
import { Orientation } from 'scenerystack/phet-core';
import { Node, VBox } from 'scenerystack/scenery';
import { TextPushButton } from 'scenerystack/sun';
import { AreaPlot, AxisLine, ChartRectangle, ChartTransform } from 'scenerystack/bamboo';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 300;

function createDataSet(): ( Vector2 | null )[] {
  const points: ( Vector2 | null )[] = [];
  const phase = Math.random() * Math.PI;
  for ( let x = 0; x <= 10; x += 0.25 ) {
    // Leave a gap in the middle of the dataset so each run of non-null
    // points closes independently at the baseline, forming separate islands.
    if ( x > 4.4 && x < 5.6 ) {
      points.push( null );
    }
    else {
      points.push( new Vector2( x, 5 + 4 * Math.sin( x + phase ) ) );
    }
  }
  return points;
}

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const chartTransform = new ChartTransform( {
    viewWidth: 280,
    viewHeight: 180,
    modelXRange: new Range( 0, 10 ),
    modelYRange: new Range( 0, 10 )
  } );

  const chartRectangle = new ChartRectangle( chartTransform, {
    fill: 'white',
    stroke: 'black'
  } );

  const xAxis = new AxisLine( chartTransform, Orientation.HORIZONTAL, { value: 0 } );

  const areaPlot = new AreaPlot( chartTransform, createDataSet(), {
    fill: 'rgba( 91, 155, 213, 0.5 )',
    baseline: 0
  } );

  const randomizeButton = new TextPushButton( 'New wave', {
    baseColor: '#E8C87A',
    listener: () => {
      areaPlot.setDataSet( createDataSet() );
    }
  } );

  const chart = new Node( {
    children: [ chartRectangle, areaPlot, xAxis ]
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
    areaPlot.dispose();
    randomizeButton.dispose();
    chartTransform.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
