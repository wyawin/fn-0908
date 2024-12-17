import { useCallback } from 'react';
import { Workflow } from '../types/workflow';

export function useNodeDeletion(workflow: Workflow, onUpdateWorkflow: (workflow: Workflow) => void) {
  const deleteNode = useCallback((nodeId: string) => {
    // Remove the node and its connections
    const updatedNodes = workflow.nodes.filter(node => node.id !== nodeId);
    const updatedConnections = workflow.connections.filter(
      conn => conn.source !== nodeId && conn.target !== nodeId
    );

    onUpdateWorkflow({
      ...workflow,
      nodes: updatedNodes,
      connections: updatedConnections
    });
  }, [workflow, onUpdateWorkflow]);

  return { deleteNode };
}