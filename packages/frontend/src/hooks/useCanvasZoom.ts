import { useState, useCallback, useRef } from 'react';

interface ZoomState {
  scale: number;
  position: { x: number; y: number };
}

interface PanState {
  isPanning: boolean;
  startX: number;
  startY: number;
}

export function useCanvasZoom() {
  const [zoom, setZoom] = useState<ZoomState>({
    scale: 1,
    position: { x: 0, y: 0 }
  });

  const panState = useRef<PanState>({
    isPanning: false,
    startX: 0,
    startY: 0
  });

  const handleZoom = useCallback((delta: number, point: { x: number; y: number }) => {
    setZoom(current => {
      const newScale = Math.min(Math.max(current.scale + delta * 0.1, 0.1), 2);
      const scaleDiff = newScale - current.scale;

      const newPosition = {
        x: current.position.x - (point.x - current.position.x) * scaleDiff / current.scale,
        y: current.position.y - (point.y - current.position.y) * scaleDiff / current.scale
      };

      return {
        scale: newScale,
        position: newPosition
      };
    });
  }, []);

  const startPanning = useCallback((e: React.MouseEvent) => {
    // Check if the click target is the canvas background
    const isCanvasBackground = (e.target as HTMLElement).classList.contains('canvas-background');
    
    if (isCanvasBackground && e.button === 0) { // Left click on canvas background
      panState.current = {
        isPanning: true,
        startX: e.clientX - zoom.position.x,
        startY: e.clientY - zoom.position.y
      };
      e.preventDefault();
    }
  }, [zoom.position]);

  const handlePanning = useCallback((e: React.MouseEvent) => {
    if (panState.current.isPanning) {
      setZoom(current => ({
        ...current,
        position: {
          x: e.clientX - panState.current.startX,
          y: e.clientY - panState.current.startY
        }
      }));
    }
  }, []);

  const stopPanning = useCallback(() => {
    panState.current.isPanning = false;
  }, []);

  const resetZoom = useCallback(() => {
    setZoom({
      scale: 1,
      position: { x: 0, y: 0 }
    });
  }, []);

  return {
    zoom,
    handleZoom,
    resetZoom,
    startPanning,
    handlePanning,
    stopPanning,
    isPanning: panState.current.isPanning
  };
}