export type VariableType = 'string' | 'number' | 'boolean' | 'calculated';
export type SourceType = 'variable' | 'manual';

export interface BaseVariable {
  id: string;
  name: string;
  description?: string;
}

export interface StandardVariable extends BaseVariable {
  type: Exclude<VariableType, 'calculated'>;
  value?: string | number | boolean;
}

export interface CalculatedSource {
  type: SourceType;
  value: string; // Either variable ID or manual number value
}

export interface CalculatedVariable extends BaseVariable {
  type: 'calculated';
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  sourceVariables: [CalculatedSource, CalculatedSource];
}

export type WorkflowVariable = StandardVariable | CalculatedVariable;

export interface VariableOperation {
  label: string;
  value: CalculatedVariable['operation'];
  symbol: string;
}