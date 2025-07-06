// components/ui/SearchBar.tsx
'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
  disabled = false,
  size = 'md',
}: SearchBarProps) {
  
  // Classes de tamanho
  const sizeClasses = {
    sm: 'h-8 text-sm pl-8 pr-8',
    md: 'h-10 text-sm pl-10 pr-10',
    lg: 'h-12 text-base pl-12 pr-12',
  };

  // Classes de ícone
  const iconSizeClasses = {
    sm: 'h-4 w-4 left-2',
    md: 'h-5 w-5 left-3',
    lg: 'h-6 w-6 left-3',
  };

  // Classes do botão clear
  const clearButtonClasses = {
    sm: 'right-2',
    md: 'right-3',
    lg: 'right-3',
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Ícone de busca */}
      <div className={`absolute inset-y-0 ${iconSizeClasses[size]} flex items-center pointer-events-none`}>
        <Search className={`${iconSizeClasses[size].split(' ')[0]} ${iconSizeClasses[size].split(' ')[1]} text-gray-400`} />
      </div>

      {/* Input de busca */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          block w-full ${sizeClasses[size]}
          border border-gray-300 rounded-lg
          bg-white text-gray-900 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          transition-colors duration-200
        `}
        aria-label="Campo de busca"
      />

      {/* Botão para limpar */}
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className={`
            absolute inset-y-0 ${clearButtonClasses[size]}
            flex items-center justify-center
            text-gray-400 hover:text-gray-600
            focus:outline-none focus:text-gray-600
            transition-colors duration-200
          `}
          aria-label="Limpar busca"
        >
          <X className={`${iconSizeClasses[size].split(' ')[0]} ${iconSizeClasses[size].split(' ')[1]}`} />
        </button>
      )}
    </div>
  );
}