import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { CreditScoreVariable } from '../../../types/creditScore';
import { WorkflowVariable } from '../../../types/variables';
import { getVariableDisplayValue } from '../../../utils/variableUtils';
import { ConditionList } from './ConditionList';
import { MaxVariableScore } from './MaxVariableScore';

interface VariableItemProps {
  variable: CreditScoreVariable;
  index: number;
  availableVariables: WorkflowVariable[];
  usedVariables: string[];
  maxScore: number;
  onUpdate: (index: number, field: keyof CreditScoreVariable, value: any) => void;
  onRemove: (index: number) => void;
}

export function VariableItem({
  variable,
  index,
  availableVariables,
  usedVariables,
  maxScore,
  onUpdate,
  onRemove
}: VariableItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedVariable = availableVariables.find(v => v.id === variable.variableId);

  const renderVariableOption = (v: WorkflowVariable) => {
    if (v.type === 'calculated') {
      return `${v.name} (${getVariableDisplayValue(v, availableVariables)})`;
    }
    return v.name;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-gray-700">Variable {index + 1}</h5>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              {isExpanded ? (
                <ChevronUp size={16} className="text-gray-500" />
              ) : (
                <ChevronDown size={16} className="text-gray-500" />
              )}
            </button>
            <button
              onClick={() => onRemove(index)}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <Trash2 size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        <select
          value={variable.variableId}
          onChange={(e) => onUpdate(index, 'variableId', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Select variable</option>
          {availableVariables
            .filter(v => !usedVariables.includes(v.id) || v.id === variable.variableId)
            .map(v => (
              <option key={v.id} value={v.id}>{renderVariableOption(v)}</option>
            ))}
        </select>

        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="100"
            value={variable.weight}
            onChange={(e) => onUpdate(index, 'weight', Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Weight: {variable.weight}%</span>
            <MaxVariableScore weight={variable.weight} maxScore={maxScore} />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t">
          <ConditionList
            conditions={variable.conditions || []}
            onChange={(conditions) => onUpdate(index, 'conditions', conditions)}
            variableName={selectedVariable?.name || `Variable ${index + 1}`}
            maxVariableScore={Math.round(((variable.weight / 100) * maxScore) * Math.pow(10,2)) / Math.pow(10,2)}
          />
        </div>
      )}
    </div>
  );
}