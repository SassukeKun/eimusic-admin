export interface Video {
  id: string;
  artist_id: string;
  title: string;
  video_url: string | null;
  thumbnail_url: string | null;
  duration: number;                    // em segundos
  format: string | null;               // formato do vídeo (mp4, webm, etc)
  is_video_clip: boolean;              // true se for videoclipe, false se for outro tipo
  created_at: string;                  // timestamp ISO
  description: string | null;          // descrição do vídeo
  genre: string | null;                // gênero musical
  views: number;                       // número de visualizações
  likes: number;                       // número de likes
  dislikes: number;                    
}

/**
 * Interface para formulário de criação/edição de vídeo
 */
export interface VideoFormData {
  title: string;
  artist_id: string;
  description?: string;
  genre?: string;
  duration: number;
  format?: string;
  is_video_clip: boolean;
  
  // Arquivos para upload
  video_file?: File;
  thumbnail_file?: File;
}

/**
 * Interface para inserção no banco (Supabase Insert)
 */
export interface VideoInsert {
  id?: string;
  artist_id: string;
  title: string;
  video_url?: string | null;
  thumbnail_url?: string | null;
  duration: number;
  format?: string | null;
  is_video_clip?: boolean;
  created_at?: string;
  description?: string | null;
  genre?: string | null;
  views?: number;
  likes?: number;
  dislikes?: number;
}

/**
 * Interface para atualização no banco (Supabase Update)
 */
export interface VideoUpdate {
  artist_id?: string;
  title?: string;
  video_url?: string | null;
  thumbnail_url?: string | null;
  duration?: number;
  format?: string | null;
  is_video_clip?: boolean;
  description?: string | null;
  genre?: string | null;
  views?: number;
  likes?: number;
  dislikes?: number;
}

/**
 * Interface para filtros de busca
 */
export interface VideoFilters {
  artist_id?: string;
  genre?: string;
  is_video_clip?: boolean;
  created_from?: string;
  created_to?: string;
  min_views?: number;
  max_views?: number;
}

/**
 * Interface estendida com dados do artista (para exibição)
 */
export interface VideoWithArtist extends Video {
  artist_name?: string;
  artist_avatar?: string;
}
