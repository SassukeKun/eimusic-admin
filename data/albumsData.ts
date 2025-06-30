// data/albumsData.ts
import { Album } from '@/types/admin';

// Tipo estendido para satisfazer Record<string, unknown>
export type AlbumRecord = Album & Record<string, unknown>;

// Dados mockados para álbuns
export const mockAlbumsData: AlbumRecord[] = [
  {
    id: '1',
    title: 'Ngoma Yanga',
    artistId: '1',
    artistName: 'Lizha James',
    trackCount: 12,
    totalDuration: 2520, // 42 minutos
    plays: 120500,
    revenue: 35600, // 35.600 MT
    releaseDate: '2023-04-10',
    status: 'published',
    coverArt: '/images/covers/album1.jpg',
  },
  {
    id: '2',
    title: 'Moçambique Sempre',
    artistId: '2',
    artistName: 'MC Roger',
    trackCount: 8,
    totalDuration: 1740, // 29 minutos
    plays: 85000,
    revenue: 24200, // 24.200 MT
    releaseDate: '2023-06-15',
    status: 'published',
    coverArt: '/images/covers/album2.jpg',
  },
  {
    id: '3',
    title: 'Evolução',
    artistId: '3',
    artistName: 'Valter Artístico',
    trackCount: 10,
    totalDuration: 2100, // 35 minutos
    plays: 62400,
    revenue: 18750, // 18.750 MT
    releaseDate: '2023-08-22',
    status: 'published',
    coverArt: '/images/covers/album3.jpg',
  },
  {
    id: '4',
    title: 'Sonhos',
    artistId: '4',
    artistName: 'Marllen',
    trackCount: 9,
    totalDuration: 1920, // 32 minutos
    plays: 48300,
    revenue: 14500, // 14.500 MT
    releaseDate: '2023-09-30',
    status: 'published',
    coverArt: '/images/covers/album4.jpg',
  },
  {
    id: '5',
    title: 'Raízes',
    artistId: '5',
    artistName: 'Ziqo',
    trackCount: 11,
    totalDuration: 2340, // 39 minutos
    plays: 95600,
    revenue: 28400, // 28.400 MT
    releaseDate: '2023-03-15',
    status: 'published',
    coverArt: '/images/covers/album5.jpg',
  },
];

// Função para formatar a duração
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Função para formatar a duração no formato horas e minutos
export const formatAlbumDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes} min`;
};

// Função para filtrar álbuns com base em critérios
export const filterAlbums = (
  albums: AlbumRecord[],
  filters: Record<string, string>,
  searchQuery: string
): AlbumRecord[] => {
  let result = [...albums];
  
  // Aplicar filtros
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      result = result.filter(album => String(album[key]) === value);
    }
  });
  
  // Aplicar pesquisa
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    result = result.filter(album => 
      album.title.toString().toLowerCase().includes(lowerQuery) || 
      album.artistName.toString().toLowerCase().includes(lowerQuery)
    );
  }
  
  return result;
};