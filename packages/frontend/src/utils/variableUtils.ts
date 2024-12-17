import { WorkflowVariable, CalculatedVariable, CalculatedSource } from '../types/variables';

export function getSourceDisplayValue(
  source: CalculatedSource,
  allVariables: WorkflowVariable[]
): string {
  if (source.type === 'manual') {
    return source.value;
  }
  
  const variable = allVariables.find(v => v.id === source.value);
  if (!variable) return 'Unknown variable';
  
  if (variable.type === 'calculated') {
    return `(${getVariableDisplayValue(variable, allVariables)})`;
  }
  
  return variable.name;
}

export function getVariableDisplayValue(
  variable: CalculatedVariable,
  allVariables: WorkflowVariable[]
): string {
  const [source1, source2] = variable.sourceVariables;
  
  const operationSymbol = {
    add: '+',
    subtract: '-',
    multiply: '×',
    divide: '÷'
  }[variable.operation];

  const value1 = getSourceDisplayValue(source1, allVariables);
  const value2 = getSourceDisplayValue(source2, allVariables);

  return `${value1} ${operationSymbol} ${value2}`;
}

export function calculateVariableValue(
  variable: CalculatedVariable,
  allVariables: WorkflowVariable[]
): number | null {
  const getValue = (source: CalculatedSource): number | null => {
    if (source.type === 'manual') {
      const value = Number(source.value);
      return isNaN(value) ? null : value;
    }

    const sourceVariable = allVariables.find(v => v.id === source.value);
    if (!sourceVariable) return null;

    if (sourceVariable.type === 'calculated') {
      return calculateVariableValue(sourceVariable, allVariables);
    }

    return typeof sourceVariable.value === 'number' ? sourceVariable.value : null;
  };

  const value1 = getValue(variable.sourceVariables[0]);
  const value2 = getValue(variable.sourceVariables[1]);

  if (value1 === null || value2 === null) return null;

  switch (variable.operation) {
    case 'add':
      return value1 + value2;
    case 'subtract':
      return value1 - value2;
    case 'multiply':
      return value1 * value2;
    case 'divide':
      return value2 === 0 ? null : value1 / value2;
    default:
      return null;
  }
}

export function detectCircularDependency(
  variableId: string,
  sourceId: string,
  allVariables: WorkflowVariable[]
): boolean {
  const visited = new Set<string>();

  function traverse(currentId: string): boolean {
    if (currentId === variableId) return true;
    if (visited.has(currentId)) return false;
    
    visited.add(currentId);
    
    const variable = allVariables.find(v => v.id === currentId);
    if (!variable || variable.type !== 'calculated') return false;

    return variable.sourceVariables.some(source => 
      source.type === 'variable' && traverse(source.value)
    );
  }

  return traverse(sourceId);
}