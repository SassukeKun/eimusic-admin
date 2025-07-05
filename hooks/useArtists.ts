// src/hooks/useArtists.ts

import { useState, useEffect, useCallback } from 'react';

// Interface para artista conforme estrutura real do banco
export interface Artist {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  created_at: string;
  profile_image_url: string | null;
  bio: string | null;
  phone: string | null;
}

export function useArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Buscar todos os artistas
  const fetchArtists = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : '';
      const response = await fetch(`/api/artists${queryParams}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        
        // Tentar extrair a mensagem de erro do JSON
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || `Erro ${response.status}`;
        } catch {
          // Se não for JSON, usar o texto bruto (limitado para não sobrecarregar a UI)
          errorMessage = errorText.slice(0, 100) + (errorText.length > 100 ? '...' : '');
        }
        
        throw new Error(errorMessage);
      }
      
      // Parsear a resposta como JSON
      const data = await response.json();
      
      // Verificar se temos um array
      if (Array.isArray(data)) {
        setArtists(data);
      } else if (data && typeof data === 'object' && data.error) {
        throw new Error(data.error);
      } else {
        console.warn('Formato de resposta inesperado:', data);
        setArtists([]);
      }
      
    } catch (err) {
      console.error('Erro ao buscar artistas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);
  
  // Carregar artistas ao iniciar
  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);
  
  // Atualizar lista
  const refreshArtists = useCallback(async () => {
    setIsRefreshing(true);
    await fetchArtists();
    setIsRefreshing(false);
  }, [fetchArtists]);
  
  // Criar artista
  const createArtist = useCallback(async (artistData: Partial<Artist>) => {
    try {
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artistData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || `Erro ${response.status}`;
        } catch {
          errorMessage = `Erro ${response.status}: ${errorText.slice(0, 100)}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const newArtist = await response.json();
      await refreshArtists();
      return newArtist;
      
    } catch (err) {
      console.error('Erro ao criar artista:', err);
      throw err;
    }
  }, [refreshArtists]);
  
  // Atualizar artista
  const updateArtist = useCallback(async (artistData: Artist) => {
    try {
      const response = await fetch('/api/artists', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artistData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || `Erro ${response.status}`;
        } catch {
          errorMessage = `Erro ${response.status}: ${errorText.slice(0, 100)}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const updatedArtist = await response.json();
      await refreshArtists();
      return updatedArtist;
      
    } catch (err) {
      console.error('Erro ao atualizar artista:', err);
      throw err;
    }
  }, [refreshArtists]);
  
  // Excluir artista
  const deleteArtist = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/artists?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || `Erro ${response.status}`;
        } catch {
          errorMessage = `Erro ${response.status}: ${errorText.slice(0, 100)}`;
        }
        
        throw new Error(errorMessage);
      }
      
      await refreshArtists();
      return true;
      
    } catch (err) {
      console.error('Erro ao excluir artista:', err);
      throw err;
    }
  }, [refreshArtists]);
  
  // Diagnosticar problemas de conexão
  const runDiagnostics = useCallback(async () => {
    try {
      const response = await fetch('/api/test-supabase');
      if (!response.ok) {
        throw new Error(`Erro ${response.status} ao executar diagnóstico`);
      }
      return await response.json();
    } catch (err) {
      console.error('Erro ao executar diagnóstico:', err);
      throw err;
    }
  }, []);
  
  return {
    artists,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    refreshArtists,
    isRefreshing,
    createArtist,
    updateArtist,
    deleteArtist,
    runDiagnostics
  };
}