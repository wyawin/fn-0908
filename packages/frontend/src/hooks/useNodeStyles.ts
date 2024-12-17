import { WorkflowNode } from '../types/workflow';

export function useNodeStyles(node: WorkflowNode) {
  const nodeColors = {
    trigger: 'bg-blue-50 border-blue-200',
    'credit-score': 'bg-purple-50 border-purple-200',
    condition: 'bg-yellow-50 border-yellow-200',
    action: 'bg-green-50 border-green-200'
  };

  return nodeColors[node.type];
}