import React from 'react';

interface MaxVariableScoreProps {
  weight: number;
  maxScore: number;
}

export function MaxVariableScore({ weight, maxScore }: MaxVariableScoreProps) {
  const factor = Math.pow(10, 2);
  const maxVariableScore = Math.round(((weight / 100) * maxScore) * factor) / factor;

  return (
    <div className="text-sm text-gray-600">
      Max Score: <span className="font-medium">{maxVariableScore}</span>
    </div>
  );
}