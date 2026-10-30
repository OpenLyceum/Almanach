import { Range, Vector2 } from 'scenerystack/dot';
import { Node, VBox } from 'scenerystack/scenery';
import { TextPushButton } from 'scenerystack/sun';
import { CanvasLinePlot, ChartCanvasNode, ChartRectangle, ChartTransform } from 'scenerystack/bamboo';
import { centerInDisplay } from './shared/center-in-display.ts';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 300;

function createDataSet(): Vector2[] {
  const points: Vector2[] = [];
  const phase = Math.random() * Math.PI;
  const freq = 0.5 + Math.random();
  for ( let x = 0; x <= 10; x += 0.1 ) {
    points.push( new Vector2( x, 5 + 4 * Math.sin( freq * x + phase ) ) );
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

  const chartRectangle = new ChartRectangle( chartTransform, { fill: 'white', stroke: 'black' } );

  const linePlot = new CanvasLinePlot( chartTransform, createDataSet(), {
    stroke: '#2E5F8A',
    lineWidth: 2
  } );
  const canvasNode = new ChartCanvasNode( chartTransform, [ linePlot ] );

  const randomizeButton = new TextPushButton( 'New wave', {
    baseColor: '#E8C87A',
    listener: () => {
      linePlot.setDataSet( createDataSet() );
      canvasNode.update();
    }
  } );

  const chart = new Node( { children: [ chartRectangle, canvasNode ] } );
  const panel = new VBox( { spacing: 10, align: 'center', children: [ chart, randomizeButton ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    chart.dispose();
    randomizeButton.dispose();
    canvasNode.dispose();
    linePlot.dispose();
    chartRectangle.dispose();
    chartTransform.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
