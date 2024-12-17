export interface CreditApplication {
  id: string;
  workflowId: string;
  variables: Record<string, any>;
  creditScore?: number;
  status: 'pending' | 'approved' | 'rejected' | 'review';
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}