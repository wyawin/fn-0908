import React from 'react';
import { useParams } from 'react-router-dom';
import { useWorkflowForm } from '../hooks/useWorkflowForm';
import { FormHeader } from './form/FormHeader';
import { FormField } from './form/FormField';
import { LoadingState } from './form/LoadingState';
import { NotFoundState } from './form/NotFoundState';

export function WorkflowForm() {
  const { id } = useParams<{ id: string }>();
  const {
    workflow,
    loading,
    formData,
    submitting,
    getTriggerVariables,
    handleInputChange,
    handleSubmit
  } = useWorkflowForm(id);

  if (loading) return <LoadingState />;
  if (!workflow) return <NotFoundState />;

  const variables = getTriggerVariables();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <FormHeader title={workflow.name} />

          <form onSubmit={handleSubmit} className="space-y-6">
            {variables.map(variable => (
              <FormField
                key={variable.id}
                variable={variable}
                value={formData[variable.id]}
                onChange={handleInputChange}
              />
            ))}

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}