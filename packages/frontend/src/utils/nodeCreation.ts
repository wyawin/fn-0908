import { WorkflowNode, NodeType } from '../types/workflow';
import { NODE_TYPE_CONFIG } from '../constants/nodeTypes';

export function createNode(type: NodeType, position: { x: number; y: number }): WorkflowNode {
  const config = NODE_TYPE_CONFIG[type];
  
  return {
    id: `node-${Date.now()}`,
    type,
    position,
    data: {
      title: config.title,
      description: config.description,
      config: { ...config.defaultConfig }
    }
  };
}