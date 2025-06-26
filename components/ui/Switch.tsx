// components/ui/Switch.tsx
'use client';

import { useState, useCallback, useMemo, forwardRef } from 'react';
import { motion } from 'framer-motion';
import FormField, { useFieldAccessibility } from './FormField';
import type { SwitchProps } from '../../types/form';

/**
 * Animações para o switch
 */
const switchAnimations = {
  spring: {
    type: 'spring' as const,
    stiffness: 700,
    damping: 30,
    duration: 0.2
  }
};

const thumbAnimations = {
  off: { x: 2 },
  on: { x: 22 },
  transition: switchAnimations.spring
};

/**
 * Classes de estilo para diferentes tamanhos
 */
const switchSizes = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
    text: 'text-sm',
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
    text: 'text-base',
  },
  lg: {
    track: 'h-7 w-13',
    thumb: 'h-6 w-6',
    translate: 'translate-x-6',
    text: 'text-lg',
  },
};

/**
 * Componente Switch - Toggle switch moderno para estados on/off
 */
const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  // FormField props
  label,
  required = false,
  disabled = false,
  error,
  helpText,
  state = 'idle',
  layout = 'horizontal', // Switch geralmente é horizontal por padrão
  size = 'md',
  className = '',
  
  // Switch specific props
  checked,
  defaultChecked = false,
  onChange,
  children,
  thumbIcon,
  
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
  const fieldId = useMemo(() => id || `switch-${Math.random().toString(36).substr(2, 9)}`, [id]);
  
  // Props de acessibilidade
  const accessibilityProps = useFieldAccessibility(fieldId, !!error, !!helpText);
  
  // Classes de tamanho
  const sizeClasses = switchSizes[size];
  
  // Classes do track (trilha) do switch
  const trackClasses = useMemo(() => {
    const baseClasses = [
      'relative inline-flex items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
      'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
    ];
    
    if (disabled) {
      baseClasses.push('opacity-50 cursor-not-allowed');
      if (isChecked) {
        baseClasses.push('bg-gray-400');
      } else {
        baseClasses.push('bg-gray-200');
      }
    } else {
      if (isChecked) {
        if (error) {
          baseClasses.push('bg-red-600 hover:bg-red-700');
        } else {
          baseClasses.push('bg-blue-600 hover:bg-blue-700');
        }
      } else {
        baseClasses.push('bg-gray-200 hover:bg-gray-300');
      }
    }
    
    return [
      ...baseClasses,
      sizeClasses.track,
    ].join(' ');
  }, [disabled, isChecked, error, sizeClasses.track]);

  // Classes do thumb (botão deslizante)
  const thumbClasses = useMemo(() => {
    const baseClasses = [
      'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
    ];
    
    return [
      ...baseClasses,
      sizeClasses.thumb,
    ].join(' ');
  }, [sizeClasses.thumb]);

  // Handler para mudança de estado
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    onChange?.(newChecked, event);
  }, [isControlled, onChange]);

  const switchElement = (
    <div className="flex items-center">
      <div className="relative">
        {/* Hidden native input for accessibility and form submission */}
        <input
          {...rest}
          {...accessibilityProps}
          ref={ref}
          type="checkbox"
          role="switch"
          id={fieldId}
          name={name}
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          aria-checked={isChecked}
          aria-describedby={[
            error ? `${fieldId}-error` : null,
            helpText ? `${fieldId}-help` : null,
          ].filter(Boolean).join(' ') || undefined}
        />
        
        {/* Custom styled switch track */}
        <label
          htmlFor={fieldId}
          className={`${trackClasses} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {/* Switch thumb with animation */}
          <motion.span
            className={thumbClasses}
            animate={isChecked ? 'on' : 'off'}
            variants={thumbAnimations}
            transition={switchAnimations.spring}
          >
            {/* Optional thumb icon */}
            {thumbIcon && (
              <span className="flex items-center justify-center w-full h-full">
                {thumbIcon}
              </span>
            )}
          </motion.span>
        </label>
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

  // Se não há label ou helpText, renderizar apenas o switch
  if (!label && !helpText && !error) {
    return switchElement;
  }

  // Renderizar com FormField wrapper
  return (
    <FormField
      id={fieldId}
      label={undefined} // Label é renderizado como parte do switch
      required={required}
      error={error}
      helpText={helpText}
      state={state}
      layout={layout}
      size={size}
      className={className}
    >
      {switchElement}
    </FormField>
  );
});

// Display name para debugging
Switch.displayName = 'Switch';

export default Switch;