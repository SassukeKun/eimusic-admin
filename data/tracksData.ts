// data/tracksData.ts
import { Track } from '@/types/admin';

// Tipo estendido para satisfazer Record<string, unknown>
export type TrackRecord = Track & Record<string, unknown>;

// Dados mockados para faixas
export const mockTracksData: TrackRecord[] = [
  {
    id: '1',
    title: 'Nita Famba',
    artistId: '1',
    artistName: 'Lizha James',
    duration: 234, // 3:54
    plays: 45600,
    revenue: 12500, // 12.500 MT
    uploadDate: '2023-05-18',
    status: 'published',
    coverArt: '/images/covers/track1.jpg',
  },
  {
    id: '2',
    title: 'Tsovani Wanga',
    artistId: '2',
    artistName: 'MC Roger',
    duration: 198, // 3:18
    plays: 32000,
    revenue: 8900, // 8.900 MT
    uploadDate: '2023-06-22',
    status: 'published',
    coverArt: '/images/covers/track2.jpg',
  },
  {
    id: '3',
    title: 'Eparaka',
    artistId: '3',
    artistName: 'Valter Artístico',
    duration: 265, // 4:25
    plays: 28500,
    revenue: 7300, // 7.300 MT
    uploadDate: '2023-07-10',
    status: 'published',
    coverArt: '/images/covers/track3.jpg',
  },
  {
    id: '4',
    title: 'Amor Proibido',
    artistId: '4',
    artistName: 'Marllen',
    duration: 210, // 3:30
    plays: 18200,
    revenue: 4500, // 4.500 MT
    uploadDate: '2023-08-05',
    status: 'published',
    coverArt: '/images/covers/track4.jpg',
  },
  {
    id: '5',
    title: 'Pobre Coração',
    artistId: '5',
    artistName: 'Ziqo',
    duration: 225, // 3:45
    plays: 35600,
    revenue: 9800, // 9.800 MT
    uploadDate: '2023-04-30',
    status: 'published',
    coverArt: '/images/covers/track5.jpg',
  },
];

// Função para formatar a duração
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Função para filtrar faixas com base em critérios
export const filterTracks = (
  tracks: TrackRecord[],
  filters: Record<string, string>,
  searchQuery: string
): TrackRecord[] => {
  let result = [...tracks];
  
  // Aplicar filtros
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      result = result.filter(track => String(track[key]) === value);
    }
  });
  
  // Aplicar pesquisa
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    result = result.filter(track => 
      track.title.toString().toLowerCase().includes(lowerQuery) || 
      track.artistName.toString().toLowerCase().includes(lowerQuery)
    );
  }
  
  return result;
};