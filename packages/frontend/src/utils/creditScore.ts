import { Workflow, WorkflowNode } from '../types/workflow';
import { calculateCreditScore } from './creditScoreUtils';

export function calculateWorkflowCreditScore(
  workflow: Workflow,
  variables: Record<string, any>
): number | null {
  // Find the credit score node
  const creditScoreNode = workflow.nodes.find(node => node.type === 'credit-score');
  if (!creditScoreNode) return null;

  // Get the trigger node to access variable definitions
  const triggerNode = workflow.nodes.find(node => node.type === 'trigger');
  if (!triggerNode?.data.variables) return null;

  // Convert variables to the format expected by calculateCreditScore
  const formattedVariables = triggerNode.data.variables.map(v => ({
    ...v,
    value: variables[v.id]
  }));

  return calculateCreditScore(creditScoreNode.data.config, formattedVariables);
}