/**
 * Componente Button reutilizável para o EiMusic Admin
 * Suporta diferentes variantes e tamanhos seguindo o design system
 */

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

// Interface para as props do Button (excluindo props conflitantes)
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
  name?: string;
  value?: string;
  tabIndex?: number;
  'aria-label'?: string;
  'aria-describedby'?: string;
  title?: string;
}

/**
 * Componente Button com animações e variantes do design system
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  type = 'button',
  ...restProps
}: ButtonProps) {
  // Classes base do button
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'relative overflow-hidden'
  ].join(' ');

  // Classes por variante
  const variantClasses = {
    primary: [
      'bg-gradient-to-r from-purple-600 to-pink-600',
      'hover:from-purple-700 hover:to-pink-700',
      'text-white shadow-lg shadow-purple-500/25',
      'focus:ring-purple-500'
    ].join(' '),
    
    secondary: [
      'bg-gray-700/50 hover:bg-gray-600/50',
      'text-gray-300 hover:text-white',
      'border border-gray-600 hover:border-gray-500',
      'focus:ring-gray-500'
    ].join(' '),
    
    danger: [
      'bg-gradient-to-r from-red-600 to-red-700',
      'hover:from-red-700 hover:to-red-800',
      'text-white shadow-lg shadow-red-500/25',
      'focus:ring-red-500'
    ].join(' '),
    
    success: [
      'bg-gradient-to-r from-green-600 to-emerald-600',
      'hover:from-green-700 hover:to-emerald-700',
      'text-white shadow-lg shadow-green-500/25',
      'focus:ring-green-500'
    ].join(' '),
    
    outline: [
      'bg-transparent hover:bg-purple-600/10',
      'text-purple-400 hover:text-purple-300',
      'border border-purple-500/50 hover:border-purple-500',
      'focus:ring-purple-500'
    ].join(' ')
  };

  // Classes por tamanho
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };

  // Animação de hover
  const hoverAnimation = {
    whileHover: { 
      scale: 1.02,
      y: -1
    },
    whileTap: { 
      scale: 0.98 
    }
  };

  return (
    <motion.button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      type={type}
      {...hoverAnimation}
      {...restProps}
    >
      {/* Efeito de shimmer para loading */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear'
          }}
        />
      )}
      
      {/* Ícone esquerdo */}
      {leftIcon && !isLoading && (
        <span className="flex-shrink-0">
          {leftIcon}
        </span>
      )}
      
      {/* Loading spinner */}
      {isLoading && (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: 'linear'
          }}
        />
      )}
      
      {/* Conteúdo do botão */}
      <span className={clsx(
        'relative z-10',
        isLoading && 'opacity-70'
      )}>
        {children}
      </span>
      
      {/* Ícone direito */}
      {rightIcon && !isLoading && (
        <span className="flex-shrink-0">
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
}