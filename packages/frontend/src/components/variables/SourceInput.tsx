import React from 'react';
import { CalculatedSource, WorkflowVariable } from '../../types/variables';
import { getVariableDisplayValue } from '../../utils/variableUtils';

interface SourceInputProps {
  source: CalculatedSource;
  onChange: (source: CalculatedSource) => void;
  variables: WorkflowVariable[];
  excludeVariableId?: string;
  label: string;
}

export function SourceInput({ source, onChange, variables, excludeVariableId, label }: SourceInputProps) {
  const availableVariables = variables.filter(v => v.id !== excludeVariableId);

  const renderVariableOption = (variable: WorkflowVariable) => {
    if (variable.type === 'calculated') {
      return `${variable.name} (${getVariableDisplayValue(variable, variables)})`;
    }
    return variable.name;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id={`variable-${label}`}
            checked={source.type === 'variable'}
            onChange={() => onChange({ type: 'variable', value: '' })}
            className="h-4 w-4 text-indigo-600"
          />
          <label htmlFor={`variable-${label}`} className="text-sm text-gray-600">
            Select Variable
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id={`manual-${label}`}
            checked={source.type === 'manual'}
            onChange={() => onChange({ type: 'manual', value: '' })}
            className="h-4 w-4 text-indigo-600"
          />
          <label htmlFor={`manual-${label}`} className="text-sm text-gray-600">
            Manual Input
          </label>
        </div>
      </div>

      {source.type === 'variable' ? (
        <select
          value={source.value}
          onChange={(e) => onChange({ ...source, value: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          required
        >
          <option value="">Select variable</option>
          <optgroup label="Number Variables">
            {availableVariables
              .filter(v => v.type === 'number')
              .map(v => (
                <option key={v.id} value={v.id}>{renderVariableOption(v)}</option>
              ))}
          </optgroup>
          <optgroup label="Calculated Variables">
            {availableVariables
              .filter(v => v.type === 'calculated')
              .map(v => (
                <option key={v.id} value={v.id}>{renderVariableOption(v)}</option>
              ))}
          </optgroup>
        </select>
      ) : (
        <input
          type="number"
          value={source.value}
          onChange={(e) => onChange({ ...source, value: e.target.value })}
          placeholder="Enter number"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      )}
    </div>
  );
}