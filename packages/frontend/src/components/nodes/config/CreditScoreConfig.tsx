import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { WorkflowNode } from '../../../types/workflow';
import { CreditScoreNodeConfig, CreditScoreVariable } from '../../../types/creditScore';
import { NodeBasicInfo } from './NodeBasicInfo';
import { MaxScoreInput } from '../credit-score/MaxScoreInput';
import { VariableItem } from '../credit-score/VariableItem';
import { WeightSummary } from '../credit-score/WeightSummary';
import { calculateTotalWeight, isValidConfiguration } from '../../../utils/creditScoreUtils';

interface CreditScoreConfigProps {
  node: WorkflowNode;
  workflow: { nodes: WorkflowNode[] };
  onUpdate: (node: WorkflowNode) => void;
  onClose: () => void;
}

export function CreditScoreConfig({ node, workflow, onUpdate, onClose }: CreditScoreConfigProps) {
  const config = node.data.config as CreditScoreNodeConfig;
  const [maxScore, setMaxScore] = useState(config?.maxScore || 850);
  const [variables, setVariables] = useState<CreditScoreVariable[]>(config?.variables || []);

  const triggerNode = workflow.nodes.find(n => n.type === 'trigger');
  const availableVariables = triggerNode?.data.variables || [];
  const usedVariables = variables.map(v => v.variableId);

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

  const addVariable = () => {
    setVariables([...variables, { 
      variableId: '', 
      weight: 0,
      conditions: []
    }]);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateVariable = (index: number, field: keyof CreditScoreVariable, value: any) => {
    const newVariables = [...variables];
    newVariables[index] = {
      ...newVariables[index],
      [field]: value
    };
    setVariables(newVariables);
  };

  const handleSave = () => {
    onUpdate({
      ...node,
      data: {
        ...node.data,
        config: { maxScore, variables }
      }
    });
    onClose();
  };

  return (
    <div className="space-y-6">
      <NodeBasicInfo
        title={node.data.title}
        description={node.data.description}
        onUpdate={handleBasicInfoUpdate}
      />

      <MaxScoreInput value={maxScore} onChange={setMaxScore} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Credit Score Variables</h4>
          <button
            onClick={addVariable}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
          >
            <Plus size={16} />
            Add Variable
          </button>
        </div>

        {variables.map((variable, index) => (
          <VariableItem
            key={index}
            variable={variable}
            index={index}
            availableVariables={availableVariables}
            usedVariables={usedVariables}
            maxScore={maxScore}
            onUpdate={updateVariable}
            onRemove={removeVariable}
          />
        ))}

        <WeightSummary totalWeight={calculateTotalWeight(variables)} />
      </div>

      <button
        onClick={handleSave}
        disabled={!isValidConfiguration(variables)}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Configuration
      </button>
    </div>
  );
}