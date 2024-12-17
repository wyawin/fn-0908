import React from 'react';
import { Workflow, ConnectionType } from '../../types/workflow';
import { NODE_DIMENSIONS } from '../../constants/dimensions';

interface WorkflowConnectionsProps {
  workflow: Workflow;
  connectingFrom: { nodeId: string | null; type: ConnectionType };
  mousePosition: { x: number; y: number };
}

export function WorkflowConnections({ workflow, connectingFrom, mousePosition }: WorkflowConnectionsProps) {
  const getNodeConnectionPoints = (nodeId: string, isSource: boolean, type: ConnectionType = 'default') => {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };

    const { width, height } = NODE_DIMENSIONS;

    // For condition nodes, adjust output points based on connection type
    if (node.type === 'condition' && isSource) {
      const yOffset = type === 'true' ? height * 0.25 : type === 'false' ? height * 0.75 : height * 0.5;
      return {
        x: node.position.x + width,
        y: node.position.y + yOffset
      };
    }

    return {
      x: node.position.x + (isSource ? width : 0),
      y: node.position.y + (height / 2)
    };
  };

  const getConnectionPath = (startX: number, startY: number, endX: number, endY: number) => {
    const dx = endX - startX;
    const controlPointOffset = Math.min(Math.abs(dx) * 0.5, 200);

    return `M ${startX} ${startY} 
            C ${startX + controlPointOffset} ${startY},
              ${endX - controlPointOffset} ${endY},
              ${endX} ${endY}`;
  };

  const getConnectionColor = (type: ConnectionType) => {
    switch (type) {
      case 'true':
        return '#10b981'; // emerald-500
      case 'false':
        return '#f43f5e'; // rose-500
      default:
        return '#94a3b8'; // gray-400
    }
  };

  return (
    <svg className="absolute inset-0 pointer-events-none z-[500]" style={{ overflow: 'visible' }}>
      <defs>
        {['default', 'true', 'false'].map(type => (
          <marker
            key={type}
            id={`arrowhead-${type}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={getConnectionColor(type as ConnectionType)} />
          </marker>
        ))}
      </defs>

      {/* Existing Connections */}
      {workflow.connections.map(connection => {
        const sourcePoint = getNodeConnectionPoints(connection.source, true, connection.type);
        const targetPoint = getNodeConnectionPoints(connection.target, false);
        const color = getConnectionColor(connection.type);

        return (
          <g key={connection.id}>
            <path
              d={getConnectionPath(sourcePoint.x, sourcePoint.y, targetPoint.x, targetPoint.y)}
              stroke={color}
              strokeWidth="2"
              fill="none"
              markerEnd={`url(#arrowhead-${connection.type})`}
            />
          </g>
        );
      })}

      {/* Active Connection Line */}
      {connectingFrom.nodeId && (
        <path
          d={getConnectionPath(
            getNodeConnectionPoints(connectingFrom.nodeId, true, connectingFrom.type).x,
            getNodeConnectionPoints(connectingFrom.nodeId, true, connectingFrom.type).y,
            mousePosition.x,
            mousePosition.y
          )}
          stroke={getConnectionColor(connectingFrom.type)}
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
          markerEnd={`url(#arrowhead-${connectingFrom.type})`}
        />
      )}
    </svg>
  );
}