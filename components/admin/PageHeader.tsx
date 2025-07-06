// components/admin/PageHeader.tsx
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  backButton?: {
    href: string;
    label: string;
  };
  actions?: React.ReactNode;
  action?: React.ReactNode; // Alias para actions (compatibilidade)
}

export default function PageHeader({ 
  title, 
  description, 
  backButton, 
  actions,
  action, // Compatibilidade
}: PageHeaderProps) {
  // Use actions ou action (para compatibilidade)
  const headerActions = actions || action;
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          {backButton && (
            <div className="mb-2">
              <Link 
                href={backButton.href} 
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                {backButton.label}
              </Link>
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {headerActions && (
          <div className="flex items-center space-x-3">
            {headerActions}
          </div>
        )}
      </div>
    </div>
  );
}