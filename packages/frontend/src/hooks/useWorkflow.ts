import { useState, useCallback } from 'react';
import { Workflow } from '../types/workflow';
import { workflowService } from '../services/workflow.service';
import toast from 'react-hot-toast';

export function useWorkflow(initialWorkflow?: Workflow) {
  const [workflow, setWorkflow] = useState<Workflow | undefined>(initialWorkflow);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveWorkflow = useCallback(async (workflowData: Workflow) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create a clean copy of the workflow data without any non-serializable values
      const cleanWorkflow = JSON.parse(JSON.stringify({
        ...workflowData,
        nodes: workflowData.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            config: node.data.config ? JSON.parse(JSON.stringify(node.data.config)) : {}
          }
        }))
      }));
      
      let savedWorkflow: Workflow;
      if (cleanWorkflow.id) {
        savedWorkflow = await workflowService.update(cleanWorkflow.id, cleanWorkflow);
        toast.success('Workflow updated successfully');
      } else {
        const { id, ...newWorkflow } = cleanWorkflow;
        savedWorkflow = await workflowService.create(newWorkflow);
        toast.success('Workflow created successfully');
      }
      
      setWorkflow(savedWorkflow);
      return savedWorkflow;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save workflow';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWorkflow = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const loadedWorkflow = await workflowService.findOne(id);
      setWorkflow(loadedWorkflow);
      return loadedWorkflow;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load workflow';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    workflow,
    loading,
    error,
    saveWorkflow,
    loadWorkflow,
    setWorkflow
  };
}