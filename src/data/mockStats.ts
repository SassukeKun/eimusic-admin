/**
 * Dados mock de estatísticas e analytics para o EiMusic Admin
 * Todas as métricas são realísticas para o contexto moçambicano
 */

import { v4 as uuidv4 } from 'uuid';
import type { 
  DashboardStats, 
  RecentActivity, 
  ChartData, 
  TimeSeriesData, 
  LocationAnalytics, 
  GenreAnalytics 
} from '@/types/admin';
import { 
  MOZAMBICAN_CITIES, 
  MOZAMBICAN_MUSIC_GENRES,
  MOZAMBICAN_ARTIST_NAMES,
  MOZAMBICAN_MALE_NAMES,
  MOZAMBICAN_FEMALE_NAMES,
  MOZAMBICAN_SURNAMES
} from './constants';
import { MOCK_USERS, getUserStats } from './mockUsers';
import { MOCK_ARTISTS, getArtistStats } from './mockArtists';

// Função auxiliar para gerar nome moçambicano
function generateMozambicanName(): string {
  const isMale = Math.random() > 0.5;
  const firstName = isMale 
    ? MOZAMBICAN_MALE_NAMES[Math.floor(Math.random() * MOZAMBICAN_MALE_NAMES.length)]
    : MOZAMBICAN_FEMALE_NAMES[Math.floor(Math.random() * MOZAMBICAN_FEMALE_NAMES.length)];
  const surname = MOZAMBICAN_SURNAMES[Math.floor(Math.random() * MOZAMBICAN_SURNAMES.length)];
  return `${firstName} ${surname}`;
}

// Estatísticas principais do dashboard
export function generateDashboardStats(): DashboardStats {
  const userStats = getUserStats(MOCK_USERS);
  const artistStats = getArtistStats(MOCK_ARTISTS);
  
  // Calcular métricas combinadas
  const totalContent = artistStats.totalTracks;
  const monthlyRevenue = userStats.totalRevenue + artistStats.totalRevenue;
  const pendingApprovals = artistStats.pending + Math.floor(Math.random() * 15); // + conteúdo pendente
  
  // Cidade com mais usuários
  const cityUserCounts = MOCK_USERS.reduce((acc, user) => {
    acc[user.location] = (acc[user.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCity = Object.entries(cityUserCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] as typeof MOZAMBICAN_CITIES[number];

  return {
    totalUsers: userStats.total,
    totalArtists: artistStats.total,
    totalContent,
    monthlyRevenue,
    pendingApprovals,
    newUsersThisMonth: userStats.newThisMonth,
    newArtistsThisMonth: artistStats.newThisMonth,
    activeUsersToday: userStats.activeToday,
    topGenre: artistStats.topGenre,
    topCity: topCity || 'Maputo'
  };
}

// Atividades recentes no sistema
export function generateRecentActivities(): RecentActivity[] {
  const activities: RecentActivity[] = [];
  const now = new Date();
  
  // Tipos de atividades possíveis
  const activityTypes = [
    'user_registered',
    'artist_approved', 
    'content_uploaded',
    'subscription_purchased',
    'content_approved'
  ] as const;
  
  // Gerar 20 atividades recentes
  for (let i = 0; i < 20; i++) {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const userName = generateMozambicanName();
    const artistName = MOZAMBICAN_ARTIST_NAMES[Math.floor(Math.random() * MOZAMBICAN_ARTIST_NAMES.length)];
    
    // Timestamp nas últimas 24 horas
    const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000).toISOString();
    
    let description = '';
    let amount: number | undefined;
    let status: 'success' | 'pending' | 'warning' = 'success';
    
    switch (type) {
      case 'user_registered':
        description = `Novo usuário registrado de ${MOZAMBICAN_CITIES[Math.floor(Math.random() * MOZAMBICAN_CITIES.length)]}`;
        status = 'success';
        break;
        
      case 'artist_approved':
        description = `Artista ${artistName} foi aprovado na plataforma`;
        status = 'success';
        break;
        
      case 'content_uploaded':
        const genre = MOZAMBICAN_MUSIC_GENRES[Math.floor(Math.random() * MOZAMBICAN_MUSIC_GENRES.length)];
        description = `Nova música ${genre} enviada por ${artistName}`;
        status = 'pending';
        break;
        
      case 'subscription_purchased':
        const plan = Math.random() > 0.5 ? 'Premium' : 'VIP';
        amount = plan === 'Premium' ? 199 : 399; // em MT
        description = `Assinatura ${plan} adquirida`;
        status = 'success';
        break;
        
      case 'content_approved':
        description = `Conteúdo de ${artistName} aprovado e publicado`;
        status = 'success';
        break;
    }
    
    activities.push({
      id: uuidv4(),
      type,
      description,
      userName,
      userImage: Math.random() > 0.7 
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`
        : undefined,
      timestamp,
      amount,
      status
    });
  }
  
  // Ordenar por timestamp (mais recente primeiro)
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Dados para gráfico de crescimento mensal (últimos 12 meses)
export function generateTimeSeriesData(): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.toISOString().substring(0, 7); // YYYY-MM
    
    // Simular crescimento orgânico com variações
    const baseUsers = 800 + (11 - i) * 45 + Math.random() * 100;
    const baseArtists = 40 + (11 - i) * 8 + Math.random() * 15;
    const baseContent = 150 + (11 - i) * 25 + Math.random() * 50;
    const baseRevenue = 15000 + (11 - i) * 2500 + Math.random() * 5000;
    
    data.push({
      date: month,
      users: Math.floor(baseUsers),
      artists: Math.floor(baseArtists),
      content: Math.floor(baseContent),
      revenue: Math.floor(baseRevenue)
    });
  }
  
  return data;
}

// Analytics por localização (cidades moçambicanas)
export function generateLocationAnalytics(): LocationAnalytics[] {
  const totalUsers = MOCK_USERS.length;
  
  // Contar usuários por cidade
  const cityUserCounts = MOCK_USERS.reduce((acc, user) => {
    acc[user.location] = (acc[user.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Contar artistas por cidade
  const cityArtistCounts = MOCK_ARTISTS.reduce((acc, artist) => {
    acc[artist.location] = (acc[artist.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Simular revenue por cidade baseado no número de usuários
  const analytics: LocationAnalytics[] = MOZAMBICAN_CITIES.map(city => {
    const users = cityUserCounts[city] || 0;
    const artists = cityArtistCounts[city] || 0;
    const revenue = Math.floor(users * (50 + Math.random() * 100)); // 50-150 MT por usuário médio
    const percentage = (users / totalUsers) * 100;
    const growth = -10 + Math.random() * 30; // -10% a +20% crescimento
    
    return {
      city,
      users,
      artists,
      revenue,
      percentage,
      growth
    };
  }).sort((a, b) => b.users - a.users); // Ordenar por número de usuários
  
  return analytics;
}

// Analytics por gênero musical
export function generateGenreAnalytics(): GenreAnalytics[] {
  // Contar tracks por gênero
  const genreCounts = MOCK_ARTISTS.reduce((acc, artist) => {
    artist.genres.forEach(genre => {
      if (!acc[genre]) {
        acc[genre] = { tracks: 0, revenue: 0, artists: 0 };
      }
      acc[genre].tracks += artist.totalTracks;
      acc[genre].revenue += artist.revenue;
      acc[genre].artists += 1;
    });
    return acc;
  }, {} as Record<string, { tracks: number; revenue: number; artists: number }>);
  
  const totalTracks = Object.values(genreCounts).reduce((sum, g) => sum + g.tracks, 0);
  
  const analytics: GenreAnalytics[] = MOZAMBICAN_MUSIC_GENRES.map(genre => {
    const data = genreCounts[genre] || { tracks: 0, revenue: 0, artists: 0 };
    const plays = data.tracks * (500 + Math.random() * 2000); // 500-2500 plays por track médio
    const percentage = totalTracks > 0 ? (data.tracks / totalTracks) * 100 : 0;
    
    // Gêneros "trending" baseado em popularidade e crescimento
    const trending = ['Amapiano', 'Afrobeat', 'Hip Hop'].includes(genre) && percentage > 8;
    
    return {
      genre,
      tracks: data.tracks,
      plays: Math.floor(plays),
      revenue: data.revenue,
      percentage,
      trending
    };
  }).sort((a, b) => b.tracks - a.tracks); // Ordenar por número de tracks
  
  return analytics;
}

// Dados para gráficos de pizza/donut
export function generateChartData(type: 'users' | 'revenue' | 'genres'): ChartData[] {
  switch (type) {
    case 'users':
      const userPlanCounts = MOCK_USERS.reduce((acc, user) => {
        acc[user.plan] = (acc[user.plan] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(userPlanCounts).map(([plan, count]) => ({
        label: plan.charAt(0).toUpperCase() + plan.slice(1),
        value: count,
        color: plan === 'free' ? '#6b7280' : plan === 'premium' ? '#3b82f6' : '#8b5cf6',
        percentage: (count / MOCK_USERS.length) * 100
      }));
    
    case 'revenue':
      const cityRevenue = generateLocationAnalytics().slice(0, 6); // Top 6 cidades
      return cityRevenue.map(city => ({
        label: city.city,
        value: city.revenue,
        percentage: city.percentage
      }));
    
    case 'genres':
      const genreData = generateGenreAnalytics().slice(0, 8); // Top 8 gêneros
      return genreData.map(genre => ({
        label: genre.genre,
        value: genre.tracks,
        percentage: genre.percentage
      }));
    
    default:
      return [];
  }
}

// Dados mock principais exportados
export const DASHBOARD_STATS = generateDashboardStats();
export const RECENT_ACTIVITIES = generateRecentActivities();
export const TIME_SERIES_DATA = generateTimeSeriesData();
export const LOCATION_ANALYTICS = generateLocationAnalytics();
export const GENRE_ANALYTICS = generateGenreAnalytics();