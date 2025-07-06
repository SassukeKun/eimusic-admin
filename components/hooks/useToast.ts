// hooks/useToast.ts - HOOK SIMPLES SEM DEPENDÊNCIAS EXTERNAS
'use client';

import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

const toastState: ToastState = { toasts: [] };
let listeners: Array<(state: ToastState) => void> = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener(toastState));
};

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast: Toast = {
    id,
    duration: 5000,
    ...toast,
  };
  
  toastState.toasts.push(newToast);
  notifyListeners();
  
  // Auto remove after duration
  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);
  }
  
  return id;
};

const removeToast = (id: string) => {
  toastState.toasts = toastState.toasts.filter(toast => toast.id !== id);
  notifyListeners();
};

const clearAllToasts = () => {
  toastState.toasts = [];
  notifyListeners();
};

/**
 * HOOK SIMPLES DE TOAST - SEM CONTEXTO COMPLEXO
 * 
 * Funcionalidades:
 * 1. Success, error, warning, info
 * 2. Auto-dismiss configurável
 * 3. Remoção manual
 * 4. Estado global simples
 * 5. Zero dependências externas
 */
export function useToast() {
  const [, forceUpdate] = useState({});
  
  // Subscribe to toast state changes
  const subscribe = useCallback((listener: (state: ToastState) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  // Force re-render when toasts change
  const rerender = useCallback(() => {
    forceUpdate({});
  }, []);
  
  // Subscribe to changes
  useState(() => {
    const unsubscribe = subscribe(rerender);
    return unsubscribe;
  });
  
  const success = useCallback((title: string, description?: string) => {
    return addToast({ type: 'success', title, description });
  }, []);
  
  const error = useCallback((title: string, description?: string) => {
    return addToast({ type: 'error', title, description });
  }, []);
  
  const warning = useCallback((title: string, description?: string) => {
    return addToast({ type: 'warning', title, description });
  }, []);
  
  const info = useCallback((title: string, description?: string) => {
    return addToast({ type: 'info', title, description });
  }, []);
  
  const dismiss = useCallback((id: string) => {
    removeToast(id);
  }, []);
  
  const dismissAll = useCallback(() => {
    clearAllToasts();
  }, []);
  
  return {
    toasts: toastState.toasts,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };
}