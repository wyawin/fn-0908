import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { WorkflowNode, NodeType } from '../../types/workflow';
import { NodeTypeSelector } from './NodeTypeSelector';
import { createNode } from '../../utils/nodeCreation';

interface AddNodeButtonProps {
  position: { x: number; y: number };
  onAddNode: (node: WorkflowNode) => void;
}

export function AddNodeButton({ position, onAddNode }: AddNodeButtonProps) {
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const handleNodeTypeSelect = (type: NodeType) => {
    const newNode = createNode(type, position);
    onAddNode(newNode);
    setShowTypeSelector(false);
  };

  return (
    <>
      <button
        className="absolute bottom-4 right-4 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        onClick={() => setShowTypeSelector(true)}
      >
        <PlusCircle size={20} />
        Add Node
      </button>

      <NodeTypeSelector
        isOpen={showTypeSelector}
        position={position}
        onSelect={handleNodeTypeSelect}
        onClose={() => setShowTypeSelector(false)}
      />
    </>
  );
}