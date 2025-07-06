// components/admin/FilterBar.tsx
'use client';

import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'search' | 'date' | 'range';
  options?: FilterOption[];
  placeholder?: string;
}

interface FilterBarProps {
  filters: FilterConfig[];
  activeFilters?: Record<string, string>; // Tornado opcional
  searchQuery?: string;
  onFilterChange: (key: string, value: string) => void;
  onSearchChange?: (query: string) => void;
  onReset: () => void;
  className?: string;
}

/**
 * COMPONENTE FILTERBAR - Barra de filtros reutilizável
 * 
 * Funcionalidades:
 * 1. Múltiplos tipos de filtro (select, search, date, range)
 * 2. Busca global
 * 3. Reset de filtros
 * 4. Estado ativo visual
 * 5. Responsivo
 */
export default function FilterBar({
  filters,
  activeFilters = {}, // Valor padrão
  searchQuery = '',
  onFilterChange,
  onSearchChange,
  onReset,
  className = '',
}: FilterBarProps) {
  
  // Contar filtros ativos - agora com safety check
  const safeActiveFilters = activeFilters || {};
  const activeFilterCount = Object.values(safeActiveFilters).filter(value => value && value.trim() !== '').length;
  const hasActiveFilters = activeFilterCount > 0 || searchQuery.trim() !== '';

  const handleClearFilter = (key: string) => {
    onFilterChange(key, '');
  };

  const handleClearSearch = () => {
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex flex-col space-y-4">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Filtros</h3>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFilterCount}
              </span>
            )}
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Limpar tudo</span>
            </button>
          )}
        </div>

        {/* Busca Global */}
        {onSearchChange && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={handleClearSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Filtros */}
        {filters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                
                {filter.type === 'select' && (
                  <div className="relative">
                    <select
                      value={safeActiveFilters[filter.key] || ''}
                      onChange={(e) => onFilterChange(filter.key, e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    >
                      <option value="">Todos</option>
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {safeActiveFilters[filter.key] && (
                      <button
                        onClick={() => handleClearFilter(filter.key)}
                        className="absolute inset-y-0 right-8 flex items-center pr-2"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                )}

                {filter.type === 'search' && (
                  <div className="relative">
                    <input
                      type="text"
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={filter.placeholder || `Buscar ${filter.label.toLowerCase()}`}
                      value={safeActiveFilters[filter.key] || ''}
                      onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    />
                    {safeActiveFilters[filter.key] && (
                      <button
                        onClick={() => handleClearFilter(filter.key)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                )}

                {filter.type === 'date' && (
                  <div className="relative">
                    <input
                      type="date"
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={safeActiveFilters[filter.key] || ''}
                      onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    />
                    {safeActiveFilters[filter.key] && (
                      <button
                        onClick={() => handleClearFilter(filter.key)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                )}

                {filter.type === 'range' && (
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Min"
                      value={safeActiveFilters[`${filter.key}_min`] || ''}
                      onChange={(e) => onFilterChange(`${filter.key}_min`, e.target.value)}
                    />
                    <input
                      type="number"
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Max"
                      value={safeActiveFilters[`${filter.key}_max`] || ''}
                      onChange={(e) => onFilterChange(`${filter.key}_max`, e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Resumo dos filtros ativos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
            {Object.entries(safeActiveFilters)
              .filter(([, value]) => value && value.trim() !== '')
              .map(([key, value]) => {
                const filter = filters.find(f => f.key === key);
                const displayValue = filter?.type === 'select' 
                  ? filter.options?.find(opt => opt.value === value)?.label || value
                  : value;
                
                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <span className="mr-1">{filter?.label}:</span>
                    <span className="font-normal">{displayValue}</span>
                    <button
                      onClick={() => handleClearFilter(key)}
                      className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            
            {searchQuery && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="mr-1">Busca:</span>
                <span className="font-normal">&quot;{searchQuery}&quot;</span>
                <button
                  onClick={handleClearSearch}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}