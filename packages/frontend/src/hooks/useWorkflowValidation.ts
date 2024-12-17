import { useState, useEffect } from 'react';
import { Workflow } from '../types/workflow';
import { validateWorkflow, ValidationError } from '../utils/workflowValidation';

export function useWorkflowValidation(workflow: Workflow) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const validationErrors = validateWorkflow(workflow);
    setErrors(validationErrors);
    setIsValid(validationErrors.filter(e => e.type === 'error').length === 0);
  }, [workflow]);

  return {
    errors,
    isValid,
    getNodeErrors: (nodeId: string) => errors.filter(e => e.nodeId === nodeId),
    getConnectionErrors: (connectionId: string) => 
      errors.filter(e => e.connectionId === connectionId)
  };
}