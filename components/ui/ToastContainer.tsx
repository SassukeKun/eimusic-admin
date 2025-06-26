// components/ui/ToastContainer.tsx
'use client';

import { AnimatePresence } from 'framer-motion';
import { useToastContext } from './contexts/ToastContext';
import Toast from './Toast';
import type { ToastContainerProps, ToastPosition } from '@/types/toast';

/**
 * Classes de posicionamento para o container de toasts
 */
const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4', 
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
} as const;

/**
 * Classes de direção do flex para empilhamento correto
 */
const flexDirectionClasses = {
  'top-right': 'flex-col',
  'top-left': 'flex-col',
  'top-center': 'flex-col',
  'bottom-right': 'flex-col-reverse',
  'bottom-left': 'flex-col-reverse', 
  'bottom-center': 'flex-col-reverse',
} as const;

/**
 * Container para renderizar e posicionar todos os toasts ativos
 * Gerencia animações de entrada/saída com AnimatePresence
 */
export default function ToastContainer() {
  const { state, removeToast } = useToastContext();

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        <AnimatePresence mode="popLayout">
          {state.toasts.map((toast) => (
            <Toast
              key={toast.id}
              toast={toast}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Hook de conveniência para renderizar toasts em qualquer lugar
 * Uso: import { ToastRenderer } from '@/components/ui/ToastContainer'
 */
export function ToastRenderer() {
  return <ToastContainer />;
}