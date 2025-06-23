/**
 * Componente UsersFilters - Sistema de filtros e busca
 * Responsabilidade única: gerenciar filtros de usuários
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import Button from '@/components/ui/Button';
import type { UserFilters, UserStatus, UserPlan, MozambicanCity } from '@/types/admin';

// Opções de filtro com tipagem correta
const STATUS_OPTIONS = [
  { value: '', label: 'Todos os Status' },
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'pending', label: 'Pendente' },
  { value: 'blocked', label: 'Bloqueado' }
] as const;

const PLAN_OPTIONS = [
  { value: '', label: 'Todos os Planos' },
  { value: 'free', label: 'Grátis' },
  { value: 'premium', label: 'Premium' },
  { value: 'vip', label: 'VIP' }
] as const;

const LOCATION_OPTIONS = [
  { value: '', label: 'Todas as Cidades' },
  { value: 'Maputo', label: 'Maputo' },
  { value: 'Beira', label: 'Beira' },
  { value: 'Nampula', label: 'Nampula' },
  { value: 'Inhambane', label: 'Inhambane' },
  { value: 'Tete', label: 'Tete' },
  { value: 'Quelimane', label: 'Quelimane' },
  { value: 'Xai-Xai', label: 'Xai-Xai' },
  { value: 'Chimoio', label: 'Chimoio' },
  { value: 'Pemba', label: 'Pemba' },
  { value: 'Lichinga', label: 'Lichinga' }
] as const;

interface UsersFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onClearFilters: () => void;
  totalUsers: number;
  filteredCount: number;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

/**
 * Type guards para validação de tipos
 */
const isValidUserStatus = (value: string): value is UserStatus => {
  return ['active', 'inactive', 'pending', 'blocked'].includes(value);
};

const isValidUserPlan = (value: string): value is UserPlan => {
  return ['free', 'premium', 'vip'].includes(value);
};

const isValidMozambicanCity = (value: string): value is MozambicanCity => {
  return ['Maputo', 'Beira', 'Nampula', 'Inhambane', 'Tete', 'Quelimane', 'Xai-Xai', 'Chimoio', 'Pemba', 'Lichinga'].includes(value);
};

/**
 * Componente de busca
 */
const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div className="relative flex-1">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search size={18} className="text-gray-400" />
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="admin-search w-full pl-10"
      placeholder="Buscar por nome, email ou telefone..."
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
      >
        <X size={16} />
      </button>
    )}
  </div>
);

/**
 * Componente de select customizado
 */
const FilterSelect: React.FC<{
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}> = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="admin-input w-full cursor-pointer"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

/**
 * Contador de filtros ativos
 */
const ActiveFiltersCount: React.FC<{
  filters: UserFilters;
}> = ({ filters }) => {
  const activeCount = [
    filters.status,
    filters.plan,
    filters.location,
    filters.searchTerm
  ].filter(Boolean).length;

  if (activeCount === 0) return null;

  return (
    <motion.span
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {activeCount} filtro{activeCount > 1 ? 's' : ''} ativo{activeCount > 1 ? 's' : ''}
    </motion.span>
  );
};

/**
 * Seção de filtros expandidos
 */
const ExpandedFilters: React.FC<{
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}> = ({ filters, onFiltersChange }) => (
  <motion.div
    className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4"
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" as const }}
  >
    <FilterSelect
      label="Status"
      value={filters.status || ''}
      options={STATUS_OPTIONS}
      onChange={(status) => {
        const validStatus = status && isValidUserStatus(status) ? status : undefined;
        onFiltersChange({ ...filters, status: validStatus });
      }}
    />

    <FilterSelect
      label="Plano"
      value={filters.plan || ''}
      options={PLAN_OPTIONS}
      onChange={(plan) => {
        const validPlan = plan && isValidUserPlan(plan) ? plan : undefined;
        onFiltersChange({ ...filters, plan: validPlan });
      }}
    />

    <FilterSelect
      label="Localização"
      value={filters.location || ''}
      options={LOCATION_OPTIONS}
      onChange={(location) => {
        const validLocation = location && isValidMozambicanCity(location) ? location : undefined;
        onFiltersChange({ ...filters, location: validLocation });
      }}
    />
  </motion.div>
);

/**
 * Componente principal UsersFilters
 */
export default function UsersFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  totalUsers,
  filteredCount,
  isRefreshing = false,
  onRefresh
}: UsersFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Handlers para mudanças nos filtros
  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm });
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const hasActiveFilters = [
    filters.status,
    filters.plan,
    filters.location,
    filters.searchTerm
  ].some(Boolean);

  return (
    <motion.div
      className="admin-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
    >
      {/* Linha principal: busca + controles */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Busca */}
        <SearchInput
          value={filters.searchTerm || ''}
          onChange={handleSearchChange}
        />

        {/* Controles */}
        <div className="flex items-center gap-3">
          {/* Botão de filtros avançados */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter size={16} />}
            onClick={toggleAdvancedFilters}
            className={clsx(
              showAdvancedFilters && 'ring-2 ring-purple-500/50',
              hasActiveFilters && 'border-purple-500/50'
            )}
          >
            Filtros
          </Button>

          {/* Botão de refresh */}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />}
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
          )}

          {/* Limpar filtros */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<X size={16} />}
              onClick={onClearFilters}
              className="text-gray-400 hover:text-white"
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Linha de informações */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-gray-400">
            Mostrando {filteredCount.toLocaleString('pt-PT')} de {totalUsers.toLocaleString('pt-PT')} usuários
          </span>
          <ActiveFiltersCount filters={filters} />
        </div>

        {filteredCount !== totalUsers && (
          <motion.span
            className="text-purple-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {Math.round((filteredCount / totalUsers) * 100)}% do total
          </motion.span>
        )}
      </div>

      {/* Filtros expandidos */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <ExpandedFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}