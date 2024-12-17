import React from 'react';
import { WorkflowVariable } from '../../types/variables';

interface FormFieldProps {
  variable: WorkflowVariable;
  value: any;
  onChange: (variable: WorkflowVariable, value: string) => void;
}

export function FormField({ variable, value, onChange }: FormFieldProps) {
  return (
    <div>
      <label 
        htmlFor={variable.id} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {variable.name}
        {variable.description && (
          <span className="ml-2 text-gray-500 text-xs">
            ({variable.description})
          </span>
        )}
      </label>

      {variable.type === 'boolean' ? (
        <select
          id={variable.id}
          value={value || ''}
          onChange={(e) => onChange(variable, e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        >
          <option value="">Select...</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      ) : (
        <input
          type={variable.type === 'number' ? 'number' : 'text'}
          id={variable.id}
          value={value || ''}
          onChange={(e) => onChange(variable, e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      )}
    </div>
  );
}