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
  // Novas faixas fictícias
  {
    id: '6',
    title: 'Moçambicano',
    artistId: '1',
    artistName: 'Lizha James',
    duration: 212, // 3:32
    plays: 38900,
    revenue: 10200, // 10.200 MT
    uploadDate: '2023-09-15',
    status: 'published',
    coverArt: '/images/covers/track6.jpg',
  },
  {
    id: '7',
    title: 'Xitchuketa',
    artistId: '2',
    artistName: 'MC Roger',
    duration: 189, // 3:09
    plays: 29500,
    revenue: 7800, // 7.800 MT
    uploadDate: '2023-10-05',
    status: 'published',
    coverArt: '/images/covers/track7.jpg',
  },
  {
    id: '8',
    title: 'Vovó Malandrinha',
    artistId: '3',
    artistName: 'Valter Artístico',
    duration: 245, // 4:05
    plays: 25300,
    revenue: 6500, // 6.500 MT
    uploadDate: '2023-08-22',
    status: 'published',
    coverArt: '/images/covers/track8.jpg',
  },
  {
    id: '9',
    title: 'Dança Sensual',
    artistId: '4',
    artistName: 'Marllen',
    duration: 230, // 3:50
    plays: 22100,
    revenue: 5400, // 5.400 MT
    uploadDate: '2023-11-18',
    status: 'published',
    coverArt: '/images/covers/track9.jpg',
  },
  {
    id: '10',
    title: 'Xitimela',
    artistId: '5',
    artistName: 'Ziqo',
    duration: 218, // 3:38
    plays: 31200,
    revenue: 8300, // 8.300 MT
    uploadDate: '2023-07-28',
    status: 'published',
    coverArt: '/images/covers/track10.jpg',
  },
  {
    id: '11',
    title: 'Sorriso Lindo',
    artistId: '1',
    artistName: 'Lizha James',
    duration: 227, // 3:47
    plays: 19800,
    revenue: 5100, // 5.100 MT
    uploadDate: '2023-12-10',
    status: 'draft',
    coverArt: '/images/covers/track11.jpg',
  },
  {
    id: '12',
    title: 'Amor e Paixão',
    artistId: '2',
    artistName: 'MC Roger',
    duration: 192, // 3:12
    plays: 15600,
    revenue: 4200, // 4.200 MT
    uploadDate: '2024-01-05',
    status: 'published',
    coverArt: '/images/covers/track12.jpg',
  },
  {
    id: '13',
    title: 'Maputo Cidade',
    artistId: '3',
    artistName: 'Valter Artístico',
    duration: 253, // 4:13
    plays: 17900,
    revenue: 4800, // 4.800 MT
    uploadDate: '2023-09-30',
    status: 'published',
    coverArt: '/images/covers/track13.jpg',
  },
  {
    id: '14',
    title: 'Celebração',
    artistId: '4',
    artistName: 'Marllen',
    duration: 235, // 3:55
    plays: 13500,
    revenue: 3700, // 3.700 MT
    uploadDate: '2023-10-22',
    status: 'draft',
    coverArt: '/images/covers/track14.jpg',
  },
  {
    id: '15',
    title: 'Felicidade',
    artistId: '5',
    artistName: 'Ziqo',
    duration: 240, // 4:00
    plays: 21800,
    revenue: 5900, // 5.900 MT
    uploadDate: '2023-11-15',
    status: 'published',
    coverArt: '/images/covers/track15.jpg',
  },
  {
    id: '16',
    title: 'Nova Vida',
    artistId: '1',
    artistName: 'Lizha James',
    duration: 221, // 3:41
    plays: 16700,
    revenue: 4400, // 4.400 MT
    uploadDate: '2024-01-20',
    status: 'published',
    coverArt: '/images/covers/track16.jpg',
  },
  {
    id: '17',
    title: 'Sonho Real',
    artistId: '2',
    artistName: 'MC Roger',
    duration: 204, // 3:24
    plays: 14200,
    revenue: 3800, // 3.800 MT
    uploadDate: '2023-08-12',
    status: 'removed',
    coverArt: '/images/covers/track17.jpg',
  },
  {
    id: '18',
    title: 'Maningue Nice',
    artistId: '3',
    artistName: 'Valter Artístico',
    duration: 258, // 4:18
    plays: 19400,
    revenue: 5300, // 5.300 MT
    uploadDate: '2023-12-28',
    status: 'published',
    coverArt: '/images/covers/track18.jpg',
  },
  {
    id: '19',
    title: 'Ritmo Africano',
    artistId: '4',
    artistName: 'Marllen',
    duration: 216, // 3:36
    plays: 15300,
    revenue: 4100, // 4.100 MT
    uploadDate: '2024-01-15',
    status: 'published',
    coverArt: '/images/covers/track19.jpg',
  },
  {
    id: '20',
    title: 'Terra Boa',
    artistId: '5',
    artistName: 'Ziqo',
    duration: 232, // 3:52
    plays: 18700,
    revenue: 5000, // 5.000 MT
    uploadDate: '2023-10-08',
    status: 'published',
    coverArt: '/images/covers/track20.jpg',
  }
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