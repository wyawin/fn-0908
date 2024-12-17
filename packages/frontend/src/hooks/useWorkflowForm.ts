import { useState, useEffect } from 'react';
import { Workflow } from '../types/workflow';
import { WorkflowVariable } from '../types/variables';
import { workflowService } from '../services/workflow.service';
import { applicationService } from '../services/application.service';
import { calculateVariableValues } from '../utils/variableCalculation';
import { calculateWorkflowCreditScore } from '../utils/creditScore';
import toast from 'react-hot-toast';

export function useWorkflowForm(workflowId: string | undefined) {
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (workflowId) {
      loadWorkflow(workflowId);
    }
  }, [workflowId]);

  const loadWorkflow = async (id: string) => {
    try {
      setLoading(true);
      const data = await workflowService.findOne(id);
      setWorkflow(data);
    } catch (error) {
      toast.error('Failed to load workflow');
    } finally {
      setLoading(false);
    }
  };

  const getTriggerVariables = (): WorkflowVariable[] => {
    const triggerNode = workflow?.nodes.find(node => node.type === 'trigger');
    return triggerNode?.data.variables?.filter(v => v.type !== 'calculated') || [];
  };

  const getAllVariables = (): WorkflowVariable[] => {
    const triggerNode = workflow?.nodes.find(node => node.type === 'trigger');
    return triggerNode?.data.variables || [];
  };

  const handleInputChange = (variable: WorkflowVariable, value: string) => {
    setFormData(prev => ({
      ...prev,
      [variable.id]: variable.type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflow?.id) return;

    try {
      setSubmitting(true);
      
      // Get all variables including calculated ones
      const allVariables = getAllVariables();
      
      // Calculate values for calculated variables
      const calculatedValues = calculateVariableValues(allVariables, formData);

      // Calculate credit score if workflow has a credit score node
      const creditScore = workflow ? calculateWorkflowCreditScore(workflow, formData) : null;
      
      // Combine input values with calculated values
      const allValues = {
        ...formData,
        ...calculatedValues,
        creditScore
      };

      await applicationService.create(workflow.id, allValues);
      toast.success('Application submitted successfully');
      setFormData({});
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    workflow,
    loading,
    formData,
    submitting,
    getTriggerVariables,
    handleInputChange,
    handleSubmit
  };
}