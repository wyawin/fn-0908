import React, { useState } from 'react';
import { WorkflowNode } from '../../../types/workflow';
import { NodeBasicInfo } from './NodeBasicInfo';

interface CreditScoreCheckConfigProps {
  node: WorkflowNode;
  workflow: { nodes: WorkflowNode[] };
  onUpdate: (node: WorkflowNode) => void;
  onClose: () => void;
}

export function CreditScoreCheckConfig({ node, workflow, onUpdate, onClose }: CreditScoreCheckConfigProps) {
  const [operator, setOperator] = useState(node.data.config.operator || 'greater_than_equal');
  const [threshold, setThreshold] = useState(node.data.config.threshold || 0);

  const creditScoreNodes = workflow.nodes.filter(n => n.type === 'credit-score');
  const [selectedNodeId, setSelectedNodeId] = useState(node.data.config.creditScoreNodeId || '');

  const handleBasicInfoUpdate = (updates: { title: string; description: string }) => {
    onUpdate({
      ...node,
      data: {
        ...node.data,
        title: updates.title,
        description: updates.description
      }
    });
  };

  const handleSave = () => {
    onUpdate({
      ...node,
      data: {
        ...node.data,
        config: {
          operator,
          threshold,
          creditScoreNodeId: selectedNodeId
        }
      }
    });
    onClose();
  };

  const selectedNode = workflow.nodes.find(n => n.id === selectedNodeId);
  const maxScore = selectedNode?.data.config.maxScore || 850;

  return (
    <div className="space-y-6">
      <NodeBasicInfo
        title={node.data.title}
        description={node.data.description}
        onUpdate={handleBasicInfoUpdate}
      />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Credit Score Node
          </label>
          <select
            value={selectedNodeId}
            onChange={(e) => setSelectedNodeId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select credit score node</option>
            {creditScoreNodes.map(node => (
              <option key={node.id} value={node.id}>
                {node.data.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="less_than">Less than</option>
              <option value="less_than_equal">Less than or equal to</option>
              <option value="greater_than">Greater than</option>
              <option value="greater_than_equal">Greater than or equal to</option>
              <option value="equal">Equal to</option>
            </select>
            <input
              type="number"
              min="0"
              max={maxScore}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="px-3 py-2 border rounded-lg"
              placeholder="Enter threshold"
            />
          </div>
          {selectedNodeId && (
            <p className="text-sm text-gray-500 mt-1">
              Maximum possible score: {maxScore}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!selectedNodeId}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Configuration
      </button>
    </div>
  );
}