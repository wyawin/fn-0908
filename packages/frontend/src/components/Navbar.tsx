import React from 'react';
import { GitBranch } from 'lucide-react';

interface NavbarProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

export function Navbar({ title, showBackButton, onBack, rightContent }: NavbarProps) {
  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GitBranch size={24} className="text-primary-500" />
            <h1 className="text-xl font-bold text-primary-500">Finecision</h1>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {showBackButton && (
              <button
                onClick={onBack}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
            )}
          </div>
        </div>
        {rightContent && (
          <div>{rightContent}</div>
        )}
      </div>
    </header>
  );
}