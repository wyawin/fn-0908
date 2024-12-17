import React from 'react';
import { GitBranch } from 'lucide-react';

export function NotFoundState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <GitBranch size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Workflow Not Found</h2>
        <p className="text-gray-500">The requested workflow does not exist or has been deleted.</p>
      </div>
    </div>
  );
}