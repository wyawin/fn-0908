import { useState, useCallback } from 'react';
import { Workflow } from '../types/workflow';

export function useNodeSelection(workflow: Workflow) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setSelectedNode(nodeId);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Only deselect if clicking directly on the canvas, not on a node
    if (e.target === e.currentTarget) {
      setSelectedNode(null);
    }
  }, []);

  const isNodeSelected = useCallback((nodeId: string) => {
    return selectedNode === nodeId;
  }, [selectedNode]);

  return {
    selectedNode,
    handleNodeSelect,
    handleCanvasClick,
    isNodeSelected
  };
}