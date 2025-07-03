import { useState, useCallback } from 'react';

interface ApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook para fazer requisições à API
 */
export function useApi<T = unknown>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  /**
   * Faz uma requisição GET
   */
  const get = useCallback(async (url: string, options?: ApiOptions<T>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setState({ data, isLoading: false, error: null });
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState(prev => ({ ...prev, isLoading: false, error: errorObj }));
      options?.onError?.(errorObj);
      throw errorObj;
    }
  }, []);

  /**
   * Faz uma requisição POST
   */
  const post = useCallback(async (url: string, body: unknown, options?: ApiOptions<T>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setState({ data, isLoading: false, error: null });
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState(prev => ({ ...prev, isLoading: false, error: errorObj }));
      options?.onError?.(errorObj);
      throw errorObj;
    }
  }, []);

  /**
   * Faz uma requisição PATCH
   */
  const patch = useCallback(async (url: string, body: unknown, options?: ApiOptions<T>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setState({ data, isLoading: false, error: null });
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState(prev => ({ ...prev, isLoading: false, error: errorObj }));
      options?.onError?.(errorObj);
      throw errorObj;
    }
  }, []);

  /**
   * Faz uma requisição DELETE
   */
  const remove = useCallback(async (url: string, options?: ApiOptions<T>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setState({ data, isLoading: false, error: null });
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState(prev => ({ ...prev, isLoading: false, error: errorObj }));
      options?.onError?.(errorObj);
      throw errorObj;
    }
  }, []);

  /**
   * Reseta o estado
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    get,
    post,
    patch,
    remove,
    reset,
  };
} 