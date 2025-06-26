// data/artistsData.ts
import { Artist } from '@/types/admin';
import type { MonetizationPlan, PaymentMethod, ArtistStatus } from '@/types/modal';

// Tipo estendido para satisfazer Record<string, unknown>
export type ArtistRecord = Artist & Record<string, unknown>;

// Dados mockados para artistas - ATUALIZADOS com campos de pagamento
export const mockArtistsData: ArtistRecord[] = [
  {
    id: '1',
    name: 'Lizha James',
    email: 'lizha@eimusic.co.mz',
    profileImage: 'https://ui-avatars.com/api/?name=Lizha+James&background=6366f1&color=fff',
    genre: 'Pandza',
    verified: true,
    joinedDate: '2023-04-15',
    totalTracks: 24,
    totalRevenue: 85600, // 85.600 MT
    status: 'active' as ArtistStatus,
    monetizationPlan: 'premium' as MonetizationPlan,
    // CAMPOS DE PAGAMENTO
    paymentMethod: 'mpesa' as PaymentMethod,
    phoneNumber: '+258 84 123 4567',
    lastPaymentDate: '2024-01-15',
    totalEarnings: 125000, // 125.000 MT histórico
  },
  {
    id: '2',
    name: 'MC Roger',
    email: 'mcroger@eimusic.co.mz',
    profileImage: 'https://ui-avatars.com/api/?name=MC+Roger&background=6366f1&color=fff',
    genre: 'Marrabenta',
    verified: true,
    joinedDate: '2023-06-10',
    totalTracks: 18,
    totalRevenue: 43200, // 43.200 MT
    status: 'active' as ArtistStatus,
    monetizationPlan: 'premium' as MonetizationPlan,
    // CAMPOS DE PAGAMENTO
    paymentMethod: 'visa' as PaymentMethod,
    lastPaymentDate: '2024-01-20',
    totalEarnings: 78500, // 78.500 MT histórico
  },
  {
    id: '3',
    name: 'Valter Artístico',
    email: 'valter@eimusic.co.mz',
    profileImage: 'https://ui-avatars.com/api/?name=Valter+Artistico&background=6366f1&color=fff',
    genre: 'Hip Hop',
    verified: true,
    joinedDate: '2023-05-22',
    totalTracks: 15,
    totalRevenue: 38750, // 38.750 MT
    status: 'active' as ArtistStatus,
    monetizationPlan: 'basic' as MonetizationPlan,
    // CAMPOS DE PAGAMENTO
    paymentMethod: 'mpesa' as PaymentMethod,
    phoneNumber: '+258 87 987 6543',
    lastPaymentDate: '2024-01-10',
    totalEarnings: 45200, // 45.200 MT histórico
  },
  {
    id: '4',
    name: 'Marllen',
    email: 'marllen@eimusic.co.mz',
    profileImage: 'https://ui-avatars.com/api/?name=Marllen&background=6366f1&color=fff',
    genre: 'Pop',
    verified: false,
    joinedDate: '2023-08-05',
    totalTracks: 8,
    totalRevenue: 17500, // 17.500 MT
    status: 'inactive' as ArtistStatus,
    monetizationPlan: 'basic' as MonetizationPlan,
    // CAMPOS DE PAGAMENTO
    paymentMethod: 'paypal' as PaymentMethod,
    lastPaymentDate: '2023-12-20',
    totalEarnings: 22000, // 22.000 MT histórico
  },
  {
    id: '5',
    name: 'Ziqo',
    email: 'ziqo@eimusic.co.mz',
    profileImage: 'https://ui-avatars.com/api/?name=Ziqo&background=6366f1&color=fff',
    genre: 'Kizomba',
    verified: true,
    joinedDate: '2023-07-12',
    totalTracks: 20,
    totalRevenue: 54300, // 54.300 MT
    status: 'active' as ArtistStatus,
    monetizationPlan: 'premium' as MonetizationPlan,
    // CAMPOS DE PAGAMENTO
    paymentMethod: 'mpesa' as PaymentMethod,
    phoneNumber: '+258 85 456 7890',
    lastPaymentDate: '2024-01-25',
    totalEarnings: 89600, // 89.600 MT histórico
  },
];

// Função para filtrar artistas com base em critérios
export const filterArtists = (
  artists: ArtistRecord[],
  filters: Record<string, string>,
  searchQuery: string
): ArtistRecord[] => {
  let result = [...artists];
  
  // Aplicar filtros
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      if (key === 'verified') {
        const isVerified = value === 'verified';
        result = result.filter(artist => artist.verified === isVerified);
      } else {
        result = result.filter(artist => String(artist[key]) === value);
      }
    }
  });
  
  // Aplicar pesquisa
  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    result = result.filter(artist => 
      artist.name.toString().toLowerCase().includes(lowerQuery) || 
      artist.email.toString().toLowerCase().includes(lowerQuery) ||
      artist.genre.toString().toLowerCase().includes(lowerQuery)
    );
  }
  
  return result;
};