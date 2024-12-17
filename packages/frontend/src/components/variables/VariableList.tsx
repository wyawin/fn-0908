import React from 'react';
import { WorkflowVariable } from '../../types/variables';
import { Trash2 } from 'lucide-react';
import { getVariableDisplayValue } from '../../utils/variableUtils';

interface VariableListProps {
  variables: WorkflowVariable[];
  onRemoveVariable: (id: string) => void;
}

export function VariableList({ variables, onRemoveVariable }: VariableListProps) {
  return (
    <div className="space-y-2">
      {variables.map((variable) => (
        <div 
          key={variable.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{variable.name}</span>
              <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                {variable.type}
              </span>
            </div>
            {variable.description && (
              <p className="text-sm text-gray-600 mt-1">
                {variable.description}
              </p>
            )}
            {variable.type === 'calculated' && (
              <p className="text-sm text-gray-500 mt-1">
                {getVariableDisplayValue(variable, variables)}
              </p>
            )}
          </div>
          <button
            onClick={() => onRemoveVariable(variable.id)}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <Trash2 size={16} className="text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  );
}