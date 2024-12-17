import { WorkflowVariable } from '../types/workflow';

interface CreditScoreConfig {
  maxScore: number;
  variables: Array<{
    variableId: string;
    weight: number;
    conditions: Array<{
      operator: string;
      value1: number;
      value2?: number;
      score: number;
    }>;
  }>;
}

export function calculateCreditScore(
  config: CreditScoreConfig,
  variables: Record<string, any>
): number {
  let totalScore = 0;

  for (const variable of config.variables) {
    const value = variables[variable.variableId];
    if (typeof value !== 'number') continue;

    const score = evaluateConditions(value, variable.conditions);
    totalScore += (score * variable.weight) / 100;
  }

  return Math.round(totalScore * config.maxScore / 100);
}

function evaluateConditions(
  value: number,
  conditions: CreditScoreConfig['variables'][0]['conditions']
): number {
  for (const condition of conditions) {
    if (evaluateCondition(value, condition)) {
      return condition.score;
    }
  }
  return 0;
}

function evaluateCondition(
  value: number,
  condition: CreditScoreConfig['variables'][0]['conditions'][0]
): boolean {
  switch (condition.operator) {
    case 'less_than':
      return value < condition.value1;
    case 'less_than_equal':
      return value <= condition.value1;
    case 'greater_than':
      return value > condition.value1;
    case 'greater_than_equal':
      return value >= condition.value1;
    case 'equal':
      return value === condition.value1;
    case 'between':
      return value >= condition.value1 && value <= (condition.value2 ?? condition.value1);
    default:
      return false;
  }
}