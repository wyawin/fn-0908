import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { WorkflowList } from './components/WorkflowList';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { WorkflowForm } from './components/WorkflowForm';
import { Save } from 'lucide-react';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useWorkflow } from './hooks/useWorkflow';
import { Toaster } from 'react-hot-toast';
import { Workflow } from './types/workflow';
import { Navbar } from './components/Navbar';
import { WorkflowNameModal } from './components/modals/WorkflowNameModal';

const initialWorkflow = {
  id: '',
  name: 'New Credit Decision Workflow',
  nodes: [
    {
      id: 'node-1',
      type: 'trigger',
      position: { x: 100, y: 100 },
      data: {
        title: 'New Application',
        description: 'Triggers when a new credit application is received',
        config: {}
      }
    }
  ],
  connections: []
};

function App() {
  const { handleDragStart } = useDragAndDrop();
  const { workflow, saveWorkflow, loading, error, setWorkflow } = useWorkflow();
  const [showWorkflowList, setShowWorkflowList] = useState(true);
  const [activeMenu, setActiveMenu] = useState('workflows');
  const [showNameModal, setShowNameModal] = useState(false);

  const handleSave = async () => {
    if (workflow) {
      setShowNameModal(true);
    }
  };

  const handleSaveWithName = async (name: string) => {
    if (workflow) {
      try {
        await saveWorkflow({ ...workflow, name });
        setShowNameModal(false);
      } catch (err) {
        console.error('Failed to save workflow:', err);
      }
    }
  };

  const handleSelectWorkflow = (selectedWorkflow: Workflow) => {
    setWorkflow(selectedWorkflow);
    setShowWorkflowList(false);
  };

  const handleNewWorkflow = () => {
    setWorkflow(initialWorkflow);
    setShowWorkflowList(false);
  };

  const handleMenuSelect = (menuId: string) => {
    setActiveMenu(menuId);
    if (menuId === 'workflows') {
      setShowWorkflowList(true);
    }
  };

  const getPageTitle = () => {
    switch (activeMenu) {
      case 'workflows':
        return 'Workflows';
      case 'applications':
        return 'Applications';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const renderRightContent = () => {
    if (!showWorkflowList && workflow && activeMenu === 'workflows') {
      return (
        <button 
          className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          onClick={handleSave}
          disabled={loading}
        >
          <Save size={20} />
          {loading ? 'Saving...' : 'Save Workflow'}
        </button>
      );
    }
    return null;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/form/:id" element={<WorkflowForm />} />
        <Route path="*" element={
          <div className="h-screen flex flex-col">
            <Navbar 
              title={getPageTitle()}
              showBackButton={!showWorkflowList && activeMenu === 'workflows'}
              onBack={() => setShowWorkflowList(true)}
              rightContent={renderRightContent()}
            />

            {error && (
              <div className="px-6 py-2 text-sm text-red-600 bg-red-50">
                {error}
              </div>
            )}

            <div className="flex-1 flex overflow-hidden">
              <Sidebar activeMenu={activeMenu} onMenuSelect={handleMenuSelect} />
              
              {activeMenu === 'workflows' && (
                showWorkflowList ? (
                  <WorkflowList onSelect={handleSelectWorkflow} onNew={handleNewWorkflow} />
                ) : workflow ? (
                  <WorkflowCanvas 
                    workflow={workflow}
                    onUpdateWorkflow={setWorkflow}
                  />
                ) : null
              )}
              
              {activeMenu === 'applications' && (
                <div className="flex-1 p-6">
                  <p className="text-gray-500">Applications view coming soon...</p>
                </div>
              )}
              
              {activeMenu === 'settings' && (
                <div className="flex-1 p-6">
                  <p className="text-gray-500">Settings view coming soon...</p>
                </div>
              )}
              
              {activeMenu === 'dashboard' && (
                <div className="flex-1 p-6">
                  <p className="text-gray-500">Dashboard view coming soon...</p>
                </div>
              )}
            </div>
          </div>
        } />
      </Routes>

      {showNameModal && workflow && (
        <WorkflowNameModal
          initialName={workflow.name}
          onSave={handleSaveWithName}
          onClose={() => setShowNameModal(false)}
        />
      )}

      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;