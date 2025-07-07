// app/api/dashboard/smart-stats/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface SmartStats {
  totalUsers: number;
  totalArtists: number;
  totalTracks: number;
  totalStreams: number;
  verifiedArtists: number;
  activeSubscriptions: number;
  totalRevenue: number;
  newUsersToday: number;
  topGenre: string;
  avgStreamsPerTrack: number;
}

export async function GET() {
  try {
    // Executar queries em paralelo para melhor performance
    const [
      usersResult,
      artistsResult,
      tracksResult,
      subscriptionsResult
    ] = await Promise.allSettled([
      // Usuários
      supabaseAdmin
        .from('users')
        .select('id, created_at, has_active_subscription', { count: 'exact' }),
      
      // Artistas
      supabaseAdmin
        .from('artists')
        .select('id, verified', { count: 'exact' }),
      
      // Tracks (buscar da tabela correta baseada no que vimos antes)
      supabaseAdmin
        .from('tracks')
        .select('id, streams', { count: 'exact' }),
      
      // Subscriptions ativas
      supabaseAdmin
        .from('users')
        .select('id', { count: 'exact' })
        .eq('has_active_subscription', true)
    ]);

    // Processar resultados com fallbacks
    const totalUsers = usersResult.status === 'fulfilled' 
      ? usersResult.value.count || 0 
      : 0;

    const usersData = usersResult.status === 'fulfilled' 
      ? usersResult.value.data || []
      : [];

    const totalArtists = artistsResult.status === 'fulfilled' 
      ? artistsResult.value.count || 0 
      : 0;

    const artistsData = artistsResult.status === 'fulfilled' 
      ? artistsResult.value.data || []
      : [];

    const totalTracks = tracksResult.status === 'fulfilled' 
      ? tracksResult.value.count || 0 
      : 0;

    const tracksData = tracksResult.status === 'fulfilled' 
      ? tracksResult.value.data || []
      : [];

    const activeSubscriptions = subscriptionsResult.status === 'fulfilled' 
      ? subscriptionsResult.value.count || 0 
      : 0;

    // Calcular métricas derivadas
    const verifiedArtists = artistsData.filter(artist => artist.verified).length;
    
    const totalStreams = tracksData.reduce((sum, track) => sum + (track.streams || 0), 0);
    
    const avgStreamsPerTrack = totalTracks > 0 ? Math.round(totalStreams / totalTracks) : 0;

    // Calcular novos usuários hoje
    const today = new Date().toISOString().split('T')[0];
    const newUsersToday = usersData.filter(user => 
      user.created_at?.startsWith(today)
    ).length;

    // Estimativa de receita (baseada nos streams)
    // Fórmula: streams * 0.125 MT (valor médio por stream em Moçambique)
    const totalRevenue = Math.round(totalStreams * 0.125);

    const stats: SmartStats = {
      totalUsers,
      totalArtists,
      totalTracks,
      totalStreams,
      verifiedArtists,
      activeSubscriptions,
      totalRevenue,
      newUsersToday,
      topGenre: 'Afrobeat', // Pode ser calculado futuramente
      avgStreamsPerTrack
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Erro ao buscar stats inteligentes:', error);
    
    // Fallback com dados básicos
    return NextResponse.json({
      totalUsers: 0,
      totalArtists: 0,
      totalTracks: 0,
      totalStreams: 0,
      verifiedArtists: 0,
      activeSubscriptions: 0,
      totalRevenue: 0,
      newUsersToday: 0,
      topGenre: 'Afrobeat',
      avgStreamsPerTrack: 0
    });
  }
}