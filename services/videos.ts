import { supabaseAdmin } from '@/lib/supabase';
import { uploadImage, uploadVideo } from '@/lib/cloudinary';
import type { Video } from '@/types/admin';
import type { VideoFormData } from '@/types/modal';
import type { Database } from '@/types/database';

type VideoRow = Database['public']['Tables']['videos']['Row'];
type VideoInsert = Database['public']['Tables']['videos']['Insert'];
type VideoUpdate = Database['public']['Tables']['videos']['Update'];

/**
 * Converte um registro do banco de dados para o formato da aplicação
 */
const mapVideoFromDB = (video: VideoRow): Video => ({
  id: video.id,
  title: video.title,
  artistId: video.artist_id,
  artistName: video.artist_name,
  duration: video.duration,
  views: video.views,
  revenue: video.revenue,
  uploadDate: video.upload_date,
  status: video.status,
  thumbnailUrl: video.thumbnail_url || undefined,
});

/**
 * Busca todos os vídeos
 */
export const fetchAllVideos = async (): Promise<Video[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('videos')
      .select('*')
      .order('title');
    
    if (error) throw error;
    
    return (data || []).map(mapVideoFromDB);
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    throw new Error('Falha ao buscar vídeos');
  }
};

/**
 * Busca um vídeo pelo ID
 */
export const fetchVideoById = async (id: string): Promise<Video | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Não encontrado
      throw error;
    }
    
    return data ? mapVideoFromDB(data) : null;
  } catch (error) {
    console.error(`Erro ao buscar vídeo ${id}:`, error);
    throw new Error('Falha ao buscar vídeo');
  }
};

/**
 * Busca vídeos por artista
 */
export const fetchVideosByArtist = async (artistId: string): Promise<Video[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('videos')
      .select('*')
      .eq('artist_id', artistId)
      .order('upload_date', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(mapVideoFromDB);
  } catch (error) {
    console.error(`Erro ao buscar vídeos do artista ${artistId}:`, error);
    throw new Error('Falha ao buscar vídeos do artista');
  }
};

/**
 * Cria um novo vídeo
 */
export const createVideo = async (formData: VideoFormData): Promise<Video> => {
  try {
    let thumbnailUrl: string | undefined = undefined;
    let videoUrl: string | undefined = undefined;
    
    // Se houver um arquivo de vídeo, fazer upload para o Cloudinary
    if (formData.videoFile) {
      const uploadResult = await uploadVideo(formData.videoFile, 'eimusic/videos');
      videoUrl = uploadResult.videoUrl;
      thumbnailUrl = uploadResult.thumbnailUrl;
    }
    
    // Se houver um arquivo de thumbnail separado, fazer upload para o Cloudinary
    if (formData.thumbnailFile) {
      thumbnailUrl = await uploadImage(formData.thumbnailFile, 'eimusic/videos/thumbnails');
    }
    
    const now = new Date().toISOString();
    
    // Preparar dados para inserção
    const videoData: VideoInsert = {
      title: formData.title,
      artist_id: formData.artistId,
      artist_name: '', // Será preenchido após consultar o artista
      duration: formData.duration,
      views: 0,
      revenue: 0,
      upload_date: now,
      status: formData.status,
      thumbnail_url: thumbnailUrl || null,
      video_url: videoUrl || null,
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
    
    videoData.artist_name = artistData.name;
    
    // Inserir no banco de dados
    const { data, error } = await supabaseAdmin
      .from('videos')
      .insert(videoData)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Nenhum dado retornado após a inserção');
    
    return mapVideoFromDB(data);
  } catch (error) {
    console.error('Erro ao criar vídeo:', error);
    throw new Error('Falha ao criar vídeo');
  }
};

/**
 * Atualiza um vídeo existente
 */
export const updateVideo = async (id: string, formData: VideoFormData): Promise<Video> => {
  try {
    let thumbnailUrl: string | undefined = undefined;
    let videoUrl: string | undefined = undefined;
    
    // Se houver um arquivo de vídeo, fazer upload para o Cloudinary
    if (formData.videoFile) {
      const uploadResult = await uploadVideo(formData.videoFile, 'eimusic/videos');
      videoUrl = uploadResult.videoUrl;
      thumbnailUrl = uploadResult.thumbnailUrl;
    }
    
    // Se houver um arquivo de thumbnail separado, fazer upload para o Cloudinary
    if (formData.thumbnailFile) {
      thumbnailUrl = await uploadImage(formData.thumbnailFile, 'eimusic/videos/thumbnails');
    }
    
    // Preparar dados para atualização
    const videoData: VideoUpdate = {
      title: formData.title,
      artist_id: formData.artistId,
      duration: formData.duration,
      status: formData.status,
      updated_at: new Date().toISOString(),
    };
    
    // Adicionar URLs apenas se houver novos arquivos
    if (thumbnailUrl) {
      videoData.thumbnail_url = thumbnailUrl;
    }
    
    if (videoUrl) {
      videoData.video_url = videoUrl;
    }
    
    // Atualizar o nome do artista se o ID do artista mudou
    if (formData.artistId) {
      const { data: artistData, error: artistError } = await supabaseAdmin
        .from('artists')
        .select('name')
        .eq('id', formData.artistId)
        .single();
      
      if (!artistError && artistData) {
        videoData.artist_name = artistData.name;
      }
    }
    
    // Atualizar no banco de dados
    const { data, error } = await supabaseAdmin
      .from('videos')
      .update(videoData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Nenhum dado retornado após a atualização');
    
    return mapVideoFromDB(data);
  } catch (error) {
    console.error(`Erro ao atualizar vídeo ${id}:`, error);
    throw new Error('Falha ao atualizar vídeo');
  }
};

/**
 * Exclui um vídeo
 */
export const deleteVideo = async (id: string): Promise<void> => {
  try {
    const { error } = await supabaseAdmin
      .from('videos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Erro ao excluir vídeo ${id}:`, error);
    throw new Error('Falha ao excluir vídeo');
  }
};

/**
 * Busca vídeos com filtros
 */
export const fetchVideosWithFilters = async (
  filters: Record<string, string>,
  searchQuery?: string
): Promise<Video[]> => {
  try {
    let query = supabaseAdmin.from('videos').select('*');
    
    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'artist_id') {
          query = query.eq('artist_id', value);
        } else if (key === 'status') {
          query = query.eq('status', value);
        } else if (key === 'upload_date_from') {
          query = query.gte('upload_date', value);
        } else if (key === 'upload_date_to') {
          query = query.lte('upload_date', value);
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
    
    return (data || []).map(mapVideoFromDB);
  } catch (error) {
    console.error('Erro ao buscar vídeos com filtros:', error);
    throw new Error('Falha ao buscar vídeos');
  }
}; 