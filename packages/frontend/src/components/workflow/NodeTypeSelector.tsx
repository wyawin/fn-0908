import React from 'react';
import { NodeType } from '../../types/workflow';
import { NODE_TYPE_CONFIG } from '../../constants/nodeTypes';

interface NodeTypeSelectorProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onSelect: (type: NodeType) => void;
  onClose: () => void;
}

export function NodeTypeSelector({ isOpen, onSelect, onClose }: NodeTypeSelectorProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[900]"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black bg-opacity-20" aria-hidden="true" />
      <div 
        className="relative bg-white rounded-lg shadow-xl w-[400px]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Select Node Type</h3>
          <div className="space-y-2">
            {Object.values(NODE_TYPE_CONFIG).map(nodeType => (
              <button
                key={nodeType.type}
                className={`w-full p-3 rounded-lg ${nodeType.color} flex items-start gap-3 transition-colors`}
                onClick={() => onSelect(nodeType.type)}
              >
                <nodeType.icon className="mt-1" size={20} />
                <div className="text-left">
                  <h4 className="font-medium">{nodeType.title}</h4>
                  <p className="text-sm opacity-75">{nodeType.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}