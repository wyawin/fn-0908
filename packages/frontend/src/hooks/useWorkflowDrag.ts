import { useState, useRef } from 'react';
import { Workflow } from '../types/workflow';

interface DragState {
  nodeId: string;
  offsetX: number;
  offsetY: number;
}

export function useWorkflowDrag(workflow: Workflow, onUpdateWorkflow: (workflow: Workflow) => void) {
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const dragState = useRef<DragState | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });

    if (draggingNode && dragState.current) {
      const updatedNodes = workflow.nodes.map(node => {
        if (node.id === draggingNode) {
          return {
            ...node,
            position: {
              x: x - dragState.current.offsetX,
              y: y - dragState.current.offsetY
            }
          };
        }
        return node;
      });
      onUpdateWorkflow({ ...workflow, nodes: updatedNodes });
    }
  };

  const handleDragStart = (nodeId: string) => {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = document.querySelector(`[data-node-id="${nodeId}"]`)?.getBoundingClientRect();
    if (!rect) return;

    dragState.current = {
      nodeId,
      offsetX: mousePosition.x - node.position.x,
      offsetY: mousePosition.y - node.position.y
    };
    setDraggingNode(nodeId);
  };

  const handleDragEnd = () => {
    setDraggingNode(null);
    dragState.current = null;
  };

  return {
    draggingNode,
    mousePosition,
    handleMouseMove,
    handleDragStart,
    handleDragEnd
  };
}