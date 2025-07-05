import { useState, useCallback, useEffect } from 'react';
import { useApi } from './useApi';
import { useToast } from '@/components/hooks/useToast';
import type { Artist } from '@/types/admin';
import type { ArtistFormData } from '@/types/modal';

interface UseArtistsOptions {
  autoFetch?: boolean;
  initialFilters?: Record<string, string>;
}

/**
 * Hook para gerenciar artistas
 */
export function useArtists(options: UseArtistsOptions = {}) {
  const { autoFetch = true, initialFilters = {} } = options;
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const api = useApi<Artist | Artist[]>();
  const toast = useToast();

  /**
   * Busca todos os artistas com filtros aplicados
   */
  const fetchArtists = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Construir URL com parâmetros de consulta
      const url = new URL('/api/artists', window.location.origin);
      
      // Adicionar filtros à URL
      Object.entries(filters).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
      
      // Adicionar termo de busca se houver
      if (searchQuery) {
        url.searchParams.append('search', searchQuery);
      }
      
      // Fazer a requisição
      const data = await api.get(url.toString());
      setArtists(data as Artist[]);
      return data as Artist[];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao buscar artistas');
      setError(error);
      toast.error('Falha ao carregar artistas');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [api, filters, searchQuery, toast]);

  /**
   * Busca um artista pelo ID
   */
  const fetchArtistById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.get(`/api/artists/${id}`);
      setSelectedArtist(data as Artist);
      return data as Artist;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Erro ao buscar artista ${id}`);
      setError(error);
      toast.error('Falha ao carregar detalhes do artista');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api, toast]);

  /**
   * Cria um novo artista
   */
  const createArtist = useCallback(async (formData: ArtistFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.post('/api/artists', formData);
      toast.success('Artista criado com sucesso');
      
      // Atualizar a lista de artistas
      await fetchArtists();
      
      return data as Artist;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao criar artista');
      setError(error);
      toast.error('Falha ao criar artista');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api, fetchArtists, toast]);

  /**
   * Atualiza um artista existente
   */
  const updateArtist = useCallback(async (id: string, formData: ArtistFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.patch(`/api/artists/${id}`, formData);
      toast.success('Artista atualizado com sucesso');
      
      // Atualizar a lista de artistas
      await fetchArtists();
      
      // Atualizar o artista selecionado se for o mesmo
      if (selectedArtist?.id === id) {
        setSelectedArtist(data as Artist);
      }
      
      return data as Artist;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Erro ao atualizar artista ${id}`);
      setError(error);
      toast.error('Falha ao atualizar artista');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [api, fetchArtists, selectedArtist, toast]);

  /**
   * Exclui um artista
   */
  const deleteArtist = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.remove(`/api/artists/${id}`);
      toast.success('Artista excluído com sucesso');
      
      // Atualizar a lista de artistas
      await fetchArtists();
      
      // Limpar o artista selecionado se for o mesmo
      if (selectedArtist?.id === id) {
        setSelectedArtist(null);
      }
      
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Erro ao excluir artista ${id}`);
      setError(error);
      toast.error('Falha ao excluir artista');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [api, fetchArtists, selectedArtist, toast]);

  /**
   * Atualiza os filtros
   */
  const updateFilters = useCallback((newFilters: Record<string, string>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Limpa os filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  // Carregar artistas automaticamente se autoFetch for true
  useEffect(() => {
    if (autoFetch) {
      fetchArtists();
    }
  }, [autoFetch, fetchArtists]);

  return {
    artists,
    selectedArtist,
    isLoading,
    error,
    filters,
    searchQuery,
    setSearchQuery,
    fetchArtists,
    fetchArtistById,
    createArtist,
    updateArtist,
    deleteArtist,
    updateFilters,
    clearFilters,
  };
} 