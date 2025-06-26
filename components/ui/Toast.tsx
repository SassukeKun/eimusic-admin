// components/ui/Toast.tsx
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { Toast as ToastType } from '@/types/toast';

interface ToastProps {
  readonly toast: ToastType;
  readonly onDismiss: () => void;
}

const toastIcons = {
  success: <CheckCircle className="size-5 text-green-500" />,
  error: <AlertCircle className="size-5 text-red-500" />,
  warning: <AlertTriangle className="size-5 text-yellow-500" />,
  info: <Info className="size-5 text-blue-500" />,
};

const toastClasses = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  warning: 'bg-yellow-50 border-yellow-200',
  info: 'bg-blue-50 border-blue-200',
};

export default function Toast({ toast, onDismiss }: ToastProps) {
  // Auto-dismiss
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(onDismiss, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        relative flex items-start gap-3 p-4 rounded-lg border
        shadow-lg pointer-events-auto w-full max-w-sm
        ${toastClasses[toast.type]}
      `}
    >
      <div className="flex-shrink-0">
        {toastIcons[toast.type]}
      </div>

      <div className="flex-1 pt-0.5">
        <p className="text-sm font-medium text-gray-900">
          {toast.title}
        </p>
        {toast.message && (
          <p className="mt-1 text-sm text-gray-500">
            {toast.message}
          </p>
        )}
      </div>

      {toast.dismissible !== false && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 rounded-md p-1.5 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <span className="sr-only">Fechar</span>
          <X className="size-4" />
        </button>
      )}
    </motion.div>
  );
}