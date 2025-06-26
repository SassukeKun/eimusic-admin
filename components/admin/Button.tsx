// components/admin/Button.tsx
'use client';

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  ...props
}, ref) => {
  // Mapeamento de variantes para classes
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus-visible:outline-primary',
    secondary: 'bg-white text-foreground border border-border hover:bg-gray-50 focus-visible:outline-primary',
    danger: 'bg-danger text-white hover:bg-danger/90 focus-visible:outline-danger',
    outline: 'bg-transparent text-foreground border border-border hover:bg-gray-50 focus-visible:outline-primary',
    ghost: 'bg-transparent text-foreground hover:bg-gray-100 focus-visible:outline-primary',
  };

  // Mapeamento de tamanhos para classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      ref={ref}
      type="button"
      disabled={isLoading || disabled}
      className={`
        inline-flex items-center justify-center rounded-md font-medium 
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        transition-colors duration-200
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isLoading || disabled ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="size-4 mr-2 animate-spin" />
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      
      {children}
      
      {!isLoading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;