import React from 'react';
import { LayoutDashboard, GitBranch, FileSpreadsheet, Settings } from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ElementType;
  isActive?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  activeMenu?: string;
  onMenuSelect: (menuId: string) => void;
}

export default function Sidebar({ activeMenu = 'workflows', onMenuSelect }: SidebarProps) {
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      isActive: activeMenu === 'dashboard',
    },
    {
      id: 'workflows',
      title: 'Workflows',
      icon: GitBranch,
      isActive: activeMenu === 'workflows',
    },
    {
      id: 'applications',
      title: 'Applications',
      icon: FileSpreadsheet,
      isActive: activeMenu === 'applications',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      isActive: activeMenu === 'settings',
    },
  ];

  return (
    <div className="w-64 border-r bg-white">
      {/* Logo/Brand */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary-500">
          Finecision
        </h1>
        <p className="text-sm text-gray-500 mt-1">Credit Decision Platform</p>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onMenuSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.isActive
                    ? 'bg-primary-50 text-primary-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}