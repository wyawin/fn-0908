import { NodeType } from '../types/workflow';
import { CreditCard, AlertCircle, CheckCircle2, Calculator, GaugeCircle } from 'lucide-react';

export const NODE_TYPE_CONFIG = {
  trigger: {
    type: 'trigger' as NodeType,
    title: 'Credit Application',
    description: 'Start when a new credit application is received',
    icon: CreditCard,
    color: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
    defaultConfig: {}
  },
  'credit-score': {
    type: 'credit-score' as NodeType,
    title: 'Credit Score',
    description: 'Calculate credit score based on variables',
    icon: Calculator,
    color: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
    defaultConfig: {
      maxScore: 850,
      variables: []
    }
  },
  'credit-score-check': {
    type: 'credit-score-check' as NodeType,
    title: 'Credit Score Check',
    description: 'Evaluate credit score threshold',
    icon: GaugeCircle,
    color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700',
    defaultConfig: {
      operator: 'greater_than_equal',
      threshold: 0
    }
  },
  condition: {
    type: 'condition' as NodeType,
    title: 'Conditional Check',
    description: 'Add branching logic',
    icon: AlertCircle,
    color: 'bg-orange-50 hover:bg-orange-100 text-orange-700',
    defaultConfig: {}
  },
  action: {
    type: 'action' as NodeType,
    title: 'Decision',
    description: 'Make credit decision',
    icon: CheckCircle2,
    color: 'bg-green-50 hover:bg-green-100 text-green-700',
    defaultConfig: {}
  }
} as const;