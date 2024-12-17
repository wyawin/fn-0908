import React from 'react';
import { GitBranch } from 'lucide-react';

interface FormHeaderProps {
  title: string;
}

export function FormHeader({ title }: FormHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <GitBranch className="text-primary-500" size={24} />
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    </div>
  );
}