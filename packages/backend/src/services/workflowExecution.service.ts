import { Workflow, WorkflowNode } from '../types/workflow';
import { calculateCreditScore } from '../utils/creditScore';

interface ExecutionResult {
  status: 'approved' | 'rejected' | 'review';
  creditScore?: number;
  comment?: string;
}

export class WorkflowExecutionService {
  async execute(workflow: Workflow, variables: Record<string, any>): Promise<ExecutionResult> {
    const creditScoreNode = this.findCreditScoreNode(workflow);
    let creditScore: number | undefined;

    if (creditScoreNode) {
      creditScore = calculateCreditScore(creditScoreNode.data.config, variables);
    }

    const result = await this.executeWorkflowLogic(workflow, variables, creditScore);
    return {
      ...result,
      creditScore,
    };
  }

  private findCreditScoreNode(workflow: Workflow): WorkflowNode | undefined {
    return workflow.nodes.find(node => node.type === 'credit-score');
  }

  private async executeWorkflowLogic(
    workflow: Workflow,
    variables: Record<string, any>,
    creditScore?: number
  ): Promise<ExecutionResult> {
    let currentNode = workflow.nodes.find(node => node.type === 'trigger');
    if (!currentNode) throw new Error('No trigger node found');

    while (currentNode) {
      switch (currentNode.type) {
        case 'credit-score-check':
          if (creditScore === undefined) break;
          
          const { operator, threshold } = currentNode.data.config;
          const condition = this.evaluateCondition(creditScore, operator, threshold);
          currentNode = this.findNextNode(workflow, currentNode.id, condition ? 'true' : 'false');
          break;

        case 'condition':
          const { variable, operator: condOperator, value } = currentNode.data.config;
          const variableValue = variables[variable];
          const conditionResult = this.evaluateCondition(variableValue, condOperator, value);
          currentNode = this.findNextNode(workflow, currentNode.id, conditionResult ? 'true' : 'false');
          break;

        case 'action':
          return {
            status: currentNode.data.config.actionType,
            comment: currentNode.data.config.comment,
          };

        default:
          currentNode = this.findNextNode(workflow, currentNode.id, 'default');
      }

      if (!currentNode) break;
    }

    return { status: 'review', comment: 'Workflow ended without decision' };
  }

  private evaluateCondition(value: number, operator: string, threshold: number): boolean {
    switch (operator) {
      case 'greater_than':
        return value > threshold;
      case 'less_than':
        return value < threshold;
      case 'greater_than_equal':
        return value >= threshold;
      case 'less_than_equal':
        return value <= threshold;
      case 'equal':
        return value === threshold;
      default:
        return false;
    }
  }

  private findNextNode(workflow: Workflow, currentNodeId: string, connectionType: string): WorkflowNode | undefined {
    const connection = workflow.connections.find(
      conn => conn.source === currentNodeId && conn.type === connectionType
    );
    if (!connection) return undefined;
    
    return workflow.nodes.find(node => node.id === connection.target);
  }
}