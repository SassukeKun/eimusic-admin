/**
 * Hook para gerenciar estatísticas e dados do painel administrativo
 * Simula requisições para APIs com dados mock moçambicanos
 */

import { useState, useEffect, useCallback } from 'react';
import type { 
  DashboardStats, 
  RecentActivity, 
  TimeSeriesData, 
  LocationAnalytics, 
  GenreAnalytics,
  ChartData 
} from '@/types/admin';
import { 
  DASHBOARD_STATS,
  RECENT_ACTIVITIES,
  TIME_SERIES_DATA,
  LOCATION_ANALYTICS,
  GENRE_ANALYTICS,
  generateChartData
} from '@/data/mockStats';

// Interface do hook
interface UseAdminStatsReturn {
  // Estados de dados
  dashboardStats: DashboardStats | null;
  recentActivities: RecentActivity[];
  timeSeriesData: TimeSeriesData[];
  locationAnalytics: LocationAnalytics[];
  genreAnalytics: GenreAnalytics[];
  
  // Estados de loading
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // Funções utilitárias
  refreshStats: () => Promise<void>;
  getChartData: (type: 'users' | 'revenue' | 'genres') => ChartData[];
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number) => string;
  formatPercentage: (num: number) => string;
}

// Simulação de delay de API
const simulateApiDelay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Hook principal para estatísticas do admin
 * Simula carregamento de dados e fornece funções utilitárias
 */
export function useAdminStats(): UseAdminStatsReturn {
  // Estados principais
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [locationAnalytics, setLocationAnalytics] = useState<LocationAnalytics[]>([]);
  const [genreAnalytics, setGenreAnalytics] = useState<GenreAnalytics[]>([]);
  
  // Estados de loading
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar dados iniciais
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simular carregamento da API
      await simulateApiDelay(1200);
      
      // Carregar todos os dados mock
      setDashboardStats(DASHBOARD_STATS);
      setRecentActivities(RECENT_ACTIVITIES);
      setTimeSeriesData(TIME_SERIES_DATA);
      setLocationAnalytics(LOCATION_ANALYTICS);
      setGenreAnalytics(GENRE_ANALYTICS);
      
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Erro loading admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função para atualizar dados (refresh)
  const refreshStats = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      // Simular refresh mais rápido
      await simulateApiDelay(600);
      
      // Simular pequenas mudanças nos dados
      const updatedStats = {
        ...DASHBOARD_STATS,
        activeUsersToday: DASHBOARD_STATS.activeUsersToday + Math.floor(Math.random() * 10),
        pendingApprovals: Math.max(0, DASHBOARD_STATS.pendingApprovals + Math.floor(Math.random() * 3 - 1))
      };
      
      setDashboardStats(updatedStats);
      
      // Atualizar atividades recentes (simular novas atividades)
      const newActivities = RECENT_ACTIVITIES.slice(0, 15); // Manter só as 15 mais recentes
      setRecentActivities(newActivities);
      
    } catch (err) {
      setError('Erro ao atualizar dados');
      console.error('Erro refreshing stats:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Função para obter dados de gráficos
  const getChartData = useCallback((type: 'users' | 'revenue' | 'genres'): ChartData[] => {
    return generateChartData(type);
  }, []);

  // Função para formatar moeda moçambicana (Meticais)
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  // Função para formatar números grandes
  const formatNumber = useCallback((num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }, []);

  // Função para formatar percentagem
  const formatPercentage = useCallback((num: number): string => {
    return `${num.toFixed(1)}%`;
  }, []);

  // Carregar dados na montagem do componente
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Auto-refresh a cada 5 minutos (opcional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && !isRefreshing) {
        refreshStats();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [isLoading, isRefreshing, refreshStats]);

  return {
    // Estados de dados
    dashboardStats,
    recentActivities,
    timeSeriesData,
    locationAnalytics,
    genreAnalytics,
    
    // Estados de loading
    isLoading,
    isRefreshing,
    error,
    
    // Funções utilitárias
    refreshStats,
    getChartData,
    formatCurrency,
    formatNumber,
    formatPercentage
  };
}