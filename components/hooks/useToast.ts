// hooks/useToast.ts
'use client';

import { useCallback } from 'react';
import { useToastContext } from '@/components/ui/contexts/ToastContext';
import type { CreateToastProps } from '@/types/toast';

/**
 * Interface para métodos de conveniência do useToast
 */
interface ToastMethods {
  readonly success: (title: string, message?: string, options?: Omit<CreateToastProps, 'type' | 'title' | 'message'>) => string;
  readonly error: (title: string, message?: string, options?: Omit<CreateToastProps, 'type' | 'title' | 'message'>) => string;
  readonly warning: (title: string, message?: string, options?: Omit<CreateToastProps, 'type' | 'title' | 'message'>) => string;
  readonly info: (title: string, message?: string, options?: Omit<CreateToastProps, 'type' | 'title' | 'message'>) => string;
  readonly loading: (title: string, message?: string) => string;
  readonly promise: <T>(
    promise: Promise<T>,
    options: {
      readonly loading: string;
      readonly success: string | ((data: T) => string);
      readonly error: string | ((error: Error) => string);
    }
  ) => Promise<T>;
}

/**
 * Interface completa do hook useToast
 */
interface UseToastReturn extends ToastMethods {
  readonly toast: (props: CreateToastProps) => string;
  readonly dismiss: (id: string) => void;
  readonly dismissAll: () => void;
  readonly toasts: readonly import('@/types/toast').Toast[];
}

/**
 * Custom hook para usar o sistema de toasts
 * Oferece métodos de conveniência e API simplificada
 */
export function useToast(): UseToastReturn {
  const { state, addToast, removeToast, clearAllToasts } = useToastContext();

  /**
   * Método base para criar toasts
   */
  const toast = useCallback((props: CreateToastProps): string => {
    return addToast(props);
  }, [addToast]);

  /**
   * Método de conveniência para toasts de sucesso
   */
  const success = useCallback((
    title: string, 
    message?: string, 
    options?: Omit<CreateToastProps, 'type' | 'title' | 'message'>
  ): string => {
    return addToast({
      type: 'success',
      title,
      message,
      ...options,
    });
  }, [addToast]);

  /**
   * Método de conveniência para toasts de erro
   */
  const error = useCallback((
    title: string, 
    message?: string, 
    options?: Omit<CreateToastProps, 'type' | 'title' | 'message'>
  ): string => {
    return addToast({
      type: 'error',
      title,
      message,
      duration: 8000, // Erros ficam mais tempo visíveis
      ...options,
    });
  }, [addToast]);

  /**
   * Método de conveniência para toasts de aviso
   */
  const warning = useCallback((
    title: string, 
    message?: string, 
    options?: Omit<CreateToastProps, 'type' | 'title' | 'message'>
  ): string => {
    return addToast({
      type: 'warning',
      title,
      message,
      duration: 7000, // Avisos ficam um pouco mais tempo
      ...options,
    });
  }, [addToast]);

  /**
   * Método de conveniência para toasts informativos
   */
  const info = useCallback((
    title: string, 
    message?: string, 
    options?: Omit<CreateToastProps, 'type' | 'title' | 'message'>
  ): string => {
    return addToast({
      type: 'info',
      title,
      message,
      ...options,
    });
  }, [addToast]);

  /**
   * Método para toasts de carregamento (sem auto-dismiss)
   */
  const loading = useCallback((title: string, message?: string): string => {
    return addToast({
      type: 'info',
      title,
      message,
      duration: undefined, // Não remove automaticamente
      dismissible: false, // Não pode ser fechado manualmente
    });
  }, [addToast]);

  /**
   * Método para lidar com promises
   * Mostra loading, depois success ou error baseado no resultado
   */
  const promise = useCallback(async <T>(
    promiseToResolve: Promise<T>,
    options: {
      readonly loading: string;
      readonly success: string | ((data: T) => string);
      readonly error: string | ((error: Error) => string);
    }
  ): Promise<T> => {
    // Mostra toast de loading
    const loadingId = loading(options.loading);

    try {
      const result = await promiseToResolve;
      
      // Remove loading toast
      removeToast(loadingId);
      
      // Mostra toast de sucesso
      const successMessage = typeof options.success === 'function' 
        ? options.success(result) 
        : options.success;
      
      success('Operação concluída', successMessage);
      
      return result;
    } catch (err) {
      // Remove loading toast
      removeToast(loadingId);
      
      // Mostra toast de erro
      const errorMessage = typeof options.error === 'function' 
        ? options.error(err as Error) 
        : options.error;
      
      error('Erro na operação', errorMessage);
      
      throw err;
    }
  }, [removeToast, loading, success, error]);

  /**
   * Método para remover um toast específico
   */
  const dismiss = useCallback((id: string) => {
    removeToast(id);
  }, [removeToast]);

  /**
   * Método para remover todos os toasts
   */
  const dismissAll = useCallback(() => {
    clearAllToasts();
  }, [clearAllToasts]);

  return {
    toast,
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss,
    dismissAll,
    toasts: state.toasts,
  };
}
