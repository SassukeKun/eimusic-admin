// components/ui/ToastContainer.tsx - CONTAINER SIMPLES PARA TOASTS
'use client';

import React from 'react';
import { useToast, type Toast } from '@/components/hooks/useToast';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

/**
 * COMPONENTE DE TOAST INDIVIDUAL
 */
function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          containerClass: 'bg-green-50 border-green-200',
          iconClass: 'text-green-400',
          titleClass: 'text-green-800',
          descClass: 'text-green-700',
          icon: CheckCircle,
        };
      case 'error':
        return {
          containerClass: 'bg-red-50 border-red-200',
          iconClass: 'text-red-400',
          titleClass: 'text-red-800',
          descClass: 'text-red-700',
          icon: XCircle,
        };
      case 'warning':
        return {
          containerClass: 'bg-yellow-50 border-yellow-200',
          iconClass: 'text-yellow-400',
          titleClass: 'text-yellow-800',
          descClass: 'text-yellow-700',
          icon: AlertTriangle,
        };
      case 'info':
      default:
        return {
          containerClass: 'bg-blue-50 border-blue-200',
          iconClass: 'text-blue-400',
          titleClass: 'text-blue-800',
          descClass: 'text-blue-700',
          icon: Info,
        };
    }
  };

  const styles = getToastStyles();
  const Icon = styles.icon;

  return (
    <div
      className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 border ${styles.containerClass} transition-all duration-300 transform translate-x-0 opacity-100`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${styles.iconClass}`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${styles.titleClass}`}>
              {toast.title}
            </p>
            {toast.description && (
              <p className={`mt-1 text-sm ${styles.descClass}`}>
                {toast.description}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`rounded-md inline-flex ${styles.titleClass} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600`}
              onClick={() => onDismiss(toast.id)}
            >
              <span className="sr-only">Fechar</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * CONTAINER DE TOASTS - POSICIONAMENTO FIXO
 */
export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={dismiss}
          />
        ))}
      </div>
    </div>
  );
}