import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { useToast } from '@/components/hooks/useToast';
import type { Artist } from '@/types/admin';
import type { ArtistFormData } from '@/types/modal';

interface UseArtistsOptions {
  initialLoad?: boolean;
}

/**
 * Hook para gerenciar artistas
 */
export function useArtists(options: UseArtistsOptions = {}) {
  const { initialLoad = true } = options;
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const api = useApi<Artist | Artist[]>();
  const toast = useToast();

  /**
   * Carrega a lista de artistas
   */
  const loadArtists = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Construir URL com filtros
      const params = new URLSearchParams();
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      
      const url = `/api/artists${params.toString() ? `?${params.toString()}` : ''}`;
      
      const data = await api.get(url);
      setArtists(Array.isArray(data) ? data : []);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      toast.error('Erro ao carregar artistas');
    } finally {
      setIsLoading(false);
    }
  }, [api, filters, searchQuery, toast]);

  /**
   * Carrega um artista pelo ID
   */
  const getArtist = useCallback(async (id: string): Promise<Artist | null> => {
    try {
      const data = await api.get(`/api/artists/${id}`);
      return data as Artist;
    } catch (error) {
      toast.error('Erro ao carregar artista');
      return null;
    }
  }, [api, toast]);

  /**
   * Cria um novo artista
   */
  const createArtist = useCallback(async (formData: ArtistFormData): Promise<Artist | null> => {
    try {
      // Mapear dados do formulário para o formato da API
      const artistData = {
        name: formData.name,
        email: formData.email,
        genre: formData.genre,
        verified: formData.verified,
        status: formData.isActive ? 'active' : 'inactive',
        monetizationPlan: formData.monetizationPlan,
        paymentMethod: formData.paymentMethod,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio,
      };
      
      const data = await api.post('/api/artists', artistData);
      
      // Atualizar lista de artistas
      setArtists(prev => [...prev, data as Artist]);
      
      toast.success('Artista criado com sucesso');
      return data as Artist;
    } catch (error) {
      toast.error('Erro ao criar artista');
      return null;
    }
  }, [api, toast]);

  /**
   * Atualiza um artista existente
   */
  const updateArtist = useCallback(async (id: string, formData: ArtistFormData): Promise<Artist | null> => {
    try {
      // Mapear dados do formulário para o formato da API
      const artistData = {
        name: formData.name,
        email: formData.email,
        genre: formData.genre,
        verified: formData.verified,
        status: formData.isActive ? 'active' : 'inactive',
        monetizationPlan: formData.monetizationPlan,
        paymentMethod: formData.paymentMethod,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio,
      };
      
      const data = await api.patch(`/api/artists/${id}`, artistData);
      
      // Atualizar lista de artistas
      setArtists(prev => 
        prev.map(artist => 
          artist.id === id ? data as Artist : artist
        )
      );
      
      toast.success('Artista atualizado com sucesso');
      return data as Artist;
    } catch (error) {
      toast.error('Erro ao atualizar artista');
      return null;
    }
  }, [api, toast]);

  /**
   * Exclui um artista
   */
  const deleteArtist = useCallback(async (id: string): Promise<boolean> => {
    try {
      await api.remove(`/api/artists/${id}`);
      
      // Atualizar lista de artistas
      setArtists(prev => prev.filter(artist => artist.id !== id));
      
      toast.success('Artista excluído com sucesso');
      return true;
    } catch (error) {
      toast.error('Erro ao excluir artista');
      return false;
    }
  }, [api, toast]);

  /**
   * Atualiza os filtros
   */
  const updateFilters = useCallback((newFilters: Record<string, string>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Reseta os filtros
   */
  const resetFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  /**
   * Atualiza a pesquisa
   */
  const updateSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Carregar artistas ao montar o componente ou quando os filtros mudarem
  useEffect(() => {
    if (initialLoad) {
      loadArtists();
    }
  }, [loadArtists, initialLoad, filters, searchQuery]);

  return {
    artists,
    isLoading,
    error,
    filters,
    searchQuery,
    loadArtists,
    getArtist,
    createArtist,
    updateArtist,
    deleteArtist,
    updateFilters,
    resetFilters,
    updateSearch,
  };
} 