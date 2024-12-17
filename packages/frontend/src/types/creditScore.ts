// Credit Score Types
export interface ScoreCondition {
  id: string;
  operator: 'less_than' | 'less_than_equal' | 'greater_than' | 'greater_than_equal' | 'equal' | 'between';
  value1: number;
  value2?: number; // Used for 'between' operator
  score: number;
}

export interface CreditScoreVariable {
  variableId: string;
  weight: number;
  conditions: ScoreCondition[];
}

export interface CreditScoreNodeConfig {
  maxScore: number;
  variables: CreditScoreVariable[];
}

export const SCORE_OPERATORS = [
  { value: 'less_than', label: 'Less than', symbol: '<' },
  { value: 'less_than_equal', label: 'Less than or equal', symbol: '≤' },
  { value: 'greater_than', label: 'Greater than', symbol: '>' },
  { value: 'greater_than_equal', label: 'Greater than or equal', symbol: '≥' },
  { value: 'equal', label: 'Equal to', symbol: '=' },
  { value: 'between', label: 'Between', symbol: '↔' }
] as const;