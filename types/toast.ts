// types/toast.ts
/**
 * Toast System Types
 * Interfaces e tipos para o sistema de notificações toast
 */

// Tipos de toast disponíveis
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Posições possíveis para o container de toasts
export type ToastPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'top-center' 
  | 'bottom-center';

// Interface principal do toast
export interface Toast {
  readonly id: string;
  readonly type: ToastType;
  readonly title: string;
  readonly message?: string;
  readonly duration?: number; // em milissegundos, undefined = não remove automaticamente
  readonly action?: ToastAction;
  readonly dismissible?: boolean;
  readonly createdAt: number;
}

// Interface para ações customizadas no toast
export interface ToastAction {
  readonly label: string;
  readonly onClick: () => void;
  readonly variant?: 'default' | 'destructive';
}

// Props para criar um novo toast
export interface CreateToastProps {
  readonly type: ToastType;
  readonly title: string;
  readonly message?: string;
  readonly duration?: number;
  readonly dismissible?: boolean;
  readonly onDismiss?: () => void;
}

// Estado do contexto de toasts
export interface ToastState {
  readonly toasts: readonly Toast[];
  readonly maxToasts: number;
  readonly defaultDuration: number;
  readonly position: ToastPosition;
}

// Ações do reducer
export type ToastAction_Reducer = 
  | { readonly type: 'ADD_TOAST'; readonly payload: Toast }
  | { readonly type: 'REMOVE_TOAST'; readonly payload: string }
  | { readonly type: 'CLEAR_ALL_TOASTS' }
  | { readonly type: 'UPDATE_TOAST'; readonly payload: { id: string; updates: Partial<Toast> } };

// Interface do contexto
export interface ToastContextValue {
  readonly state: ToastState;
  readonly addToast: (props: CreateToastProps) => string;
  readonly removeToast: (id: string) => void;
  readonly clearAllToasts: () => void;
  readonly updateToast: (id: string, updates: Partial<Toast>) => void;
}

// Props do ToastProvider
export interface ToastProviderProps {
  readonly children: React.ReactNode;
  readonly maxToasts?: number;
  readonly defaultDuration?: number;
  readonly position?: ToastPosition;
}

// Props do componente Toast individual
export interface ToastComponentProps {
  readonly toast: Toast;
  readonly onRemove: (id: string) => void;
  readonly position: ToastPosition;
}

// Props do ToastContainer
export interface ToastContainerProps {
  readonly position?: ToastPosition;
  readonly className?: string;
}