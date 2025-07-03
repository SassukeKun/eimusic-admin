import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { useToast } from '@/components/hooks/useToast';
import type { Video } from '@/types/admin';
import type { VideoFormData } from '@/types/modal';

interface UseVideosOptions {
  initialLoad?: boolean;
  artistId?: string;
}

/**
 * Hook para gerenciar vídeos
 */
export function useVideos(options: UseVideosOptions = {}) {
  const { initialLoad = true, artistId } = options;
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>(
    artistId ? { artist_id: artistId } : {}
  );
  const [searchQuery, setSearchQuery] = useState('');
  const api = useApi<Video | Video[]>();
  const toast = useToast();

  /**
   * Carrega a lista de vídeos
   */
  const loadVideos = useCallback(async () => {
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
      
      const url = `/api/videos${params.toString() ? `?${params.toString()}` : ''}`;
      
      const data = await api.get(url);
      setVideos(Array.isArray(data) ? data : []);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      toast.error('Erro ao carregar vídeos');
    } finally {
      setIsLoading(false);
    }
  }, [api, filters, searchQuery, toast]);

  /**
   * Carrega um vídeo pelo ID
   */
  const getVideo = useCallback(async (id: string): Promise<Video | null> => {
    try {
      const data = await api.get(`/api/videos/${id}`);
      return data as Video;
    } catch (error) {
      toast.error('Erro ao carregar vídeo');
      return null;
    }
  }, [api, toast]);

  /**
   * Cria um novo vídeo
   */
  const createVideo = useCallback(async (formData: VideoFormData): Promise<Video | null> => {
    try {
      // Criar FormData para upload de arquivos
      const form = new FormData();
      
      // Adicionar dados do formulário
      form.append('title', formData.title);
      form.append('artistId', formData.artistId);
      form.append('duration', String(formData.duration));
      form.append('status', formData.status);
      
      // Adicionar arquivo de vídeo se existir
      if (formData.videoFile) {
        form.append('videoFile', formData.videoFile);
      }
      
      // Adicionar arquivo de thumbnail se existir
      if (formData.thumbnailFile) {
        form.append('thumbnailFile', formData.thumbnailFile);
      }
      
      const data = await fetch('/api/videos', {
        method: 'POST',
        body: form,
      }).then(res => {
        if (!res.ok) throw new Error('Falha ao criar vídeo');
        return res.json();
      });
      
      // Atualizar lista de vídeos
      setVideos(prev => [...prev, data as Video]);
      
      toast.success('Vídeo criado com sucesso');
      return data as Video;
    } catch (error) {
      toast.error('Erro ao criar vídeo');
      return null;
    }
  }, [toast]);

  /**
   * Atualiza um vídeo existente
   */
  const updateVideo = useCallback(async (id: string, formData: VideoFormData): Promise<Video | null> => {
    try {
      // Criar FormData para upload de arquivos
      const form = new FormData();
      
      // Adicionar dados do formulário
      form.append('title', formData.title);
      form.append('artistId', formData.artistId);
      form.append('duration', String(formData.duration));
      form.append('status', formData.status);
      
      // Adicionar arquivo de vídeo se existir
      if (formData.videoFile) {
        form.append('videoFile', formData.videoFile);
      }
      
      // Adicionar arquivo de thumbnail se existir
      if (formData.thumbnailFile) {
        form.append('thumbnailFile', formData.thumbnailFile);
      }
      
      const data = await fetch(`/api/videos/${id}`, {
        method: 'PATCH',
        body: form,
      }).then(res => {
        if (!res.ok) throw new Error('Falha ao atualizar vídeo');
        return res.json();
      });
      
      // Atualizar lista de vídeos
      setVideos(prev => 
        prev.map(video => 
          video.id === id ? data as Video : video
        )
      );
      
      toast.success('Vídeo atualizado com sucesso');
      return data as Video;
    } catch (error) {
      toast.error('Erro ao atualizar vídeo');
      return null;
    }
  }, [toast]);

  /**
   * Exclui um vídeo
   */
  const deleteVideo = useCallback(async (id: string): Promise<boolean> => {
    try {
      await api.remove(`/api/videos/${id}`);
      
      // Atualizar lista de vídeos
      setVideos(prev => prev.filter(video => video.id !== id));
      
      toast.success('Vídeo excluído com sucesso');
      return true;
    } catch (error) {
      toast.error('Erro ao excluir vídeo');
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
    setFilters(artistId ? { artist_id: artistId } : {});
    setSearchQuery('');
  }, [artistId]);

  /**
   * Atualiza a pesquisa
   */
  const updateSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Carregar vídeos ao montar o componente ou quando os filtros mudarem
  useEffect(() => {
    if (initialLoad) {
      loadVideos();
    }
  }, [loadVideos, initialLoad, filters, searchQuery]);

  return {
    videos,
    isLoading,
    error,
    filters,
    searchQuery,
    loadVideos,
    getVideo,
    createVideo,
    updateVideo,
    deleteVideo,
    updateFilters,
    resetFilters,
    updateSearch,
  };
} 