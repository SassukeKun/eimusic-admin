// components/ui/FormField.tsx
'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  type LucideIcon 
} from 'lucide-react';
import type { FormFieldProps, FieldState } from '../../types/form';

/**
 * Mapeamento de ícones por estado
 */
const stateIconMap: Record<FieldState, LucideIcon | null> = {
  idle: null,
  loading: Loader2,
  error: AlertCircle,
  success: CheckCircle2,
  disabled: null,
};

/**
 * Classes de estilo por estado
 */
const stateStyles = {
  idle: {
    label: 'text-gray-700',
    border: 'border-gray-300',
    background: 'bg-white',
    text: 'text-gray-900',
  },
  loading: {
    label: 'text-blue-600',
    border: 'border-blue-300',
    background: 'bg-blue-50',
    text: 'text-blue-900',
  },
  error: {
    label: 'text-red-600',
    border: 'border-red-300',
    background: 'bg-red-50',
    text: 'text-red-900',
  },
  success: {
    label: 'text-green-600',
    border: 'border-green-300',
    background: 'bg-green-50',
    text: 'text-green-900',
  },
  disabled: {
    label: 'text-gray-400',
    border: 'border-gray-200',
    background: 'bg-gray-50',
    text: 'text-gray-400',
  },
} as const;

/**
 * Animações para mensagens de erro
 */
const errorAnimation = {
  initial: { opacity: 0, y: -10, height: 0 },
  animate: { opacity: 1, y: 0, height: 'auto' },
  exit: { opacity: 0, y: -10, height: 0 },
  transition: { duration: 0.2, ease: 'easeOut' as const },
};

/**
 * Componente FormField - Wrapper base para todos os campos de formulário
 * Gerencia label, estados visuais, mensagens de erro e acessibilidade
 */
export default function FormField({
  children,
  id,
  label,
  required = false,
  error,
  helpText,
  state = 'idle',
  layout = 'vertical',
  size = 'md',
  labelPosition = 'top',
  showAsterisk = true,
  errorIcon = true,
  successIcon = false,
  className = '',
}: FormFieldProps) {
  
  // Gerar IDs únicos se não fornecidos
  const fieldId = useMemo(() => id || `field-${Math.random().toString(36).substr(2, 9)}`, [id]);
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;

  // Determinar estado atual baseado na presença de erro
  const currentState: FieldState = error ? 'error' : state;
  const styles = stateStyles[currentState];
  
  // Ícone do estado atual
  const StateIcon = stateIconMap[currentState];
  const showStateIcon = StateIcon && ((currentState === 'error' && errorIcon) || (currentState === 'success' && successIcon) || currentState === 'loading');

  // Classes de tamanho
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size];

  // Layout classes
  const layoutClasses = {
    vertical: 'flex flex-col space-y-1.5',
    horizontal: 'flex items-center space-x-4',
  }[layout];

  // Classes do label baseadas na posição
  const labelClasses = {
    top: `block text-sm font-medium ${styles.label} mb-1`,
    left: `text-sm font-medium ${styles.label} min-w-0 flex-shrink-0`,
    hidden: 'sr-only',
  }[labelPosition];

  return (
    <div className={`${layoutClasses} ${className}`}>
      {/* Label */}
      {label && labelPosition !== 'hidden' && (
        <label 
          htmlFor={fieldId}
          className={`${labelClasses} ${sizeClasses}`}
        >
          {label}
          {required && showAsterisk && (
            <span className="text-red-500 ml-1" aria-label="obrigatório">
              *
            </span>
          )}
        </label>
      )}

      {/* Campo principal com container para ícone de estado */}
      <div className="relative">
        {/* Children (campo de input propriamente dito) */}
        <div className="relative">
          {children}
          
          {/* Ícone de estado */}
          {showStateIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {currentState === 'loading' ? (
                <Loader2 
                  className="size-4 text-blue-500 animate-spin" 
                  aria-hidden="true"
                />
              ) : (
                StateIcon && (
                  <StateIcon 
                    className={`size-4 ${
                      currentState === 'error' ? 'text-red-500' : 'text-green-500'
                    }`}
                    aria-hidden="true"
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* Mensagem de erro com animação */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={errorAnimation.initial}
              animate={errorAnimation.animate}
              exit={errorAnimation.exit}
              transition={errorAnimation.transition}
              className="overflow-hidden"
            >
              <p
                id={errorId}
                className="mt-1 text-sm text-red-600 flex items-start"
                role="alert"
                aria-live="polite"
              >
                {errorIcon && (
                  <AlertCircle className="size-4 mt-0.5 mr-1.5 flex-shrink-0" aria-hidden="true" />
                )}
                <span>{error}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Texto de ajuda */}
        {helpText && !error && (
          <p
            id={helpId}
            className="mt-1 text-sm text-gray-500"
          >
            {helpText}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Hook para construir props de acessibilidade para campos
 */
export function useFieldAccessibility(
  fieldId: string,
  hasError?: boolean,
  hasHelp?: boolean
) {
  return useMemo(() => ({
    id: fieldId,
    'aria-invalid': hasError ? ('true' as const) : ('false' as const),
    'aria-describedby': [
      hasError ? `${fieldId}-error` : null,
      hasHelp ? `${fieldId}-help` : null,
    ].filter(Boolean).join(' ') || undefined,
  }), [fieldId, hasError, hasHelp]);
}