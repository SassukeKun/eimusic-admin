// components/admin/Button.tsx
'use client';

import React from 'react';
// import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  onClick,
}: ButtonProps) {
  
  // Classes base do botão
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ];

  // Variantes de cor
  const variantClasses = {
    primary: [
      'bg-blue-600',
      'text-white',
      'hover:bg-blue-700',
      'focus:ring-blue-500',
      'shadow-sm',
    ],
    secondary: [
      'bg-gray-600',
      'text-white',
      'hover:bg-gray-700',
      'focus:ring-gray-500',
      'shadow-sm',
    ],
    outline: [
      'bg-white',
      'text-gray-700',
      'border',
      'border-gray-300',
      'hover:bg-gray-50',
      'focus:ring-blue-500',
      'shadow-sm',
    ],
    danger: [
      'bg-red-600',
      'text-white',
      'hover:bg-red-700',
      'focus:ring-red-500',
      'shadow-sm',
    ],
    ghost: [
      'bg-transparent',
      'text-gray-700',
      'hover:bg-gray-100',
      'focus:ring-gray-500',
    ],
    link: [
      'bg-transparent',
      'text-blue-600',
      'hover:text-blue-700',
      'hover:underline',
      'focus:ring-blue-500',
      'p-0',
    ],
  };

  // Tamanhos
  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm'],
    md: ['px-4', 'py-2', 'text-sm'],
    lg: ['px-6', 'py-3', 'text-base'],
  };

  // Combinar todas as classes
  const buttonClasses = [
    ...baseClasses,
    ...variantClasses[variant],
    ...(variant !== 'link' ? sizeClasses[size] : []),
    className,
  ].join(' ');

  // Determinar espaçamento dos ícones
  const iconSpacing = size === 'sm' ? 'space-x-1.5' : size === 'lg' ? 'space-x-2.5' : 'space-x-2';

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          <span>Carregando...</span>
        </div>
      ) : (
        <div className={`flex items-center ${iconSpacing}`}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </div>
      )}
    </button>
  );
}