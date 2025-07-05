'use client';

import { useToastContext } from './contexts/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white border rounded-lg shadow-lg p-4 max-w-sm"
          onClick={() => removeToast(toast.id)}
        >
          <p className="text-sm">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
