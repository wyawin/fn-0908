import { Workflow, WorkflowNode, Connection, NodeType } from '../types/workflow';
import { CreditScoreNodeConfig } from '../types/creditScore';
import { calculateTotalWeight } from './creditScoreUtils';

export interface ValidationError {
  nodeId?: string;
  connectionId?: string;
  message: string;
  type: 'error' | 'warning';
}

export function validateWorkflow(workflow: Workflow): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate nodes
  workflow.nodes.forEach(node => {
    const nodeErrors = validateNode(node, workflow);
    errors.push(...nodeErrors);
  });

  // Validate connections
  workflow.connections.forEach(connection => {
    const connectionErrors = validateConnection(connection, workflow.nodes);
    errors.push(...connectionErrors);
  });

  // Validate workflow structure
  const structureErrors = validateWorkflowStructure(workflow);
  errors.push(...structureErrors);

  return errors;
}

function validateNode(node: WorkflowNode, workflow: Workflow): ValidationError[] {
  const errors: ValidationError[] = [];

  switch (node.type) {
    case 'credit-score':
      const config = node.data.config as CreditScoreNodeConfig;
      if (!config.variables || config.variables.length === 0) {
        errors.push({
          nodeId: node.id,
          message: 'At least one variable is required',
          type: 'error'
        });
      } else {
        const totalWeight = calculateTotalWeight(config.variables);
        if (Math.abs(totalWeight - 100) > 0.01) {
          errors.push({
            nodeId: node.id,
            message: 'Variable weights must sum to 100%',
            type: 'error'
          });
        }
      }
      break;

    case 'credit-score-check':
      if (!node.data.config.creditScoreNodeId) {
        errors.push({
          nodeId: node.id,
          message: 'Credit score node must be selected',
          type: 'error'
        });
      }
      break;

    case 'condition':
      if (!node.data.config.variable) {
        errors.push({
          nodeId: node.id,
          message: 'Condition variable is required',
          type: 'error'
        });
      }
      break;

    case 'action':
      if (!node.data.config.actionType) {
        errors.push({
          nodeId: node.id,
          message: 'Action type is required',
          type: 'error'
        });
      }
      break;
  }

  return errors;
}

function validateConnection(connection: Connection, nodes: WorkflowNode[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const sourceNode = nodes.find(n => n.id === connection.source);
  const targetNode = nodes.find(n => n.id === connection.target);

  if (!sourceNode || !targetNode) {
    errors.push({
      connectionId: connection.id,
      message: 'Invalid connection: source or target node not found',
      type: 'error'
    });
    return errors;
  }

  // Define valid connections for each node type
  const validConnections: Record<NodeType, NodeType[]> = {
    trigger: ['credit-score', 'condition', 'credit-score-check', 'action'],
    'credit-score': ['credit-score-check', 'condition', 'action'],
    'credit-score-check': ['action', 'credit-score', 'condition'],
    condition: ['action', 'credit-score', 'condition', 'credit-score-check'],
    action: []
  };

  if (!validConnections[sourceNode.type]?.includes(targetNode.type)) {
    errors.push({
      connectionId: connection.id,
      message: `Invalid connection: ${sourceNode.type} cannot connect to ${targetNode.type}`,
      type: 'error'
    });
  }

  return errors;
}

function validateWorkflowStructure(workflow: Workflow): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check for trigger node
  const triggerNodes = workflow.nodes.filter(n => n.type === 'trigger');
  if (triggerNodes.length === 0) {
    errors.push({
      message: 'Workflow must have at least one trigger node',
      type: 'error'
    });
  } else if (triggerNodes.length > 1) {
    errors.push({
      message: 'Workflow should only have one trigger node',
      type: 'warning'
    });
  }

  // Check for disconnected nodes
  workflow.nodes.forEach(node => {
    if (node.type !== 'trigger') {
      const hasIncomingConnection = workflow.connections.some(c => c.target === node.id);
      if (!hasIncomingConnection) {
        errors.push({
          nodeId: node.id,
          message: 'Node is not connected to the workflow',
          type: 'warning'
        });
      }
    }
  });

  return errors;
}