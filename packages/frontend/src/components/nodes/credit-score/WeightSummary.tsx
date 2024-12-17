import React from 'react';

interface WeightSummaryProps {
  totalWeight: number;
}

export function WeightSummary({ totalWeight }: WeightSummaryProps) {
  const isValid = Math.abs(totalWeight - 100) < 0.01;

  return (
    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg text-sm">
      <span className="font-medium text-blue-700">Total Weight:</span>
      <span className={`font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
        {totalWeight}%
      </span>
    </div>
  );
}