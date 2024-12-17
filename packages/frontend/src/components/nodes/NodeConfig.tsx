import React from 'react';
import { WorkflowNode } from '../../types/workflow';
import { X } from 'lucide-react';
import { TriggerConfig } from './config/TriggerConfig';
import { ConditionConfig } from './config/ConditionConfig';
import { ActionConfig } from './config/ActionConfig';
import { CreditScoreConfig } from './config/CreditScoreConfig';
import { CreditScoreCheckConfig } from './config/CreditScoreCheckConfig';

interface NodeConfigProps {
  node: WorkflowNode;
  workflow: { nodes: WorkflowNode[] };
  onClose: () => void;
  onUpdate: (updatedNode: WorkflowNode) => void;
}

export function NodeConfig({ node, workflow, onClose, onUpdate }: NodeConfigProps) {
  const renderConfig = () => {
    switch (node.type) {
      case 'trigger':
        return <TriggerConfig node={node} onUpdate={onUpdate} />;
      case 'condition':
        return <ConditionConfig node={node} workflow={workflow} onUpdate={onUpdate} onClose={onClose} />;
      case 'credit-score-check':
        return <CreditScoreCheckConfig node={node} workflow={workflow} onUpdate={onUpdate} onClose={onClose} />;
      case 'action':
        return <ActionConfig node={node} onUpdate={onUpdate} onClose={onClose} />;
      case 'credit-score':
        return <CreditScoreConfig node={node} workflow={workflow} onUpdate={onUpdate} onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[1000]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="fixed inset-0 bg-black bg-opacity-20" aria-hidden="true" />
      <div 
        className="relative bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Configure {node.data.title}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          {renderConfig()}
        </div>
      </div>
    </div>
  );
}