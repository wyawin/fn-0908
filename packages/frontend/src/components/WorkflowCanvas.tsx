import React, { useCallback } from 'react';
import { Workflow, WorkflowNode as WorkflowNodeType } from '../types/workflow';
import { WorkflowNode } from './nodes/WorkflowNode';
import { WorkflowConnections } from './workflow/WorkflowConnections';
import { AddNodeButton } from './workflow/AddNodeButton';
import { useWorkflowDrag } from '../hooks/useWorkflowDrag';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useConnections } from '../hooks/useConnections';
import { useNodeConfig } from '../hooks/useNodeConfig';
import { useCanvasZoom } from '../hooks/useCanvasZoom';
import { useNodeDeletion } from '../hooks/useNodeDeletion';
import { useNodeSelection } from '../hooks/useNodeSelection';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface WorkflowCanvasProps {
  workflow: Workflow;
  onUpdateWorkflow: (workflow: Workflow) => void;
}

export function WorkflowCanvas({ workflow, onUpdateWorkflow }: WorkflowCanvasProps) {
  const { draggingNode, mousePosition, handleMouseMove, handleDragStart, handleDragEnd } = 
    useWorkflowDrag(workflow, onUpdateWorkflow);
  
  const { connectingFrom, handleConnectionStart, handleConnectionEnd } = 
    useConnections(workflow, onUpdateWorkflow);

  const { configuredNode, openNodeConfig, closeNodeConfig, updateNodeConfig } = 
    useNodeConfig(workflow, onUpdateWorkflow);

  const { handleDragStart: handleNodeDragStart, createNode } = useDragAndDrop();

  const { deleteNode } = useNodeDeletion(workflow, onUpdateWorkflow);

  const { selectedNode, handleNodeSelect, handleCanvasClick, isNodeSelected } = 
    useNodeSelection(workflow);

  useKeyboardShortcuts({
    selectedNode,
    onDeleteNode: (nodeId) => {
      deleteNode(nodeId);
      handleNodeSelect(null);
    },
    workflow
  });

  const { 
    zoom, 
    handleZoom, 
    resetZoom, 
    startPanning, 
    handlePanning, 
    stopPanning, 
    isPanning 
  } = useCanvasZoom();

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      handleZoom(e.deltaY > 0 ? -1 : 1, point);
    }
  }, [handleZoom]);

  const handleMouseMoveWithPan = useCallback((e: React.MouseEvent) => {
    handlePanning(e);
    if (!isPanning) {
      handleMouseMove(e);
    }
  }, [handlePanning, handleMouseMove, isPanning]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: (e.clientX - rect.left - zoom.position.x) / zoom.scale,
      y: (e.clientY - rect.top - zoom.position.y) / zoom.scale
    };

    const newNode = createNode(position);
    if (newNode) {
      onUpdateWorkflow({
        ...workflow,
        nodes: [...workflow.nodes, newNode]
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-[1000]">
        <div className="bg-white rounded-lg shadow-sm p-1 flex items-center gap-1">
          <button
            onClick={() => handleZoom(1, { x: window.innerWidth / 2, y: window.innerHeight / 2 })}
            className="p-2 hover:bg-gray-50 rounded-lg"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={() => handleZoom(-1, { x: window.innerWidth / 2, y: window.innerHeight / 2 })}
            className="p-2 hover:bg-gray-50 rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={resetZoom}
            className="p-2 hover:bg-gray-50 rounded-lg"
            title="Reset View"
          >
            <Maximize size={20} />
          </button>
          <div className="w-[1px] h-6 bg-gray-200 mx-1" />
          <div className="px-2 py-1">
            {Math.round(zoom.scale * 100)}%
          </div>
        </div>
      </div>

      <div 
        className={`relative w-full h-full ${isPanning ? 'cursor-move' : 'cursor-default'}`}
        onWheel={handleWheel}
        onMouseMove={handleMouseMoveWithPan}
        onMouseUp={stopPanning}
        onMouseLeave={stopPanning}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleCanvasClick}
      >
        {/* Canvas Background - Used for panning detection */}
        <div 
          className="canvas-background absolute inset-0 bg-grid-pattern opacity-10"
          onMouseDown={startPanning}
          style={{
            transform: `translate(${zoom.position.x}px, ${zoom.position.y}px) scale(${zoom.scale})`,
            transformOrigin: '0 0'
          }}
        />

        <div
          className="workflow-content"
          style={{
            transform: `translate(${zoom.position.x}px, ${zoom.position.y}px) scale(${zoom.scale})`,
            transformOrigin: '0 0'
          }}
        >
          <WorkflowConnections 
            workflow={workflow}
            connectingFrom={connectingFrom}
            mousePosition={{
              x: (mousePosition.x - zoom.position.x) / zoom.scale,
              y: (mousePosition.y - zoom.position.y) / zoom.scale
            }}
          />

          {workflow.nodes.map(node => (
            <WorkflowNode
              key={node.id}
              node={node}
              workflow={workflow}
              onDragStart={() => handleDragStart(node.id)}
              onDragEnd={handleDragEnd}
              onConnectionStart={() => handleConnectionStart(node.id)}
              onConnectionEnd={() => handleConnectionEnd(node.id)}
              isConnecting={connectingFrom === node.id}
              onConfigOpen={openNodeConfig}
              onConfigUpdate={updateNodeConfig}
              isConfigOpen={configuredNode === node.id}
              isSelected={isNodeSelected(node.id)}
              onSelect={handleNodeSelect}
            />
          ))}
        </div>

        <AddNodeButton
          position={mousePosition}
          onAddNode={(newNode: WorkflowNodeType) => {
            onUpdateWorkflow({
              ...workflow,
              nodes: [...workflow.nodes, newNode]
            });
          }}
        />
      </div>
    </div>
  );
}