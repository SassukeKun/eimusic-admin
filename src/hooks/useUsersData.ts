/**
 * Hook para gerenciar dados de usuários do sistema administrativo
 * Responsabilidade: lógica de negócio para usuários
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { AdminUser, UserFilters } from '@/types/admin';
import { MOCK_USERS, USER_STATISTICS, filterUsers } from '@/data/mockUsers';

/**
 * Interface para o retorno do hook
 */
interface UseUsersDataReturn {
  // Dados
  users: AdminUser[];
  filteredUsers: AdminUser[];
  statistics: typeof USER_STATISTICS;
  
  // Estados
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // Filtros
  filters: UserFilters;
  setFilters: (filters: UserFilters) => void;
  clearFilters: () => void;
  
  // Ações
  refreshUsers: () => Promise<void>;
  updateUser: (userId: string, updates: Partial<AdminUser>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  
  // Utilitários
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  exportUsers: () => void;
}

/**
 * Filtros padrão
 */
const DEFAULT_FILTERS: UserFilters = {
  status: undefined,
  plan: undefined,
  location: undefined,
  searchTerm: '',
  dateFrom: undefined,
  dateTo: undefined
};

/**
 * Simular delay de API
 */
const simulateApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Hook principal para gerenciar usuários
 */
export function useUsersData(): UseUsersDataReturn {
  // Estados principais
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [statistics, setStatistics] = useState(USER_STATISTICS);
  const [filters, setFilters] = useState<UserFilters>(DEFAULT_FILTERS);
  
  // Estados de loading
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carregar dados iniciais
   */
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular carregamento da API
      await simulateApiDelay(800);
      
      setUsers(MOCK_USERS);
      setStatistics(USER_STATISTICS);
      
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error('Error loading users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Atualizar dados (refresh)
   */
  const refreshUsers = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      // Simular refresh mais rápido
      await simulateApiDelay(400);
      
      // Em um cenário real, buscaria dados atualizados da API
      // Por agora, simulamos pequenas mudanças
      const updatedUsers = [...MOCK_USERS];
      
      // Simular pequenas mudanças aleatórias
      const randomIndex = Math.floor(Math.random() * updatedUsers.length);
      if (updatedUsers[randomIndex]) {
        updatedUsers[randomIndex] = {
          ...updatedUsers[randomIndex],
          lastActivity: new Date().toISOString()
        };
      }
      
      setUsers(updatedUsers);
      
    } catch (err) {
      setError('Erro ao atualizar usuários');
      console.error('Error refreshing users:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  /**
   * Atualizar usuário específico
   */
  const updateUser = useCallback(async (userId: string, updates: Partial<AdminUser>) => {
    try {
      setError(null);
      
      // Simular chamada da API
      await simulateApiDelay(300);
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, ...updates } : user
        )
      );
      
      console.log(`Usuário ${userId} atualizado:`, updates);
      
    } catch (err) {
      setError('Erro ao atualizar usuário');
      console.error('Error updating user:', err);
    }
  }, []);

  /**
   * Deletar usuário
   */
  const deleteUser = useCallback(async (userId: string) => {
    try {
      setError(null);
      
      // Simular chamada da API
      await simulateApiDelay(300);
      
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      console.log(`Usuário ${userId} removido`);
      
    } catch (err) {
      setError('Erro ao remover usuário');
      console.error('Error deleting user:', err);
    }
  }, []);

  /**
   * Limpar filtros
   */
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  /**
   * Usuários filtrados (memoizado para performance)
   */
  const filteredUsers = useMemo(() => {
    return filterUsers(users, {
      searchTerm: filters.searchTerm,
      status: filters.status,
      plan: filters.plan,
      location: filters.location
    });
  }, [users, filters]);

  /**
   * Formatador de moeda moçambicana
   */
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  /**
   * Formatador de data
   */
  const formatDate = useCallback((dateString: string): string => {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  }, []);

  /**
   * Exportar usuários para CSV
   */
  const exportUsers = useCallback(() => {
    try {
      const headers = [
        'ID', 'Nome', 'Email', 'Telefone', 'Plano', 'Status', 
        'Localização', 'Total Gasto', 'Data Registro', 'Última Atividade'
      ];
      
      const csvContent = [
        headers.join(','),
        ...filteredUsers.map(user => [
          user.id,
          `"${user.name}"`,
          user.email,
          `"${user.phone}"`,
          user.plan,
          user.status,
          user.location,
          user.totalSpent,
          user.registeredAt.split('T')[0],
          user.lastActivity.split('T')[0]
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `eimusic_usuarios_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      console.log('Usuários exportados com sucesso');
      
    } catch (err) {
      setError('Erro ao exportar usuários');
      console.error('Error exporting users:', err);
    }
  }, [filteredUsers]);

  /**
   * Carregar dados ao montar o componente
   */
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  /**
   * Retorno do hook
   */
  return {
    // Dados
    users,
    filteredUsers,
    statistics,
    
    // Estados
    isLoading,
    isRefreshing,
    error,
    
    // Filtros
    filters,
    setFilters,
    clearFilters,
    
    // Ações
    refreshUsers,
    updateUser,
    deleteUser,
    
    // Utilitários
    formatCurrency,
    formatDate,
    exportUsers
  };
}