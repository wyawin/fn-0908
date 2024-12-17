import { useState } from 'react';
import { NodeType, WorkflowNode } from '../types/workflow';
import { createNode } from '../utils/nodeCreation';

export function useDragAndDrop() {
  const [draggedNodeType, setDraggedNodeType] = useState<NodeType | null>(null);

  const handleDragStart = (nodeType: NodeType, e: React.DragEvent) => {
    setDraggedNodeType(nodeType);
    e.dataTransfer.setData('nodeType', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedNodeType(null);
  };

  const createNodeFromDrag = (position: { x: number; y: number }): WorkflowNode | null => {
    if (!draggedNodeType) return null;
    return createNode(draggedNodeType, position);
  };

  return {
    draggedNodeType,
    handleDragStart,
    handleDragEnd,
    createNode: createNodeFromDrag
  };
}