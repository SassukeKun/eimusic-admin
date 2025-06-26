// components/ui/Input.tsx
'use client';

import { useState, useCallback, useMemo, forwardRef } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import FormField, { useFieldAccessibility } from './FormField';
import type { InputProps } from '../../types/form';

/**
 * Classes de estilo para diferentes variantes e tamanhos
 */
const inputVariants = {
  default: 'border border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500',
  filled: 'border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500',
  outlined: 'border-2 border-gray-300 bg-transparent focus:border-blue-500',
};

const inputSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

/**
 * Componente Input - Campo de texto com suporte a ícones e estados
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
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
  
  // Input specific props
  type = 'text',
  value,
  defaultValue,
  placeholder,
  maxLength,
  minLength,
  pattern,
  autoComplete,
  autoFocus = false,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  leftIcon,
  rightIcon,
  clearable = false,
  
  // HTML props
  id,
  name,
  ...rest
}, ref) => {
  
  // Estado local para tipo de password
  const [showPassword, setShowPassword] = useState(false);
  
  // ID único para o campo
  const fieldId = useMemo(() => id || `input-${Math.random().toString(36).substr(2, 9)}`, [id]);
  
  // Props de acessibilidade
  const accessibilityProps = useFieldAccessibility(fieldId, !!error, !!helpText);
  
  // Determinar o tipo atual do input (para toggle de password)
  const currentType = type === 'password' && showPassword ? 'text' : type;
  
  // Classes do input
  const inputClasses = useMemo(() => {
    const baseClasses = [
      'w-full rounded-md transition-colors duration-200',
      'placeholder:text-gray-400',
      'focus:outline-none focus:ring-1',
      'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
      'read-only:bg-gray-50 read-only:cursor-default',
    ];
    
    const variantClasses = inputVariants[variant];
    const sizeClasses = inputSizes[size];
    
    // Ajustar padding para ícones
    const paddingClasses = [];
    if (leftIcon) paddingClasses.push('pl-10');
    if (rightIcon || clearable || type === 'password') paddingClasses.push('pr-10');
    
    // Estado de erro
    if (error) {
      baseClasses.push('border-red-300 focus:border-red-500 focus:ring-red-500');
    }
    
    return [
      ...baseClasses,
      variantClasses,
      sizeClasses,
      ...paddingClasses,
      className,
    ].join(' ');
  }, [variant, size, leftIcon, rightIcon, clearable, type, error, className]);

  // Handlers
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value, event);
  }, [onChange]);

  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(event);
  }, [onFocus]);

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);
  }, [onBlur]);

  const handleClear = useCallback(() => {
    if (onChange) {
      const syntheticEvent = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange('', syntheticEvent);
    }
  }, [onChange]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Determinar se deve mostrar o botão de limpar
  const showClearButton = clearable && value && value.length > 0 && !disabled && !readOnly;
  
  // Determinar se deve mostrar o toggle de password
  const showPasswordToggle = type === 'password' && !disabled && !readOnly;

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
        {/* Ícone esquerdo */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <div className="text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}

        {/* Campo de input */}
        <input
          {...rest}
          {...accessibilityProps}
          ref={ref}
          name={name}
          type={currentType}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          disabled={disabled}
          readOnly={readOnly}
          className={inputClasses}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
        />

        {/* Ícones direitos */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          {/* Botão de limpar */}
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
              aria-label="Limpar campo"
            >
              <X className="size-4" />
            </button>
          )}

          {/* Toggle de password */}
          {showPasswordToggle && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          )}

          {/* Ícone direito customizado */}
          {rightIcon && !showClearButton && !showPasswordToggle && (
            <div className="text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
    </FormField>
  );
});

// Display name para debugging
Input.displayName = 'Input';

export default Input;