// components/admin/FilterBar.tsx
'use client';

import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FilterConfig } from '@/types/admin';

interface FilterBarProps {
  filters: FilterConfig[];
  onFilterChange: (filterKey: string, value: string) => void;
  onSearchChange: (query: string) => void;
  onReset: () => void;
}

export default function FilterBar({
  filters,
  onFilterChange,
  onSearchChange,
  onReset,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Manipulador de pesquisa
  const handleSearch = () => {
    onSearchChange(searchQuery);
  };

  // Manipulador de tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="card mb-6 animate-fade-in">
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Barra de pesquisa */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="size-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-white 
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 
                           focus:border-primary text-sm"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Botões de filtro */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="size-4 mr-2" />
              Filtros
              {showFilters ? (
                <ChevronUp className="size-4 ml-2" />
              ) : (
                <ChevronDown className="size-4 ml-2" />
              )}
            </button>
            
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onReset}
            >
              <X className="size-4 mr-2" />
              Limpar
            </button>
            
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSearch}
            >
              Pesquisar
            </button>
          </div>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-border overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filters.map((filter) => (
                  <div key={filter.key} className="space-y-1">
                    <label
                      htmlFor={filter.key}
                      className="block text-sm font-medium text-foreground"
                    >
                      {filter.label}
                    </label>
                    
                    {filter.type === 'select' && filter.options && (
                      <select
                        id={filter.key}
                        className="block w-full pl-3 pr-10 py-2 text-sm border-border rounded-md
                                 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                 bg-white text-foreground"
                        onChange={(e) => onFilterChange(filter.key, e.target.value)}
                      >
                        <option value="">Todos</option>
                        {filter.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {filter.type === 'date' && (
                      <input
                        type="date"
                        id={filter.key}
                        className="block w-full px-3 py-2 text-sm border-border rounded-md
                                 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                 bg-white text-foreground"
                        onChange={(e) => onFilterChange(filter.key, e.target.value)}
                      />
                    )}
                    
                    {filter.type === 'range' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          id={`${filter.key}-min`}
                          placeholder="Min"
                          className="block w-full px-3 py-2 text-sm border-border rounded-md
                                   focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                   bg-white text-foreground"
                          onChange={(e) => onFilterChange(`${filter.key}-min`, e.target.value)}
                        />
                        <span className="text-muted">-</span>
                        <input
                          type="number"
                          id={`${filter.key}-max`}
                          placeholder="Max"
                          className="block w-full px-3 py-2 text-sm border-border rounded-md
                                   focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                   bg-white text-foreground"
                          onChange={(e) => onFilterChange(`${filter.key}-max`, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}