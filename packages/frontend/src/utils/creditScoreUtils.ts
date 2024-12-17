import { CreditScoreVariable, CreditScoreNodeConfig, ScoreCondition } from '../types/creditScore';
import { WorkflowVariable } from '../types/variables';
import { calculateVariableValue } from './variableUtils';

export const calculateTotalWeight = (variables: CreditScoreVariable[]): number => {
  return variables.reduce((sum, v) => sum + v.weight, 0);
};

export const isValidConfiguration = (variables: CreditScoreVariable[]): boolean => {
  const totalWeight = calculateTotalWeight(variables);
  return Math.abs(totalWeight - 100) < 0.01 && 
         variables.every(v => v.variableId && v.weight > 0);
};

const evaluateCondition = (value: number, condition: ScoreCondition): boolean => {
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
};

const getVariableScore = (value: number, conditions: ScoreCondition[]): number => {
  for (const condition of conditions) {
    if (evaluateCondition(value, condition)) {
      return condition.score;
    }
  }
  return 0; // Default score if no conditions match
};

export const calculateCreditScore = (
  config: CreditScoreNodeConfig,
  availableVariables: WorkflowVariable[]
): number | null => {
  let totalScore = 0;

  for (const variable of config.variables) {
    const sourceVariable = availableVariables.find(v => v.id === variable.variableId);
    if (!sourceVariable) return null;

    let value: number | null;
    if (sourceVariable.type === 'calculated') {
      value = calculateVariableValue(sourceVariable, availableVariables);
    } else if (sourceVariable.type === 'number') {
      value = sourceVariable.value as number;
    } else {
      return null;
    }

    if (value === null) return null;
    
    // Calculate score based on conditions
    const variableScore = getVariableScore(value, variable.conditions || []);
    totalScore += variableScore;
  }

  // Scale the score to the maximum score
  // return Math.round(totalScore * config.maxScore / 100);
  return totalScore;
};