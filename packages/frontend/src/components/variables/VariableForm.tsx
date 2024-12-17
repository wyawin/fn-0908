import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { 
  WorkflowVariable, 
  VariableType, 
  CalculatedVariable,
  CalculatedSource 
} from '../../types/variables';
import { VARIABLE_OPERATIONS } from '../../constants/variables';
import { SourceInput } from './SourceInput';
import { detectCircularDependency } from '../../utils/variableUtils';

interface VariableFormProps {
  existingVariables: WorkflowVariable[];
  onAddVariable: (variable: WorkflowVariable) => void;
}

export function VariableForm({ existingVariables, onAddVariable }: VariableFormProps) {
  const [variableType, setVariableType] = useState<VariableType>('string');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [operation, setOperation] = useState<CalculatedVariable['operation']>('add');
  const [sourceVariables, setSourceVariables] = useState<[CalculatedSource, CalculatedSource]>([
    { type: 'variable', value: '' },
    { type: 'variable', value: '' }
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for circular dependencies
    if (variableType === 'calculated') {
      const newVarId = `var-${Date.now()}`;
      const hasCircular = sourceVariables.some(source => 
        source.type === 'variable' && 
        detectCircularDependency(newVarId, source.value, [
          ...existingVariables,
          {
            id: newVarId,
            type: 'calculated',
            name,
            description,
            operation,
            sourceVariables
          }
        ])
      );

      if (hasCircular) {
        setError('Cannot create circular dependencies between calculated variables');
        return;
      }
    }
    
    const baseVariable = {
      id: `var-${Date.now()}`,
      name,
      description
    };

    const variable: WorkflowVariable = variableType === 'calculated'
      ? {
          ...baseVariable,
          type: 'calculated',
          operation,
          sourceVariables
        }
      : {
          ...baseVariable,
          type: variableType as Exclude<VariableType, 'calculated'>,
          value: undefined
        };

    onAddVariable(variable);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setVariableType('string');
    setOperation('add');
    setSourceVariables([
      { type: 'variable', value: '' },
      { type: 'variable', value: '' }
    ]);
    setError(null);
  };

  const updateSource = (index: 0 | 1, source: CalculatedSource) => {
    setError(null);
    const newSources = [...sourceVariables] as [CalculatedSource, CalculatedSource];
    newSources[index] = source;
    setSourceVariables(newSources);
  };

  const isCalculatedValid = () => {
    if (variableType !== 'calculated') return true;
    if (error) return false;
    
    return sourceVariables.every(source => 
      (source.type === 'variable' && source.value) || 
      (source.type === 'manual' && !isNaN(Number(source.value)))
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Variable name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="px-3 py-2 border rounded-lg"
          required
        />
        <select
          value={variableType}
          onChange={e => setVariableType(e.target.value as VariableType)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="calculated">Calculated</option>
        </select>
      </div>

      {variableType === 'calculated' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SourceInput
              source={sourceVariables[0]}
              onChange={(source) => updateSource(0, source)}
              variables={existingVariables}
              excludeVariableId={sourceVariables[1].type === 'variable' ? sourceVariables[1].value : undefined}
              label="First Value"
            />
            <SourceInput
              source={sourceVariables[1]}
              onChange={(source) => updateSource(1, source)}
              variables={existingVariables}
              excludeVariableId={sourceVariables[0].type === 'variable' ? sourceVariables[0].value : undefined}
              label="Second Value"
            />
          </div>

          <select
            value={operation}
            onChange={e => setOperation(e.target.value as CalculatedVariable['operation'])}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {VARIABLE_OPERATIONS.map(op => (
              <option key={op.value} value={op.value}>
                {op.label} ({op.symbol})
              </option>
            ))}
          </select>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>
      )}

      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />

      <button
        type="submit"
        disabled={!isCalculatedValid()}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg 
          hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={16} />
        Add Variable
      </button>
    </form>
  );
}