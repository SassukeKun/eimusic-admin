// contexts/ToastContext.tsx
'use client';

import { createContext, useContext, useReducer, useCallback } from 'react';
import type { 
  Toast, 
  ToastState, 
  ToastAction, 
  ToastContextValue, 
  CreateToastProps 
} from '@/types/toast';

/**
 * Configurações padrão do sistema de toast
 */
const DEFAULT_CONFIG = {
  maxToasts: 5,
  defaultDuration: 5000, // 5 segundos
  position: 'top-right',
} as const;

/**
 * Estado inicial do contexto
 */
const initialState: ToastState = {
  toasts: [],
  maxToasts: DEFAULT_CONFIG.maxToasts,
  defaultDuration: DEFAULT_CONFIG.defaultDuration,
  position: DEFAULT_CONFIG.position,
};

/**
 * Reducer para gerenciar o estado dos toasts
 * Implementa lógica imutável seguindo padrões Redux
 */
function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };
    case 'CLEAR_ALL_TOASTS':
      return {
        ...state,
        toasts: [],
      };
    case 'UPDATE_TOAST': {
      const { payload: { id, updates } } = action;
      
      return {
        ...state,
        toasts: state.toasts.map(toast =>
          toast.id === id ? { ...toast, ...updates } : toast
        ),
      };
    }
    default:
      return state;
  }
}

/**
 * Context para o sistema de toasts
 */
const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Provider do contexto de toasts
 * Gerencia estado global e auto-removal de toasts
 */
export function ToastProvider({ children }: { readonly children: React.ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  /**
   * Gerar ID único para cada toast
   */
  const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Adiciona um novo toast ao sistema
   * Retorna o ID do toast criado para referência
   */
  const addToast = useCallback((props: CreateToastProps): string => {
    const id = generateId();
    const toast: Toast = {
      ...props,
      id,
      createdAt: Date.now(),
    };

    dispatch({ type: 'ADD_TOAST', payload: toast });

    // Auto-dismiss se duration for definido
    if (props.duration !== undefined) {
      setTimeout(() => {
        removeToast(id);
      }, props.duration);
    }

    return id;
  }, []);

  /**
   * Remove um toast específico pelo ID
   */
  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  /**
   * Remove todos os toasts do sistema
   */
  const clearAllToasts = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_TOASTS' });
  }, []);

  /**
   * Atualiza um toast existente
   */
  const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
    dispatch({ type: 'UPDATE_TOAST', payload: { id, updates } });
  }, []);

  // Valor do contexto
  const contextValue: ToastContextValue = {
    state,
    addToast,
    removeToast,
    clearAllToasts,
    updateToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de toasts
 * Inclui validação para garantir uso dentro do Provider
 */
export function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  
  return context;
}

ToastProvider.displayName = 'ToastProvider';
ToastContext.displayName = 'ToastContext';