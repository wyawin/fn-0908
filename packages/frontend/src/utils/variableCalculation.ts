import { WorkflowVariable, CalculatedVariable } from '../types/variables';
import { calculateVariableValue } from './variableUtils';

export function calculateVariableValues(
  variables: WorkflowVariable[],
  inputValues: Record<string, any>
): Record<string, number> {
  const calculatedValues: Record<string, number> = {};
  const calculatedVariables = variables.filter(v => v.type === 'calculated') as CalculatedVariable[];

  // Convert input variables to the format expected by calculateVariableValue
  const formattedVariables = variables.map(v => ({
    ...v,
    value: inputValues[v.id]
  }));

  // Calculate values for all calculated variables
  for (const variable of calculatedVariables) {
    const value = calculateVariableValue(variable, formattedVariables);
    if (value !== null) {
      calculatedValues[variable.id] = value;
    }
  }

  return calculatedValues;
}