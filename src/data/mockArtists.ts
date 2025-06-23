/**
 * Dados mock de artistas moçambicanos para o EiMusic Admin
 * Todos os dados são realísticos e representativos da cena musical moçambicana
 */

import { v4 as uuidv4 } from 'uuid';
import type { AdminArtist, ArtistFilters } from '@/types/admin';
import { 
  MOZAMBICAN_CITIES,
  MOZAMBICAN_MUSIC_GENRES,
  MOZAMBICAN_ARTIST_NAMES,
  MOZAMBICAN_MALE_NAMES,
  MOZAMBICAN_FEMALE_NAMES,
  MOZAMBICAN_SURNAMES,
  ARTIST_STATUS
} from './constants';

// Função auxiliar para gerar nome artístico único
function generateArtisticName(): string {
  const prefixes = ['MC', 'DJ', 'Lil', 'Big', 'Young', ''];
  const suffixes = ['Moz', 'MZ', 'Afrika', 'Maputo', 'Beira', '254', 'Jr', ''];
  
  const baseNames = [
    'Azagaia', 'Mabassa', 'Taliwanga', 'Nizagaia', 'Xamã',
    'Kelvin', 'Stewart', 'Anita', 'Lenna', 'Zena', 'Maria',
    'Denny', 'Lizha', 'Hélio', 'Mingas', 'Edmazia', 'Ghorwane'
  ];
  
  const prefix = Math.random() > 0.7 ? prefixes[Math.floor(Math.random() * prefixes.length)] : '';
  const baseName = baseNames[Math.floor(Math.random() * baseNames.length)];
  const suffix = Math.random() > 0.6 ? suffixes[Math.floor(Math.random() * suffixes.length)] : '';
  
  return [prefix, baseName, suffix].filter(Boolean).join(' ').trim();
}

// Função auxiliar para gerar nome real moçambicano
function generateMozambicanName(): string {
  const isMale = Math.random() > 0.4; // Ligeiramente mais artistas masculinos
  const firstName = isMale 
    ? MOZAMBICAN_MALE_NAMES[Math.floor(Math.random() * MOZAMBICAN_MALE_NAMES.length)]
    : MOZAMBICAN_FEMALE_NAMES[Math.floor(Math.random() * MOZAMBICAN_FEMALE_NAMES.length)];
  const surname = MOZAMBICAN_SURNAMES[Math.floor(Math.random() * MOZAMBICAN_SURNAMES.length)];
  return `${firstName} ${surname}`;
}

// Função auxiliar para gerar email baseado no nome artístico
function generateArtistEmail(artisticName: string): string {
  const cleanArtisticName = artisticName.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[áàãâ]/g, 'a')
    .replace(/[éèê]/g, 'e')
    .replace(/[íì]/g, 'i')
    .replace(/[óòõô]/g, 'o')
    .replace(/[úù]/g, 'u')
    .replace(/ç/g, 'c');
  
  const domains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  return `${cleanArtisticName}@${domain}`;
}

// Função auxiliar para gerar telefone moçambicano
function generateMozambicanPhone(): string {
  const prefixes = ['84', '85', '86', '87'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `+258 ${prefix} ${number}`;
}

// Função auxiliar para gerar data aleatória
function generateRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

// Função auxiliar para gerar gêneros musicais para um artista
function generateArtistGenres(): typeof MOZAMBICAN_MUSIC_GENRES[number][] {
  const numGenres = Math.random() > 0.7 ? 2 : 1; // Maioria tem 1 gênero, alguns têm 2
  const shuffled = [...MOZAMBICAN_MUSIC_GENRES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numGenres);
}

// Função auxiliar para gerar redes sociais
function generateSocialMedia(artisticName: string) {
  const hasInstagram = Math.random() > 0.2; // 80% têm Instagram
  const hasFacebook = Math.random() > 0.4;  // 60% têm Facebook
  const hasYoutube = Math.random() > 0.6;   // 40% têm YouTube
  const hasTiktok = Math.random() > 0.5;    // 50% têm TikTok
  
  const cleanName = artisticName.toLowerCase().replace(/\s+/g, '');
  
  return {
    instagram: hasInstagram ? `https://instagram.com/${cleanName}` : undefined,
    facebook: hasFacebook ? `https://facebook.com/${cleanName}music` : undefined,
    youtube: hasYoutube ? `https://youtube.com/@${cleanName}` : undefined,
    tiktok: hasTiktok ? `https://tiktok.com/@${cleanName}` : undefined,
  };
}

// Gerar dados mock de artistas
function generateMockArtists(count: number): AdminArtist[] {
  return Array.from({ length: count }, () => {
    const realName = generateMozambicanName();
    const artisticName = Math.random() > 0.3 
      ? generateArtisticName() 
      : MOZAMBICAN_ARTIST_NAMES[Math.floor(Math.random() * MOZAMBICAN_ARTIST_NAMES.length)];
    
    const joinedDaysAgo = Math.floor(Math.random() * 730); // Até 2 anos atrás
    const lastUploadDaysAgo = Math.floor(Math.random() * 90); // Até 3 meses
    const genres = generateArtistGenres();
    
    // Status baseado no tempo na plataforma e atividade
    let status: typeof ARTIST_STATUS[keyof typeof ARTIST_STATUS] = ARTIST_STATUS.PENDING;
    if (joinedDaysAgo > 30) {
      if (Math.random() > 0.15) {
        status = ARTIST_STATUS.APPROVED;
        if (Math.random() > 0.8 && joinedDaysAgo > 180) { // 20% dos aprovados são verificados
          status = ARTIST_STATUS.VERIFIED;
        }
      } else {
        status = Math.random() > 0.5 ? ARTIST_STATUS.BLOCKED : ARTIST_STATUS.PENDING;
      }
    }
    
    // Métricas baseadas no status e tempo na plataforma
    const isSuccessful = status === ARTIST_STATUS.VERIFIED || 
                        (status === ARTIST_STATUS.APPROVED && Math.random() > 0.6);
    
    const totalTracks = isSuccessful 
      ? Math.floor(5 + Math.random() * 45)   // 5-50 tracks
      : Math.floor(1 + Math.random() * 15);  // 1-15 tracks
    
    const followers = isSuccessful
      ? Math.floor(1000 + Math.random() * 49000)  // 1K-50K seguidores
      : Math.floor(10 + Math.random() * 2000);    // 10-2K seguidores
    
    const revenuePerTrack = isSuccessful ? 50 + Math.random() * 200 : 5 + Math.random() * 50;
    const revenue = Math.floor(totalTracks * revenuePerTrack);
    
    const verificationBadge = status === ARTIST_STATUS.VERIFIED;
    const featuredArtist = verificationBadge && Math.random() > 0.7; // 30% dos verificados são featured
    
    // Biografia para alguns artistas
    const biographies = [
      `Artista moçambicano especializado em ${genres[0]}, trazendo sonoridades autênticas de ${MOZAMBICAN_CITIES[Math.floor(Math.random() * MOZAMBICAN_CITIES.length)]}.`,
      `Pioneiro do ${genres[0]} em Moçambique, com influências tradicionais e modernas.`,
      `Jovem talento moçambicano que mistura ${genres.join(' e ')} com elementos da cultura local.`,
      `Artista versátil que representa a nova geração da música moçambicana.`,
      undefined
    ];
    
    return {
      id: uuidv4(),
      name: realName,
      email: generateArtistEmail(artisticName),
      phone: generateMozambicanPhone(),
      artisticName,
      status,
      genres,
      totalTracks,
      followers,
      revenue,
      location: MOZAMBICAN_CITIES[Math.floor(Math.random() * MOZAMBICAN_CITIES.length)],
      verificationBadge,
      featuredArtist,
      joinedAt: generateRandomDate(joinedDaysAgo),
      lastUpload: generateRandomDate(lastUploadDaysAgo),
      socialMedia: generateSocialMedia(artisticName),
      profileImage: Math.random() > 0.6 
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(artisticName)}`
        : undefined,
      biography: biographies[Math.floor(Math.random() * biographies.length)]
    };
  });
}

// Dados mock - 80 artistas para simulação realística
export const MOCK_ARTISTS: AdminArtist[] = generateMockArtists(80);

// Função para filtrar artistas (simula busca)
export function filterArtists(artists: AdminArtist[], filters: ArtistFilters): AdminArtist[] {
  return artists.filter(artist => {
    // Filtro por status
    if (filters.status && artist.status !== filters.status) {
      return false;
    }

    // Filtro por gênero
    if (filters.genre && !artist.genres.includes(filters.genre)) {
      return false;
    }

    // Filtro por localização
    if (filters.location && artist.location !== filters.location) {
      return false;
    }

    // Filtro por verificação
    if (filters.verified !== undefined && artist.verificationBadge !== filters.verified) {
      return false;
    }

    // Filtro por featured
    if (filters.featured !== undefined && artist.featuredArtist !== filters.featured) {
      return false;
    }

    // Busca por termo (nome real, nome artístico ou email)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const matchesName = artist.name.toLowerCase().includes(term);
      const matchesArtisticName = artist.artisticName.toLowerCase().includes(term);
      const matchesEmail = artist.email.toLowerCase().includes(term);
      if (!matchesName && !matchesArtisticName && !matchesEmail) {
        return false;
      }
    }

    // Filtro por data
    if (filters.dateFrom) {
      const artistDate = new Date(artist.joinedAt);
      const fromDate = new Date(filters.dateFrom);
      if (artistDate < fromDate) {
        return false;
      }
    }

    if (filters.dateTo) {
      const artistDate = new Date(artist.joinedAt);
      const toDate = new Date(filters.dateTo);
      if (artistDate > toDate) {
        return false;
      }
    }

    return true;
  });
}

// Estatísticas dos artistas para dashboard
export function getArtistStats(artists: AdminArtist[]) {
  const approvedArtists = artists.filter(a => a.status === 'approved').length;
  const verifiedArtists = artists.filter(a => a.verificationBadge).length;
  const featuredArtists = artists.filter(a => a.featuredArtist).length;
  const pendingApproval = artists.filter(a => a.status === 'pending').length;
  const totalRevenue = artists.reduce((sum, a) => sum + a.revenue, 0);
  const totalTracks = artists.reduce((sum, a) => sum + a.totalTracks, 0);
  const totalFollowers = artists.reduce((sum, a) => sum + a.followers, 0);
  
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const newArtistsThisMonth = artists.filter(a => new Date(a.joinedAt) >= last30Days).length;

  // Top gênero por número de artistas
  const genreCounts = artists.reduce((acc, artist) => {
    artist.genres.forEach(genre => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const topGenre = Object.entries(genreCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] as typeof MOZAMBICAN_MUSIC_GENRES[number];

  return {
    total: artists.length,
    approved: approvedArtists,
    verified: verifiedArtists,
    featured: featuredArtists,
    pending: pendingApproval,
    totalRevenue,
    totalTracks,
    totalFollowers,
    newThisMonth: newArtistsThisMonth,
    topGenre
  };
}