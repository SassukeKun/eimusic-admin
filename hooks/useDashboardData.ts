// hooks/useDashboardData.ts
'use client';

import { useState, useCallback, useRef } from 'react';
import type { DashboardStats } from '@/types/admin';

/**
 * Interface para dados do dashboard consolidados
 */
interface DashboardData {
  stats: DashboardStats | null;
  recentArtists: RecentArtist[];
  topTracks: TopTrack[];
}

interface RecentArtist {
  id: string;
  name: string;
  genre: string;
  image: string;
  joinedDate: string;
}

interface TopTrack {
  id: string;
  title: string;
  artist: string;
  plays: number;
  revenue: number;
}

/**
 * Hook customizado SEM useApi - fetch nativo
 * 
 * CORREÇÃO PRINCIPAL:
 * - Remove dependência do hook useApi problemático
 * - Usa fetch nativo com AbortController
 * - useCallback com array vazio = função estável
 * - Sem setState em loops infinitos
 */
export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    recentArtists: [],
    topTracks: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref para controlar requests em andamento
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Função estável para fazer fetch dos dados REAIS
   * SOLUÇÃO: fetch nativo em vez de useApi problemático
   */
  const fetchDashboardData = useCallback(async (): Promise<void> => {
    // Cancelar request anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    setIsLoading(true);
    setError(null);

    try {
      // Fazer todas as requisições em paralelo com fetch nativo
      const [statsResponse, artistsResponse, tracksResponse] = await Promise.all([
        fetch('/api/dashboard/stats', { 
          signal,
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('/api/dashboard/recent-artists?limit=5', { 
          signal,
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('/api/dashboard/top-tracks?limit=5', { 
          signal,
          headers: { 'Content-Type': 'application/json' }
        })
      ]);

      // Verificar se todas as respostas são válidas
      if (!statsResponse.ok) {
        throw new Error(`Erro ao carregar estatísticas: ${statsResponse.status}`);
      }
      if (!artistsResponse.ok) {
        throw new Error(`Erro ao carregar artistas: ${artistsResponse.status}`);
      }
      if (!tracksResponse.ok) {
        throw new Error(`Erro ao carregar faixas: ${tracksResponse.status}`);
      }

      // Converter respostas para JSON
      const [statsData, artistsData, tracksData] = await Promise.all([
        statsResponse.json() as Promise<DashboardStats>,
        artistsResponse.json() as Promise<RecentArtist[]>,
        tracksResponse.json() as Promise<TopTrack[]>
      ]);

      // Validar tipos de dados (TypeScript safety)
      if (!statsData || typeof statsData !== 'object') {
        throw new Error('Dados de estatísticas inválidos');
      }

      // Atualizar estado com todos os dados REAIS
      // IMPORTANTE: Uma única chamada setState evita loops
      setData({
        stats: statsData,
        recentArtists: Array.isArray(artistsData) ? artistsData : [],
        topTracks: Array.isArray(tracksData) ? tracksData : []
      });

    } catch (error) {
      // Não mostrar erro se foi cancelado (AbortError)
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      // Log do erro para debugging
      console.error('Erro ao carregar dados do dashboard:', error);
      
      // Definir mensagem de erro user-friendly
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro desconhecido ao carregar dados';
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []); // Array vazio = função NUNCA muda de referência

  /**
   * Função para retry manual
   */
  const retry = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /**
   * Função para limpar erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchDashboardData,
    retry,
    clearError
  } as const;
}