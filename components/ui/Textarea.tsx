// components/ui/Textarea.tsx
'use client';

import { useState, useRef, useEffect, useCallback, useMemo, forwardRef } from 'react';
import FormField, { useFieldAccessibility } from './FormField';
import type { TextareaProps } from '../../types/form';

/**
 * Classes de estilo para diferentes variantes e tamanhos
 */
const textareaVariants = {
  default: 'border border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500',
  filled: 'border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500',
  outlined: 'border-2 border-gray-300 bg-transparent focus:border-blue-500',
};

const textareaSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-base', 
  lg: 'px-4 py-3 text-lg',
};

const resizeModes = {
  none: 'resize-none',
  both: 'resize',
  horizontal: 'resize-x',
  vertical: 'resize-y',
};

/**
 * Componente Textarea - Campo de texto longo com auto-resize e character counter
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  // FormField props
  label,
  required = false,
  disabled = false,
  readOnly = false,
  error,
  helpText,
  state = 'idle',
  layout = 'vertical',
  size = 'md',
  variant = 'default',
  className = '',
  
  // Textarea specific props
  value,
  defaultValue,
  placeholder,
  rows = 3,
  cols,
  maxLength,
  minLength,
  resize = 'vertical',
  autoResize = false,
  onChange,
  onBlur,
  onFocus,
  
  // HTML props
  id,
  name,
  ...rest
}, ref) => {
  
  // Estados locais
  const [currentLength, setCurrentLength] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  
  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const internalRef = ref || textareaRef;
  
  // ID único para o campo
  const fieldId = useMemo(() => id || `textarea-${Math.random().toString(36).substr(2, 9)}`, [id]);
  
  // Props de acessibilidade
  const accessibilityProps = useFieldAccessibility(fieldId, !!error, !!helpText);
  
  // Calcular comprimento atual do texto
  const textValue = value || defaultValue || '';
  
  useEffect(() => {
    setCurrentLength(String(textValue).length);
  }, [textValue]);
  
  // Auto-resize functionality
  const adjustHeight = useCallback(() => {
    if (autoResize && internalRef && 'current' in internalRef && internalRef.current) {
      const textarea = internalRef.current;
      // Reset height to recalculate
      textarea.style.height = 'auto';
      // Set height based on scroll height
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [autoResize, internalRef]);
  
  // Adjust height on content change
  useEffect(() => {
    adjustHeight();
  }, [textValue, adjustHeight]);
  
  // Classes do textarea
  const textareaClasses = useMemo(() => {
    const baseClasses = [
      'w-full rounded-md transition-colors duration-200',
      'placeholder:text-gray-400',
      'focus:outline-none focus:ring-1',
      'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
      'read-only:bg-gray-50 read-only:cursor-default',
    ];
    
    const variantClasses = textareaVariants[variant];
    const sizeClasses = textareaSizes[size];
    const resizeClasses = autoResize ? 'resize-none overflow-hidden' : resizeModes[resize];
    
    // Estado de erro
    if (error) {
      baseClasses.push('border-red-300 focus:border-red-500 focus:ring-red-500');
    }
    
    return [
      ...baseClasses,
      variantClasses,
      sizeClasses,
      resizeClasses,
      className,
    ].join(' ');
  }, [variant, size, resize, autoResize, error, className]);

  // Character counter state
  const characterCounterState = useMemo(() => {
    if (!maxLength) return null;
    
    const percentage = (currentLength / maxLength) * 100;
    
    if (percentage >= 100) {
      return 'error';
    } else if (percentage >= 80) {
      return 'warning';
    }
    return 'normal';
  }, [currentLength, maxLength]);

  // Character counter classes
  const counterClasses = useMemo(() => {
    const baseClasses = 'text-xs mt-1';
    
    switch (characterCounterState) {
      case 'error':
        return `${baseClasses} text-red-600 font-medium`;
      case 'warning':
        return `${baseClasses} text-yellow-600`;
      default:
        return `${baseClasses} text-gray-500`;
    }
  }, [characterCounterState]);

  // Handlers
  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    
    // Enforce maxLength if set
    if (maxLength && newValue.length > maxLength) {
      return; // Don't allow input beyond maxLength
    }
    
    setCurrentLength(newValue.length);
    onChange?.(newValue, event);
    
    // Auto-resize after content change
    if (autoResize) {
      // Small delay to ensure DOM is updated
      setTimeout(adjustHeight, 0);
    }
  }, [onChange, maxLength, autoResize, adjustHeight]);

  const handleFocus = useCallback((event: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  }, [onFocus]);

  const handleBlur = useCallback((event: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  }, [onBlur]);

  // Handle key events for auto-resize
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (autoResize && (event.key === 'Enter' || event.key === 'Backspace' || event.key === 'Delete')) {
      // Adjust height after key processing
      setTimeout(adjustHeight, 0);
    }
  }, [autoResize, adjustHeight]);

  // Validation state
  const isInvalid = useMemo(() => {
    if (error) return true;
    if (minLength && currentLength < minLength && currentLength > 0) return true;
    if (maxLength && currentLength > maxLength) return true;
    return false;
  }, [error, minLength, maxLength, currentLength]);

  return (
    <FormField
      id={fieldId}
      label={label}
      required={required}
      error={error}
      helpText={helpText}
      state={state}
      layout={layout}
      size={size}
      className={className}
    >
      <div className="relative">
        {/* Textarea element */}
        <textarea
          {...rest}
          {...accessibilityProps}
          ref={internalRef}
          name={name}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={autoResize ? undefined : rows}
          cols={cols}
          maxLength={maxLength}
          minLength={minLength}
          disabled={disabled}
          readOnly={readOnly}
          className={textareaClasses}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          aria-invalid={isInvalid}
          aria-describedby={[
            error ? `${fieldId}-error` : null,
            helpText ? `${fieldId}-help` : null,
            maxLength ? `${fieldId}-counter` : null,
          ].filter(Boolean).join(' ') || undefined}
        />

        {/* Character counter */}
        {maxLength && (
          <div 
            id={`${fieldId}-counter`}
            className={counterClasses}
            aria-live="polite"
          >
            <span>
              {currentLength}/{maxLength}
            </span>
            {characterCounterState === 'warning' && (
              <span className="ml-1">⚠️</span>
            )}
            {characterCounterState === 'error' && (
              <span className="ml-1">❌</span>
            )}
          </div>
        )}

        {/* Minimum length indicator (when focused and below minimum) */}
        {minLength && isFocused && currentLength < minLength && currentLength > 0 && (
          <div className="text-xs mt-1 text-gray-500">
            Mínimo {minLength} caracteres (faltam {minLength - currentLength})
          </div>
        )}
      </div>
    </FormField>
  );
});

// Display name para debugging
Textarea.displayName = 'Textarea';

export default Textarea;