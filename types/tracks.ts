export interface TrackDB {
    id: string;                    // uuid, auto-gerado
    title: string;                 // text, obrigatório
    artist_id: string;             // uuid, obrigatório (FK para artists)
    duration: number;              // integer, obrigatório, padrão 0
    file_url: string;              // text, obrigatório (URL do Cloudinary)
    cover_url: string | null;      // text, opcional (URL da capa)
    album_id: string | null;       // uuid, opcional (FK para albums)
    created_at: string;            // timestamp, auto-gerado
    release_date: string | null;   // date, opcional
    streams: number;               // integer, obrigatório, padrão 0
  }
  export interface Track {
    // Campos da tabela
    id: string;
    title: string;
    artistId: string;
    duration: number;              // Em segundos
    fileUrl: string;
    coverUrl?: string;
    albumId?: string;
    createdAt: string;
    releaseDate?: string;
    streams: number;
    
    // Campos computados/relacionados (não estão no banco)
    artistName?: string;           // Vem da tabela artists
    albumTitle?: string;           // Vem da tabela albums
    durationFormatted?: string;    // Ex: "3:45"
    fileSizeFormatted?: string;    // Ex: "4.2 MB"
    uploaderName?: string;         // Nome de quem fez upload
    
    // Campos para métricas/analytics
    lastPlayedAt?: string;
    revenue?: number;              // Receita gerada pelos streams
    downloadsCount?: number;       // Número de downloads
    likesCount?: number;           // Número de likes
    
    // Estados da aplicação
    isPlaying?: boolean;           // Se está tocando atualmente
    isLoading?: boolean;           // Se está carregando
    hasError?: boolean;            // Se há erro no arquivo
  }
  
  export interface TrackFormData {
    // Campos editáveis básicos
    title: string;
    artistId: string;
    duration?: number;             // Opcional, pode ser detectado automaticamente
    albumId?: string;
    releaseDate?: string;
    
    // Arquivos para upload
    audioFile?: File;              // Arquivo de áudio para upload
    coverFile?: File;              // Arquivo de capa para upload
    
    // URLs existentes (para edição)
    existingFileUrl?: string;
    existingCoverUrl?: string;
    
    // Metadados do arquivo
    fileFormat?: string;           // mp3, wav, flac, etc.
    bitrate?: number;              // Qualidade do áudio
    fileSize?: number;             // Tamanho em bytes
    
    // Campos adicionais para o formulário
    artistName?: string;           // Para exibição (readonly)
    albumTitle?: string;           // Para exibição (readonly)
    
    // Validações e estados do formulário
    isValid?: boolean;
    errors?: Record<string, string>;
  }
  
  export interface TrackCreateData {
    title: string;
    artist_id: string;
    duration: number;
    file_url: string;              // URL já processada do Cloudinary
    cover_url?: string | null;
    album_id?: string | null;
    release_date?: string | null;
    streams?: number;              // Padrão 0
  }
  
  export interface TrackUpdateData {
    title?: string;
    artist_id?: string;
    duration?: number;
    file_url?: string;
    cover_url?: string | null;
    album_id?: string | null;
    release_date?: string | null;
    streams?: number;
  }
  

  export interface TrackFilters {
    artistId?: string;
    albumId?: string;
    hasAlbum?: boolean;           // true = só com álbum, false = só sem álbum
    hasCover?: boolean;           // true = só com capa, false = só sem capa
    minDuration?: number;         // Duração mínima em segundos
    maxDuration?: number;         // Duração máxima em segundos
    minStreams?: number;          // Streams mínimos
    dateFrom?: string;            // Data de criação inicial
    dateTo?: string;              // Data de criação final
    releaseDateFrom?: string;     // Data de lançamento inicial
    releaseDateTo?: string;       // Data de lançamento final
    searchQuery?: string;         // Busca por título
  }
  
  /**
   * Interface para resposta de API com paginação
   */
  export interface TracksResponse {
    data: Track[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }
  
  /**
   * Interface para upload de arquivos
   */
  export interface FileUploadResult {
    url: string;
    publicId: string;
    format: string;
    bytes: number;
    duration?: number;            // Para arquivos de áudio
    width?: number;               // Para imagens
    height?: number;              // Para imagens
  }
  
  /**
   * Interface para estatísticas de faixas
   */
  export interface TrackStats {
    totalTracks: number;
    totalStreams: number;
    totalDuration: number;        // Em segundos
    totalRevenue: number;
    averageStreamsPerTrack: number;
    topArtist: {
      id: string;
      name: string;
      trackCount: number;
    };
    topTrack: {
      id: string;
      title: string;
      streams: number;
    };
  }

  export type TrackStatus = 'active' | 'inactive' | 'processing' | 'error';
  
  export type AudioFormat = 'mp3' | 'wav' | 'flac' | 'aac' | 'm4a' | 'ogg';
  
  export type TrackSortBy = 
    | 'title' 
    | 'artist_name' 
    | 'created_at' 
    | 'streams' 
    | 'duration' 
    | 'release_date';
  
  /**
   * Direção da ordenação
   */
  export type SortDirection = 'asc' | 'desc';
  
  /**
   * Interface para parâmetros de ordenação
   */
  export interface TrackSortOptions {
    sortBy: TrackSortBy;
    direction: SortDirection;
  }
  
  export function isValidTrack(obj: unknown): obj is Track {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'title' in obj &&
      'artistId' in obj &&
      'duration' in obj &&
      'fileUrl' in obj &&
      'streams' in obj &&
      typeof (obj as Record<string, unknown>).id === 'string' &&
      typeof (obj as Record<string, unknown>).title === 'string' &&
      typeof (obj as Record<string, unknown>).artistId === 'string' &&
      typeof (obj as Record<string, unknown>).duration === 'number' &&
      typeof (obj as Record<string, unknown>).fileUrl === 'string' &&
      typeof (obj as Record<string, unknown>).streams === 'number'
    );
  }
  
  /**
   * Função para converter TrackDB em Track
   */
  export function mapTrackFromDB(trackDB: TrackDB): Track {
    return {
      id: trackDB.id,
      title: trackDB.title,
      artistId: trackDB.artist_id,
      duration: trackDB.duration,
      fileUrl: trackDB.file_url,
      coverUrl: trackDB.cover_url || undefined,
      albumId: trackDB.album_id || undefined,
      createdAt: trackDB.created_at,
      releaseDate: trackDB.release_date || undefined,
      streams: trackDB.streams,
    };
  }
  
  /**
   * Função para converter Track em TrackCreateData
   */
  export function mapTrackToCreateData(track: TrackFormData): TrackCreateData {
    return {
      title: track.title,
      artist_id: track.artistId,
      duration: track.duration || 0,
      file_url: track.existingFileUrl || '',
      cover_url: track.existingCoverUrl || null,
      album_id: track.albumId || null,
      release_date: track.releaseDate || null,
      streams: 0,
    };
  }