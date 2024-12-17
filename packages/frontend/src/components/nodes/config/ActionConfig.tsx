import React, { useState } from 'react';
import { WorkflowNode } from '../../../types/workflow';
import { NodeBasicInfo } from './NodeBasicInfo';

interface ActionConfigProps {
  node: WorkflowNode;
  onUpdate: (node: WorkflowNode) => void;
  onClose: () => void;
}

export function ActionConfig({ node, onUpdate, onClose }: ActionConfigProps) {
  const [actionType, setActionType] = useState(node.data.config.actionType || 'approve');
  const [notifyEmail, setNotifyEmail] = useState(node.data.config.notifyEmail || '');
  const [comment, setComment] = useState(node.data.config.comment || '');

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

  const handleSave = () => {
    onUpdate({
      ...node,
      data: {
        ...node.data,
        config: {
          ...node.data.config,
          actionType,
          notifyEmail,
          comment
        }
      }
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <NodeBasicInfo
        title={node.data.title}
        description={node.data.description}
        onUpdate={handleBasicInfoUpdate}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Action Type
        </label>
        <select
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="approve">Approve Application</option>
          <option value="reject">Reject Application</option>
          <option value="review">Send for Review</option>
        </select>
      </div>

      {actionType === 'review' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notify Email
          </label>
          <input
            type="email"
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter email address"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
          placeholder="Add a description (optional)"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Save Configuration
      </button>
    </div>
  );
}