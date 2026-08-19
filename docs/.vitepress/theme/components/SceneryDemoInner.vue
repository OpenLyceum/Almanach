<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import type { DemoId } from '../../demos/types';

const props = withDefaults( defineProps<{
  demo: DemoId;
  width?: number;
  height?: number;
}>(), {
  width: undefined,
  height: undefined
} );

const containerRef = ref<HTMLElement | null>( null );
const errorMessage = ref<string | null>( null );
const isLoading = ref( true );
const canvasWidth = ref( props.width ?? 400 );
const canvasHeight = ref( props.height ?? 120 );

type DisplayInstance = {
  domElement: HTMLElement;
  initializeEvents: () => void;
  updateDisplay: () => void;
  updateOnRequestAnimationFrame: ( callback?: ( ( dt: number ) => void ) | null ) => void;
  dispose: () => void;
};

let display: DisplayInstance | null = null;
let disposeDemo: ( () => void ) | null = null;

onMounted( async () => {
  const container = containerRef.value;
  if ( !container ) {
    return;
  }

  try {
    const [ scenery, { loadDemo } ] = await Promise.all( [
      import( 'scenerystack/scenery' ),
      import( '../../demos/registry' )
    ] );

    const demoModule = await loadDemo( props.demo );
    const width = props.width ?? demoModule.width ?? 400;
    const height = props.height ?? demoModule.height ?? 120;
    canvasWidth.value = width;
    canvasHeight.value = height;

    const rootNode = new scenery.Node();
    disposeDemo = demoModule.createDemo( rootNode );

    display = new scenery.Display( rootNode, {
      width,
      height,
      backgroundColor: '#f5f5f5'
    } );

    isLoading.value = false;
    await nextTick();
    container.replaceChildren( display.domElement );
    display.initializeEvents();
    display.updateDisplay();
    display.updateOnRequestAnimationFrame();
  }
  catch ( error ) {
    isLoading.value = false;
    errorMessage.value = error instanceof Error ? error.message : String( error );
    console.error( `[SceneryDemo:${props.demo}]`, error );
  }
} );

onBeforeUnmount( () => {
  display?.updateOnRequestAnimationFrame( null );
  disposeDemo?.();
  display?.dispose();
  display = null;
  disposeDemo = null;
} );
</script>

<template>
  <div class="scenery-demo">
    <p class="scenery-demo__label">Interactive demo</p>
    <div
      ref="containerRef"
      class="scenery-demo__canvas"
      :class="{ 'scenery-demo__canvas--loading': isLoading }"
      :style="{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`
      }"
      role="img"
      :aria-label="`Interactive ${demo} demo`"
    >
      <span v-if="isLoading" class="scenery-demo__loading">Loading…</span>
    </div>
    <p v-if="errorMessage" class="scenery-demo__error">
      Demo failed to load: {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.scenery-demo {
  margin: 1rem 0;
}

.scenery-demo__label {
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
}

.scenery-demo__canvas {
  align-items: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  overflow: hidden;
  background: #f5f5f5;
  position: relative;
}

.scenery-demo__canvas--loading {
  background: var(--vp-c-bg-soft);
}

.scenery-demo__loading {
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
}

.scenery-demo__error {
  color: var(--vp-c-danger-1);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
