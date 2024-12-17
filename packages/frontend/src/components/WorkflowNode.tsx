import React from 'react';
import { WorkflowNode as WorkflowNodeType } from '../types/workflow';
import { GripHorizontal, Settings } from 'lucide-react';

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export default function WorkflowNode({ node, onDragStart, onDragEnd }: WorkflowNodeProps) {
  const nodeColors = {
    trigger: 'bg-blue-50 border-blue-200',
    condition: 'bg-yellow-50 border-yellow-200',
    action: 'bg-green-50 border-green-200'
  };

  return (
    <div
      className={`absolute w-[300px] ${nodeColors[node.type]} border-2 rounded-lg shadow-sm`}
      style={{
        left: node.position.x,
        top: node.position.y,
        cursor: 'move'
      }}
      onMouseDown={onDragStart}
      onMouseUp={onDragEnd}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <GripHorizontal className="text-gray-400" size={20} />
            <h3 className="font-medium text-gray-900">{node.data.title}</h3>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <Settings size={18} className="text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-600">{node.data.description}</p>
      </div>
    </div>
  );
}