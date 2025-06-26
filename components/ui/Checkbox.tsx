// components/ui/Checkbox.tsx
'use client';

import { useState, useCallback, useMemo, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import FormField, { useFieldAccessibility } from './FormField';
import type { CheckboxProps } from '../../types/form';

/**
 * Animações para o checkbox
 */
const checkboxAnimations = {
  checked: {
    scale: [0.8, 1.1, 1],
    transition: { duration: 0.2, ease: 'easeOut' as const }
  },
  unchecked: {
    scale: 1,
    transition: { duration: 0.15, ease: 'easeOut' as const }
  }
};

const iconAnimations = {
  checked: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, ease: 'easeOut' as const }
  },
  unchecked: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.1, ease: 'easeOut' as const }
  }
};

/**
 * Classes de estilo para diferentes tamanhos
 */
const checkboxSizes = {
  sm: {
    container: 'h-4 w-4',
    icon: 'size-3',
    text: 'text-sm',
  },
  md: {
    container: 'h-5 w-5',
    icon: 'size-3.5',
    text: 'text-base',
  },
  lg: {
    container: 'h-6 w-6',
    icon: 'size-4',
    text: 'text-lg',
  },
};

/**
 * Componente Checkbox - Checkbox tradicional com estados checked, unchecked e indeterminate
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  // FormField props
  label,
  required = false,
  disabled = false,
  error,
  helpText,
  state = 'idle',
  layout = 'horizontal', // Checkbox geralmente é horizontal por padrão
  size = 'md',
  className = '',
  
  // Checkbox specific props
  checked,
  defaultChecked = false,
  indeterminate = false,
  onChange,
  children,
  
  // HTML props
  id,
  name,
  ...rest
}, ref) => {
  
  // Estado local para modo uncontrolled
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  
  // Determinar se é controlled ou uncontrolled
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;
  
  // ID único para o campo
  const fieldId = useMemo(() => id || `checkbox-${Math.random().toString(36).substr(2, 9)}`, [id]);
  
  // Props de acessibilidade
  const accessibilityProps = useFieldAccessibility(fieldId, !!error, !!helpText);
  
  // Classes de tamanho
  const sizeClasses = checkboxSizes[size];
  
  // Classes do container do checkbox
  const checkboxClasses = useMemo(() => {
    const baseClasses = [
      'relative inline-flex items-center justify-center rounded border-2 transition-all duration-200',
      'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
    ];
    
    if (disabled) {
      baseClasses.push('opacity-50 cursor-not-allowed bg-gray-100 border-gray-300');
    } else if (isChecked || indeterminate) {
      baseClasses.push('bg-blue-600 border-blue-600 text-white');
    } else {
      baseClasses.push('bg-white border-gray-300 hover:border-blue-400');
    }
    
    if (error) {
      baseClasses.push('border-red-300 focus-within:ring-red-500');
    }
    
    return [
      ...baseClasses,
      sizeClasses.container,
    ].join(' ');
  }, [disabled, isChecked, indeterminate, error, sizeClasses.container]);

  // Handler para mudança de estado
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    onChange?.(newChecked, event);
  }, [isControlled, onChange]);

  // Renderizar ícone baseado no estado
  const renderIcon = () => {
    if (indeterminate) {
      return (
        <motion.div
          key="indeterminate"
          variants={iconAnimations}
          initial="unchecked"
          animate="checked"
          exit="unchecked"
        >
          <Minus className={`${sizeClasses.icon} text-white`} />
        </motion.div>
      );
    }
    
    if (isChecked) {
      return (
        <motion.div
          key="checked"
          variants={iconAnimations}
          initial="unchecked"
          animate="checked"
          exit="unchecked"
        >
          <Check className={`${sizeClasses.icon} text-white`} />
        </motion.div>
      );
    }
    
    return null;
  };

  const checkboxElement = (
    <div className="flex items-center">
      <div className="relative">
        {/* Hidden native input for accessibility and form submission */}
        <input
          {...rest}
          {...accessibilityProps}
          ref={ref}
          type="checkbox"
          id={fieldId}
          name={name}
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          aria-describedby={[
            error ? `${fieldId}-error` : null,
            helpText ? `${fieldId}-help` : null,
          ].filter(Boolean).join(' ') || undefined}
        />
        
        {/* Custom styled checkbox */}
        <motion.div
          className={checkboxClasses}
          variants={checkboxAnimations}
          animate={isChecked || indeterminate ? 'checked' : 'unchecked'}
          whileTap={disabled ? {} : { scale: 0.95 }}
        >
          {renderIcon()}
        </motion.div>
      </div>
      
      {/* Label content */}
      {(children || label) && (
        <label
          htmlFor={fieldId}
          className={`ml-3 ${sizeClasses.text} ${
            disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 cursor-pointer'
          }`}
        >
          {children || label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="obrigatório">
              *
            </span>
          )}
        </label>
      )}
    </div>
  );

  // Se não há label ou helpText, renderizar apenas o checkbox
  if (!label && !helpText && !error) {
    return checkboxElement;
  }

  // Renderizar com FormField wrapper
  return (
    <FormField
      id={fieldId}
      label={undefined} // Label é renderizado como parte do checkbox
      required={required}
      error={error}
      helpText={helpText}
      state={state}
      layout={layout}
      size={size}
      className={className}
    >
      {checkboxElement}
    </FormField>
  );
});

// Display name para debugging
Checkbox.displayName = 'Checkbox';

export default Checkbox;