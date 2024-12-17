import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ScoreCondition } from '../../../types/creditScore';
import { SCORE_OPERATORS } from '../../../types/creditScore';

interface ConditionListProps {
  conditions: ScoreCondition[];
  onChange: (conditions: ScoreCondition[]) => void;
  variableName: string;
  maxVariableScore: number;
}

export function ConditionList({ conditions, onChange, variableName, maxVariableScore }: ConditionListProps) {
  const addCondition = () => {
    const newCondition: ScoreCondition = {
      id: `cond-${Date.now()}`,
      operator: 'less_than',
      value1: 0,
      score: 0
    };
    onChange([...conditions, newCondition]);
  };

  const updateCondition = (index: number, updates: Partial<ScoreCondition>) => {
    const newConditions = conditions.map((condition, i) => 
      i === index ? { ...condition, ...updates } : condition
    );
    onChange(newConditions);
  };

  const removeCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium text-gray-700">Score Conditions</h6>
          <p className="text-xs text-gray-500 mt-1">
            Maximum score for this variable: {maxVariableScore} points
          </p>
        </div>
        <button
          onClick={addCondition}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Plus size={14} />
          Add Condition
        </button>
      </div>

      <div className="space-y-2">
        {conditions.map((condition, index) => (
          <div key={condition.id} className="p-3 bg-white rounded border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Condition {index + 1}</span>
              <button
                onClick={() => removeCondition(index)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <Trash2 size={14} className="text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <select
                  value={condition.operator}
                  onChange={(e) => updateCondition(index, { 
                    operator: e.target.value as ScoreCondition['operator']
                  })}
                  className="w-full px-2 py-1 text-sm border rounded"
                >
                  {SCORE_OPERATORS.map(op => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-3">
                <input
                  type="number"
                  value={condition.value1}
                  onChange={(e) => updateCondition(index, { 
                    value1: Number(e.target.value)
                  })}
                  className="w-full px-2 py-1 text-sm border rounded"
                  placeholder="Value"
                />
              </div>

              {condition.operator === 'between' && (
                <>
                  <div className="col-span-1 text-center text-sm text-gray-500">and</div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={condition.value2 ?? ''}
                      onChange={(e) => updateCondition(index, { 
                        value2: Number(e.target.value)
                      })}
                      className="w-full px-2 py-1 text-sm border rounded"
                      placeholder="Value 2"
                    />
                  </div>
                </>
              )}

              <div className={`${condition.operator === 'between' ? 'col-span-1' : 'col-span-5'} text-center text-sm text-gray-500`}>
                then
              </div>

              <div className="col-span-3">
                <input
                  type="number"
                  min="0"
                  max={maxVariableScore}
                  value={condition.score}
                  onChange={(e) => updateCondition(index, { 
                    score: Math.min(maxVariableScore, Math.max(0, Number(e.target.value)))
                  })}
                  className="w-full px-2 py-1 text-sm border rounded"
                  placeholder="Score"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {conditions.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          No conditions set. Add conditions to specify how {variableName} affects the credit score.
        </p>
      )}
    </div>
  );
}