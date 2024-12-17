import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Calendar, GitBranch, Edit2, Link2 } from 'lucide-react';
import { Workflow } from '../types/workflow';
import { workflowService } from '../services/workflow.service';
import toast from 'react-hot-toast';

interface WorkflowListProps {
  onSelect: (workflow: Workflow) => void;
  onNew: () => void;
}

export function WorkflowList({ onSelect, onNew }: WorkflowListProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const data = await workflowService.findAll();
      setWorkflows(data);
    } catch (error) {
      toast.error('Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    
    try {
      await workflowService.delete(id);
      toast.success('Workflow deleted successfully');
      loadWorkflows();
    } catch (error) {
      toast.error('Failed to delete workflow');
    }
  };

  const handleEdit = (workflow: Workflow, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(workflow);
  };

  const handleCopyFormLink = (workflow: Workflow, e: React.MouseEvent) => {
    e.stopPropagation();
    const formUrl = `${window.location.origin}/form/${workflow.id}`;
    navigator.clipboard.writeText(formUrl);
    toast.success('Form link copied to clipboard');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Workflows</h2>
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus size={16} />
            New Workflow
          </button>
        </div>
      </div>

      <div className="p-4">
        {workflows.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <GitBranch size={48} className="mx-auto text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first workflow</p>
            <button
              onClick={onNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus size={16} />
              Create Workflow
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nodes
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Connections
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workflows.map((workflow) => (
                  <tr
                    key={workflow.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {workflow.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {workflow.nodes.length} nodes
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {workflow.connections.length} connections
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar size={14} />
                        {formatDate(workflow.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => handleCopyFormLink(workflow, e)}
                          className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded-full transition-colors"
                          title="Copy form link"
                        >
                          <Link2 size={16} />
                        </button>
                        <button
                          onClick={(e) => handleEdit(workflow, e)}
                          className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded-full transition-colors"
                          title="Edit workflow"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(workflow.id, e)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete workflow"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}