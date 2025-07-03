import { supabaseAdmin } from '@/lib/supabase';
import { uploadImage } from '@/lib/cloudinary';
import type { Album } from '@/types/admin';
import type { AlbumFormData } from '@/types/modal';
import type { Database } from '@/types/database';

type AlbumRow = Database['public']['Tables']['albums']['Row'];
type AlbumInsert = Database['public']['Tables']['albums']['Insert'];
type AlbumUpdate = Database['public']['Tables']['albums']['Update'];

/**
 * Converte um registro do banco de dados para o formato da aplicação
 */
const mapAlbumFromDB = (album: AlbumRow): Album => ({
  id: album.id,
  title: album.title,
  artistId: album.artist_id,
  artistName: album.artist_name,
  trackCount: album.track_count,
  totalDuration: album.total_duration,
  plays: album.plays,
  revenue: album.revenue,
  releaseDate: album.release_date,
  status: album.status,
  coverArt: album.cover_art || undefined,
});

/**
 * Busca todos os álbuns
 */
export const fetchAllAlbums = async (): Promise<Album[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('albums')
      .select('*')
      .order('title');
    
    if (error) throw error;
    
    return (data || []).map(mapAlbumFromDB);
  } catch (error) {
    console.error('Erro ao buscar álbuns:', error);
    throw new Error('Falha ao buscar álbuns');
  }
};

/**
 * Busca um álbum pelo ID
 */
export const fetchAlbumById = async (id: string): Promise<Album | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('albums')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Não encontrado
      throw error;
    }
    
    return data ? mapAlbumFromDB(data) : null;
  } catch (error) {
    console.error(`Erro ao buscar álbum ${id}:`, error);
    throw new Error('Falha ao buscar álbum');
  }
};

/**
 * Busca álbuns por artista
 */
export const fetchAlbumsByArtist = async (artistId: string): Promise<Album[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('albums')
      .select('*')
      .eq('artist_id', artistId)
      .order('release_date', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(mapAlbumFromDB);
  } catch (error) {
    console.error(`Erro ao buscar álbuns do artista ${artistId}:`, error);
    throw new Error('Falha ao buscar álbuns do artista');
  }
};

/**
 * Cria um novo álbum
 */
export const createAlbum = async (formData: AlbumFormData): Promise<Album> => {
  try {
    let coverArtUrl: string | undefined = undefined;
    
    // Se houver um arquivo de capa, fazer upload para o Cloudinary
    if (formData.coverFile) {
      coverArtUrl = await uploadImage(formData.coverFile, 'eimusic/albums');
    }
    
    const now = new Date().toISOString();
    
    // Preparar dados para inserção
    const albumData: AlbumInsert = {
      title: formData.title,
      artist_id: formData.artistId,
      artist_name: '', // Será preenchido após consultar o artista
      track_count: formData.trackCount || 0,
      total_duration: formData.totalDuration || 0,
      plays: 0,
      revenue: 0,
      release_date: formData.releaseDate || now,
      status: formData.status,
      cover_art: coverArtUrl || null,
      created_at: now,
    };
    
    // Buscar o nome do artista
    const { data: artistData, error: artistError } = await supabaseAdmin
      .from('artists')
      .select('name')
      .eq('id', formData.artistId)
      .single();
    
    if (artistError) {
      throw new Error(`Artista não encontrado: ${artistError.message}`);
    }
    
    albumData.artist_name = artistData.name;
    
    // Inserir no banco de dados
    const { data, error } = await supabaseAdmin
      .from('albums')
      .insert(albumData)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Nenhum dado retornado após a inserção');
    
    return mapAlbumFromDB(data);
  } catch (error) {
    console.error('Erro ao criar álbum:', error);
    throw new Error('Falha ao criar álbum');
  }
};

/**
 * Atualiza um álbum existente
 */
export const updateAlbum = async (id: string, formData: AlbumFormData): Promise<Album> => {
  try {
    let coverArtUrl: string | undefined = undefined;
    
    // Se houver um arquivo de capa, fazer upload para o Cloudinary
    if (formData.coverFile) {
      coverArtUrl = await uploadImage(formData.coverFile, 'eimusic/albums');
    }
    
    // Preparar dados para atualização
    const albumData: AlbumUpdate = {
      title: formData.title,
      artist_id: formData.artistId,
      track_count: formData.trackCount,
      total_duration: formData.totalDuration,
      status: formData.status,
      release_date: formData.releaseDate,
      updated_at: new Date().toISOString(),
    };
    
    // Adicionar capa apenas se houver um novo arquivo
    if (coverArtUrl) {
      albumData.cover_art = coverArtUrl;
    }
    
    // Atualizar o nome do artista se o ID do artista mudou
    if (formData.artistId) {
      const { data: artistData, error: artistError } = await supabaseAdmin
        .from('artists')
        .select('name')
        .eq('id', formData.artistId)
        .single();
      
      if (!artistError && artistData) {
        albumData.artist_name = artistData.name;
      }
    }
    
    // Atualizar no banco de dados
    const { data, error } = await supabaseAdmin
      .from('albums')
      .update(albumData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Nenhum dado retornado após a atualização');
    
    return mapAlbumFromDB(data);
  } catch (error) {
    console.error(`Erro ao atualizar álbum ${id}:`, error);
    throw new Error('Falha ao atualizar álbum');
  }
};

/**
 * Exclui um álbum
 */
export const deleteAlbum = async (id: string): Promise<void> => {
  try {
    // Primeiro, verificar se há faixas associadas a este álbum
    const { data: tracks, error: tracksError } = await supabaseAdmin
      .from('tracks')
      .select('id')
      .eq('album_id', id);
    
    if (tracksError) throw tracksError;
    
    // Se houver faixas, atualizar para remover a associação com o álbum
    if (tracks && tracks.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('tracks')
        .update({ album_id: null })
        .eq('album_id', id);
      
      if (updateError) throw updateError;
    }
    
    // Agora excluir o álbum
    const { error } = await supabaseAdmin
      .from('albums')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Erro ao excluir álbum ${id}:`, error);
    throw new Error('Falha ao excluir álbum');
  }
};

/**
 * Busca álbuns com filtros
 */
export const fetchAlbumsWithFilters = async (
  filters: Record<string, string>,
  searchQuery?: string
): Promise<Album[]> => {
  try {
    let query = supabaseAdmin.from('albums').select('*');
    
    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'artist_id') {
          query = query.eq('artist_id', value);
        } else if (key === 'status') {
          query = query.eq('status', value);
        } else if (key === 'release_date_from') {
          query = query.gte('release_date', value);
        } else if (key === 'release_date_to') {
          query = query.lte('release_date', value);
        }
      }
    });
    
    // Aplicar pesquisa
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,artist_name.ilike.%${searchQuery}%`);
    }
    
    // Ordenar por título
    query = query.order('title');
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(mapAlbumFromDB);
  } catch (error) {
    console.error('Erro ao buscar álbuns com filtros:', error);
    throw new Error('Falha ao buscar álbuns');
  }
}; 