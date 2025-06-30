// data/videosData.ts
import { Video } from '@/types/admin';

// Tipo estendido para satisfazer Record<string, unknown>
export type VideoRecord = Video & Record<string, unknown>;

// Dados mockados para vídeos
export const mockVideosData: VideoRecord[] = [
  {
    id: '1',
    title: 'Nita Famba (Clipe Oficial)',
    artistId: '1',
    artistName: 'Lizha James',
    duration: 285, // 4:45
    views: 1250000,
    revenue: 42500, // 42.500 MT
    uploadDate: '2023-05-25',
    status: 'published',
    thumbnailUrl: '/images/thumbnails/video1.jpg',
  },
  {
    id: '2',
    title: 'Tsovani Wanga (Vídeo Clipe)',
    artistId: '2',
    artistName: 'MC Roger',
    duration: 240, // 4:00
    views: 980000,
    revenue: 35200, // 35.200 MT
    uploadDate: '2023-06-30',
    status: 'published',
    thumbnailUrl: '/images/thumbnails/video2.jpg',
  },
  {
    id: '3',
    title: 'Eparaka (Official Video)',
    artistId: '3',
    artistName: 'Valter Artístico',
    duration: 312, // 5:12
    views: 820000,
    revenue: 29800, // 29.800 MT
    uploadDate: '2023-07-18',
    status: 'published',
    thumbnailUrl: '/images/thumbnails/video3.jpg',
  },
  {
    id: '4',
    title: 'Amor Proibido (Videoclipe)',
    artistId: '4',
    artistName: 'Marllen',
    duration: 274, // 4:34
    views: 560000,
    revenue: 19200, // 19.200 MT
    uploadDate: '2023-08-12',
    status: 'published',
    thumbnailUrl: '/images/thumbnails/video4.jpg',
  },
  {
    id: '5',
    title: 'Vibe de Maputo (Official Video)',
    artistId: '5',
    artistName: 'Ziqo',
    duration: 298, // 4:58
    views: 1450000,
    revenue: 48600, // 48.600 MT
    uploadDate: '2023-05-05',
    status: 'published',
    thumbnailUrl: '/images/thumbnails/video5.jpg',
  },
];

// Função para formatar a duração
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Função para filtrar vídeos com base em critérios
export const filterVideos = (
  videos: VideoRecord[],
  filters: Record<string, string>,
  searchQuery: string
): VideoRecord[] => {
  let result = [...videos];
  
  // Aplicar filtros
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      result = result.filter(video => String(video[key]) === value);
    }
  });
  
  // Aplicar pesquisa
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    result = result.filter(video => 
      video.title.toString().toLowerCase().includes(lowerQuery) || 
      video.artistName.toString().toLowerCase().includes(lowerQuery)
    );
  }
  
  return result;
};