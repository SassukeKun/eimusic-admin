import { supabaseAdmin } from '@/lib/supabase';
import { uploadImage } from '@/lib/cloudinary';
import type { Track } from '@/types/admin';
import type { Database } from '@/types/database';

type TrackRow = Database['public']['Tables']['tracks']['Row'];
type TrackInsert = Database['public']['Tables']['tracks']['Insert'];
type TrackUpdate = Database['public']['Tables']['tracks']['Update'];

// Interface para o formulário de faixa
export interface TrackFormData {
  id?: string;
  title: string;
  artistId: string;
  artistName: string;
  duration: number;
  status: 'published' | 'draft' | 'removed';
  albumId?: string;
  coverArt?: string;
  coverFile?: File;
  audioFile?: File;
}

/**
 * Converte um registro do banco de dados para o formato da aplicação
 */
const mapTrackFromDB = (track: TrackRow): Track => ({
  id: track.id,
  title: track.title,
  artistId: track.artist_id,
  artistName: track.artist_name,
  duration: track.duration,
  plays: track.plays,
  revenue: track.revenue,
  uploadDate: track.upload_date,
  status: track.status,
  coverArt: track.cover_art || undefined,
});

/**
 * Busca todas as faixas
 */
export const fetchAllTracks = async (): Promise<Track[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('tracks')
      .select('*')
      .order('title');
    
    if (error) throw error;
    
    return (data || []).map(mapTrackFromDB);
  } catch (error) {
    console.error('Erro ao buscar faixas:', error);
    throw new Error('Falha ao buscar faixas');
  }
};

/**
 * Busca uma faixa pelo ID
 */
export const fetchTrackById = async (id: string): Promise<Track | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('tracks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Não encontrado
      throw error;
    }
    
    return data ? mapTrackFromDB(data) : null;
  } catch (error) {
    console.error(`Erro ao buscar faixa ${id}:`, error);
    throw new Error('Falha ao buscar faixa');
  }
};

/**
 * Busca faixas por artista
 */
export const fetchTracksByArtist = async (artistId: string): Promise<Track[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('tracks')
      .select('*')
      .eq('artist_id', artistId)
      .order('title');
    
    if (error) throw error;
    
    return (data || []).map(mapTrackFromDB);
  } catch (error) {
    console.error(`Erro ao buscar faixas do artista ${artistId}:`, error);
    throw new Error('Falha ao buscar faixas do artista');
  }
};

/**
 * Cria uma nova faixa
 */
export const createTrack = async (formData: TrackFormData): Promise<Track> => {
  try {
    let coverArtUrl: string | undefined = undefined;
    
    // Se houver um arquivo de capa, fazer upload para o Cloudinary
    if (formData.coverFile) {
      coverArtUrl = await uploadImage(formData.coverFile, 'eimusic/tracks');
    }
    
    const now = new Date().toISOString();
    
    // Preparar dados para inserção
    const trackData: TrackInsert = {
      title: formData.title,
      artist_id: formData.artistId,
      artist_name: formData.artistName,
      duration: formData.duration,
      plays: 0,
      revenue: 0,
      upload_date: now,
      status: formData.status,
      cover_art: coverArtUrl || null,
      album_id: formData.albumId || null,
      created_at: now,
    };
    
    // Inserir no banco de dados
    const { data, error } = await supabaseAdmin
      .from('tracks')
      .insert(trackData)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Nenhum dado retornado após a inserção');
    
    // Atualizar contador de faixas do artista
    await supabaseAdmin.rpc('increment_artist_track_count', { artist_id: formData.artistId });
    
    return mapTrackFromDB(data);
  } catch (error) {
    console.error('Erro ao criar faixa:', error);
    throw new Error('Falha ao criar faixa');
  }
};

/**
 * Atualiza uma faixa existente
 */
export const updateTrack = async (id: string, formData: TrackFormData): Promise<Track> => {
  try {
    let coverArtUrl: string | undefined = undefined;
    
    // Se houver um arquivo de capa, fazer upload para o Cloudinary
    if (formData.coverFile) {
      coverArtUrl = await uploadImage(formData.coverFile, 'eimusic/tracks');
    }
    
    // Preparar dados para atualização
    const trackData: TrackUpdate = {
      title: formData.title,
      artist_id: formData.artistId,
      artist_name: formData.artistName,
      duration: formData.duration,
      status: formData.status,
      cover_art: coverArtUrl || undefined,
      album_id: formData.albumId || null,
      updated_at: new Date().toISOString(),
    };
    
    // Atualizar no banco de dados
    const { data, error } = await supabaseAdmin
      .from('tracks')
      .update(trackData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Nenhum dado retornado após a atualização');
    
    return mapTrackFromDB(data);
  } catch (error) {
    console.error(`Erro ao atualizar faixa ${id}:`, error);
    throw new Error('Falha ao atualizar faixa');
  }
};

/**
 * Exclui uma faixa
 */
export const deleteTrack = async (id: string, artistId: string): Promise<void> => {
  try {
    const { error } = await supabaseAdmin
      .from('tracks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Decrementar contador de faixas do artista
    await supabaseAdmin.rpc('decrement_artist_track_count', { artist_id: artistId });
  } catch (error) {
    console.error(`Erro ao excluir faixa ${id}:`, error);
    throw new Error('Falha ao excluir faixa');
  }
};

/**
 * Busca faixas com filtros
 */
export const fetchTracksWithFilters = async (
  filters: Record<string, string>,
  searchQuery?: string
): Promise<Track[]> => {
  try {
    let query = supabaseAdmin.from('tracks').select('*');
    
    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query = query.eq(key, value);
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
    
    return (data || []).map(mapTrackFromDB);
  } catch (error) {
    console.error('Erro ao buscar faixas com filtros:', error);
    throw new Error('Falha ao buscar faixas');
  }
}; 