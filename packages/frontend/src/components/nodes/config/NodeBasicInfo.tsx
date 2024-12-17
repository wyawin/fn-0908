import React from 'react';

interface NodeBasicInfoProps {
  title: string;
  description: string;
  onUpdate: (updates: { title: string; description: string }) => void;
}

export function NodeBasicInfo({ title, description, onUpdate }: NodeBasicInfoProps) {
  return (
    <div className="space-y-4 mb-6 pb-6 border-b">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Node Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onUpdate({ title: e.target.value, description })}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Enter node title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => onUpdate({ title, description: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          rows={2}
          placeholder="Enter node description"
        />
      </div>
    </div>
  );
}