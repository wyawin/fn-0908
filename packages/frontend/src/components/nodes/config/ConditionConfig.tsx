import React, { useState } from 'react';
import { WorkflowNode } from '../../../types/workflow';
import { NodeBasicInfo } from './NodeBasicInfo';

interface ConditionConfigProps {
  node: WorkflowNode;
  workflow: { nodes: WorkflowNode[] };
  onUpdate: (node: WorkflowNode) => void;
  onClose: () => void;
}

export function ConditionConfig({ node, workflow, onUpdate, onClose }: ConditionConfigProps) {
  const [selectedVariable, setSelectedVariable] = useState(node.data.config.variable || '');
  const [operator, setOperator] = useState(node.data.config.operator || 'equals');
  const [value, setValue] = useState(node.data.config.value || '');

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
          ...node.data.config,
          variable: selectedVariable,
          operator,
          value
        }
      }
    });
    onClose();
  };

  // Get available variables from trigger node
  const triggerNode = workflow.nodes.find(n => n.type === 'trigger');
  const availableVariables = triggerNode?.data.variables || [];

  return (
    <div className="space-y-4">
      <NodeBasicInfo
        title={node.data.title}
        description={node.data.description}
        onUpdate={handleBasicInfoUpdate}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Variable
        </label>
        <select
          value={selectedVariable}
          onChange={(e) => setSelectedVariable(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Select variable</option>
          {availableVariables.map(variable => (
            <option key={variable.id} value={variable.id}>
              {variable.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Operator
        </label>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="equals">Equals</option>
          <option value="not_equals">Not Equals</option>
          <option value="greater_than">Greater Than</option>
          <option value="less_than">Less Than</option>
          <option value="greater_than_equals">Greater Than or Equal</option>
          <option value="less_than_equals">Less Than or Equal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Value
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Enter comparison value"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Save Configuration
      </button>
    </div>
  );
}