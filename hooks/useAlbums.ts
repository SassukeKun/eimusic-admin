import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { useToast } from '@/components/hooks/useToast';
import type { Album } from '@/types/admin';
import type { AlbumFormData } from '@/types/modal';

interface UseAlbumsOptions {
  initialLoad?: boolean;
  artistId?: string;
}

/**
 * Hook para gerenciar álbuns
 */
export function useAlbums(options: UseAlbumsOptions = {}) {
  const { initialLoad = true, artistId } = options;
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>(
    artistId ? { artist_id: artistId } : {}
  );
  const [searchQuery, setSearchQuery] = useState('');
  const { get: apiGet, remove: apiRemove } = useApi<Album | Album[]>();
  const toast = useToast();

  /**
   * Carrega a lista de álbuns
   */
  const loadAlbums = useCallback(async () => {
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
      
      const url = `/api/albums${params.toString() ? `?${params.toString()}` : ''}`;
      
      const data = await apiGet(url);
      setAlbums(Array.isArray(data) ? data : []);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      toast.error('Erro ao carregar álbuns');
    } finally {
      setIsLoading(false);
    }
  }, [apiGet, filters, searchQuery, toast]);

  /**
   * Carrega um álbum pelo ID
   */
  const getAlbum = useCallback(async (id: string): Promise<Album | null> => {
    try {
      const data = await apiGet(`/api/albums/${id}`);
      return data as Album;
    } catch {
      toast.error('Erro ao carregar álbum');
      return null;
    }
  }, [apiGet, toast]);

  /**
   * Cria um novo álbum
   */
  const createAlbum = useCallback(async (formData: AlbumFormData): Promise<Album | null> => {
    try {
      // Criar FormData para upload de arquivos
      const form = new FormData();
      
      // Adicionar dados do formulário
      form.append('title', formData.title);
      form.append('artistId', formData.artistId);
      form.append('trackCount', String(formData.trackCount || 0));
      form.append('totalDuration', String(formData.totalDuration || 0));
      form.append('releaseDate', formData.releaseDate || new Date().toISOString());
      form.append('status', formData.status);
      
      // Adicionar arquivo de capa se existir
      if (formData.coverFile) {
        form.append('coverFile', formData.coverFile);
      }
      
      const data = await fetch('/api/albums', {
        method: 'POST',
        body: form,
      }).then(res => {
        if (!res.ok) throw new Error('Falha ao criar álbum');
        return res.json();
      });
      
      // Atualizar lista de álbuns
      setAlbums(prev => [...prev, data as Album]);
      
      toast.success('Álbum criado com sucesso');
      return data as Album;
    } catch {
      toast.error('Erro ao criar álbum');
      return null;
    }
  }, [toast]);

  /**
   * Atualiza um álbum existente
   */
  const updateAlbum = useCallback(async (id: string, formData: AlbumFormData): Promise<Album | null> => {
    try {
      // Criar FormData para upload de arquivos
      const form = new FormData();
      
      // Adicionar dados do formulário
      form.append('title', formData.title);
      form.append('artistId', formData.artistId);
      form.append('trackCount', String(formData.trackCount || 0));
      form.append('totalDuration', String(formData.totalDuration || 0));
      form.append('releaseDate', formData.releaseDate || new Date().toISOString());
      form.append('status', formData.status);
      
      // Adicionar arquivo de capa se existir
      if (formData.coverFile) {
        form.append('coverFile', formData.coverFile);
      }
      
      const data = await fetch(`/api/albums/${id}`, {
        method: 'PATCH',
        body: form,
      }).then(res => {
        if (!res.ok) throw new Error('Falha ao atualizar álbum');
        return res.json();
      });
      
      // Atualizar lista de álbuns
      setAlbums(prev => 
        prev.map(album => 
          album.id === id ? data as Album : album
        )
      );
      
      toast.success('Álbum atualizado com sucesso');
      return data as Album;
    } catch {
      toast.error('Erro ao atualizar álbum');
      return null;
    }
  }, [toast]);

  /**
   * Exclui um álbum
   */
  const deleteAlbum = useCallback(async (id: string): Promise<boolean> => {
    try {
      await apiRemove(`/api/albums/${id}`);
      
      // Atualizar lista de álbuns
      setAlbums(prev => prev.filter(album => album.id !== id));
      
      toast.success('Álbum excluído com sucesso');
      return true;
    } catch {
      toast.error('Erro ao excluir álbum');
      return false;
    }
  }, [apiRemove, toast]);

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
    setFilters(artistId ? { artist_id: artistId } : {});
    setSearchQuery('');
  }, [artistId]);

  /**
   * Atualiza a pesquisa
   */
  const updateSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Carregar álbuns ao montar o componente apenas uma vez (evita loop infinito)
  useEffect(() => {
    if (initialLoad) {
      loadAlbums();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    albums,
    isLoading,
    error,
    filters,
    searchQuery,
    loadAlbums,
    getAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    updateFilters,
    resetFilters,
    updateSearch,
  };
}