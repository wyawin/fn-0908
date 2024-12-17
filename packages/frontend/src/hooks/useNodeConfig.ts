import { useState } from 'react';
import { WorkflowNode, Workflow } from '../types/workflow';

export function useNodeConfig(workflow: Workflow, onUpdateWorkflow: (workflow: Workflow) => void) {
  const [configuredNode, setConfiguredNode] = useState<string | null>(null);

  const openNodeConfig = (nodeId: string) => {
    setConfiguredNode(nodeId);
  };

  const closeNodeConfig = () => {
    setConfiguredNode(null);
  };

  const updateNodeConfig = (updatedNode: WorkflowNode) => {
    const updatedNodes = workflow.nodes.map(node =>
      node.id === updatedNode.id ? updatedNode : node
    );
    onUpdateWorkflow({ ...workflow, nodes: updatedNodes });
  };

  return {
    configuredNode,
    openNodeConfig,
    closeNodeConfig,
    updateNodeConfig
  };
}