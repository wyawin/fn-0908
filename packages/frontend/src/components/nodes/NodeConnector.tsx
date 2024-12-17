import React from 'react';
import { ConnectionType } from '../../types/workflow';

interface NodeConnectorProps {
  position: 'input' | 'output';
  type?: ConnectionType;
  onConnectionStart?: () => void;
  onConnectionEnd?: () => void;
  isConnecting?: boolean;
  isValidTarget?: boolean;
  label?: string;
}

export function NodeConnector({
  position,
  type = 'default',
  onConnectionStart,
  onConnectionEnd,
  isConnecting = false,
  isValidTarget = false,
  label
}: NodeConnectorProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (position === 'output' && onConnectionStart) {
      onConnectionStart();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (position === 'input' && onConnectionEnd) {
      onConnectionEnd();
    }
  };

  const getConnectorStyle = () => {
    if (position === 'input' && isConnecting) {
      return isValidTarget 
        ? 'border-green-500 bg-green-100 hover:border-green-600 hover:bg-green-200'
        : 'border-red-500 bg-red-100 hover:border-red-600 hover:bg-red-200';
    }

    switch (type) {
      case 'true':
        return 'border-emerald-500 bg-emerald-100 hover:border-emerald-600 hover:bg-emerald-200';
      case 'false':
        return 'border-rose-500 bg-rose-100 hover:border-rose-600 hover:bg-rose-200';
      default:
        return isConnecting
          ? 'border-indigo-500 bg-indigo-100 hover:border-indigo-600 hover:bg-indigo-200'
          : 'border-gray-400 bg-white hover:border-indigo-500 hover:bg-indigo-100';
    }
  };

  const getLabelStyle = () => {
    switch (type) {
      case 'true':
        return 'text-emerald-700 font-medium';
      case 'false':
        return 'text-rose-700 font-medium';
      default:
        return 'text-gray-600';
    }
  };

  const getVerticalPosition = () => {
    if (type === 'true') return '25%';
    if (type === 'false') return '75%';
    return '50%';
  };

  return (
    <div
      className="absolute flex items-center gap-2"
      style={{
        [position === 'input' ? 'left' : 'right']: 0,
        top: getVerticalPosition(),
        transform: `translate(${position === 'input' ? '-50%' : '50%'}, -50%)`,
        flexDirection: position === 'output' ? 'row' : 'row-reverse',
        zIndex: 1000,
        pointerEvents: 'all'
      }}
    >
      {label && (
        <span className={`text-xs select-none whitespace-nowrap ${getLabelStyle()}`}>
          {label}
        </span>
      )}
      <div
        className={`w-3 h-3 rounded-full border-2 cursor-crosshair ${getConnectorStyle()} transition-colors`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}