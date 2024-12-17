import React from 'react';

interface MaxScoreInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function MaxScoreInput({ value, onChange }: MaxScoreInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Maximum Credit Score
      </label>
      <input
        type="number"
        min="1"
        max="1000"
        value={value}
        onChange={(e) => onChange(Math.max(1, Math.min(1000, Number(e.target.value))))}
        className="w-full px-3 py-2 border rounded-lg"
        placeholder="Enter maximum score"
      />
      <p className="text-xs text-gray-500">
        This is the maximum possible credit score that can be achieved.
      </p>
    </div>
  );
}