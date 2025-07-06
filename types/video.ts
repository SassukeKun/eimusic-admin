export interface Video {
    id: string;
    title: string;
    description?: string;
    artist_id: string;
    artist_name: string;
    duration: number; // em segundos
    views: number;
    thumbnail_url?: string;
    video_url?: string;
    status: 'published' | 'draft' | 'removed';
    upload_date: string;
    created_at: string;
    updated_at?: string;
  }
  
  // ============= DADOS PARA FORMULÁRIO =============
  export interface VideoFormData {
    title: string;
    description?: string;
    artist_id: string;
    duration: number;
    thumbnail_url?: string;
    video_url?: string;
    status: 'published' | 'draft' | 'removed';
  }
  
  // ============= FILTROS DE BUSCA =============
  export interface VideoFilters {
    status?: string;
    artist_id?: string;
    search?: string;
  }
  
  // ============= RESPOSTA DA API =============
  export interface VideoApiResponse {
    videos: Video[];
    total: number;
    page: number;
    limit: number;
  }
  
  // ============= PROPS PARA COMPONENTES =============
  export interface VideoCardProps {
    video: Video;
    onEdit: (video: Video) => void;
    onDelete: (video: Video) => void;
    onView: (video: Video) => void;
  }
  
  export interface VideoFormProps {
    video?: Video | null;
    onSubmit: (data: VideoFormData) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
  }
  
  // ============= DADOS DO BANCO (SUPABASE) =============
  export interface VideoDbRow {
    id: string;
    title: string;
    description: string | null;
    artist_id: string;
    artist_name: string;
    duration: number;
    views: number;
    thumbnail_url: string | null;
    video_url: string | null;
    status: string;
    upload_date: string;
    created_at: string;
    updated_at: string | null;
  }