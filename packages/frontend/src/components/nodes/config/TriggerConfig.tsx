import React, { useState } from 'react';
import { WorkflowNode } from '../../../types/workflow';
import { VariableList } from '../../variables/VariableList';
import { VariableForm } from '../../variables/VariableForm';
import { WorkflowVariable } from '../../../types/variables';
import { NodeBasicInfo } from './NodeBasicInfo';

interface TriggerConfigProps {
  node: WorkflowNode;
  onUpdate: (node: WorkflowNode) => void;
}

export function TriggerConfig({ node, onUpdate }: TriggerConfigProps) {
  const handleBasicInfoUpdate = (updates: { title: string; description: string }) => {
    onUpdate({
      ...node,
      data: {
        ...node.data,
        title: updates.title,
        description: updates.description
      }
    });
  };

  const handleAddVariable = (variable: WorkflowVariable) => {
    onUpdate({
      ...node,
      data: {
        ...node.data,
        variables: [...(node.data.variables || []), variable]
      }
    });
  };

  const handleRemoveVariable = (variableId: string) => {
    onUpdate({
      ...node,
      data: {
        ...node.data,
        variables: (node.data.variables || []).filter(v => v.id !== variableId)
      }
    });
  };

  return (
    <div className="space-y-6">
      <NodeBasicInfo
        title={node.data.title}
        description={node.data.description}
        onUpdate={handleBasicInfoUpdate}
      />

      <div>
        <h4 className="font-medium mb-2">Workflow Variables</h4>
        <VariableList
          variables={node.data.variables || []}
          onRemoveVariable={handleRemoveVariable}
        />
      </div>

      <div>
        <h4 className="font-medium mb-2">Add New Variable</h4>
        <VariableForm
          existingVariables={node.data.variables || []}
          onAddVariable={handleAddVariable}
        />
      </div>
    </div>
  );
}