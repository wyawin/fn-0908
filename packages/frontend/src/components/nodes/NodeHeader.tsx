import React from 'react';
import { WorkflowNode } from '../../types/workflow';
import { GripHorizontal, Settings } from 'lucide-react';

interface NodeHeaderProps {
  node: WorkflowNode;
  onConfigOpen: () => void;
}

export function NodeHeader({ node, onConfigOpen }: NodeHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <GripHorizontal className="text-gray-400" size={20} />
        <h3 className="font-medium text-gray-900">{node.data.title}</h3>
      </div>
      <button 
        className="p-1 hover:bg-gray-100 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onConfigOpen();
        }}
      >
        <Settings size={18} className="text-gray-500" />
      </button>
    </div>
  );
}