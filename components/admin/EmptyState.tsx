// components/admin/EmptyState.tsx
import { Inbox } from 'lucide-react';
import Button from '@/components/admin/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  } | React.ReactNode; // Suporta tanto objeto quanto ReactNode
}

export default function EmptyState({ 
  title, 
  description, 
  icon = <Inbox className="h-12 w-12 text-gray-400" />,
  action 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
      <div className="flex justify-center">
        {icon}
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && (
        <div className="mt-6">
          {/* Se action é um objeto com label e onClick */}
          {typeof action === 'object' && 'label' in action && 'onClick' in action ? (
            <Button onClick={action.onClick} variant="primary" size="sm">
              {action.label}
            </Button>
          ) : (
            /* Se action é um ReactNode, renderiza diretamente */
            action
          )}
        </div>
      )}
    </div>
  );
}