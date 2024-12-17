import { useState, useCallback } from 'react';
import { Connection, Workflow, WorkflowNode, ConnectionType } from '../types/workflow';

interface ConnectionState {
  nodeId: string | null;
  type: ConnectionType;
}

export function useConnections(workflow: Workflow, onUpdateWorkflow: (workflow: Workflow) => void) {
  const [connectingFrom, setConnectingFrom] = useState<ConnectionState>({
    nodeId: null,
    type: 'default'
  });

  const isValidConnection = useCallback((sourceId: string, targetId: string): boolean => {
    const sourceNode = workflow.nodes.find(n => n.id === sourceId);
    const targetNode = workflow.nodes.find(n => n.id === targetId);

    if (!sourceNode || !targetNode) return false;
    if (sourceId === targetId) return false;

    // Check for existing connection
    const connectionExists = workflow.connections.some(
      conn => conn.source === sourceId && conn.target === targetId
    );
    if (connectionExists) return false;

    // Define valid connection rules
    const validConnections: Record<string, string[]> = {
      trigger: ['credit-score', 'condition', 'action', 'credit-score-check'],
      'credit-score': ['credit-score-check', 'condition', 'action'],
      'credit-score-check': ['action', 'condition'],
      condition: ['action', 'credit-score', 'condition', 'credit-score-check'],
      action: []
    };

    return validConnections[sourceNode.type]?.includes(targetNode.type) || false;
  }, [workflow]);

  const handleConnectionStart = useCallback((nodeId: string, type: ConnectionType = 'default') => {
    setConnectingFrom({ nodeId, type });
  }, []);

  const handleConnectionEnd = useCallback((targetNodeId: string) => {
    if (!connectingFrom.nodeId || !targetNodeId) return;

    if (isValidConnection(connectingFrom.nodeId, targetNodeId)) {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        source: connectingFrom.nodeId,
        target: targetNodeId,
        type: connectingFrom.type
      };

      onUpdateWorkflow({
        ...workflow,
        connections: [...workflow.connections, newConnection]
      });
    }

    setConnectingFrom({ nodeId: null, type: 'default' });
  }, [connectingFrom, workflow, onUpdateWorkflow, isValidConnection]);

  const isValidTarget = useCallback((nodeId: string): boolean => {
    if (!connectingFrom.nodeId || !nodeId) return false;
    return isValidConnection(connectingFrom.nodeId, nodeId);
  }, [connectingFrom.nodeId, isValidConnection]);

  return {
    connectingFrom,
    handleConnectionStart,
    handleConnectionEnd,
    isValidTarget
  };
}