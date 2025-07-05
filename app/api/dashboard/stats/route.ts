// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Interface para estatísticas do dashboard
 */
interface DashboardStats {
  totalArtists: number;
  totalTracks: number;
  totalAlbums: number;
  totalVideos: number;
  totalUsers: number;
  totalPlays: number;
  totalRevenue: number;
}

/**
 * GET /api/dashboard/stats
 * Busca estatísticas gerais REAIS do banco de dados
 */
export async function GET() {
  try {
    // Buscar dados reais do Supabase em paralelo para melhor performance
    const [
      artistsResult,
      tracksResult, 
      albumsResult,
      videosResult,
      usersResult,
      playsResult,
      revenueResult
    ] = await Promise.allSettled([
      // Contar total de artistas
      supabaseAdmin
        .from('artists')
        .select('*', { count: 'exact', head: true }),
      
      // Contar total de faixas/singles
      supabaseAdmin
        .from('singles')
        .select('*', { count: 'exact', head: true }),
      
      // Contar total de álbuns
      supabaseAdmin
        .from('albums')
        .select('*', { count: 'exact', head: true }),
      
      // Contar total de vídeos
      supabaseAdmin
        .from('videos')
        .select('*', { count: 'exact', head: true }),
      
      // Contar total de usuários
      supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true }),
      
      // Somar total de reproduções (streams) das faixas
      supabaseAdmin
        .from('singles')
        .select('streams')
        .not('streams', 'is', null),
      
      // Somar receita total dos artistas
      supabaseAdmin
        .from('artists')
        .select('total_revenue')
        .not('total_revenue', 'is', null)
    ]);

    // Extrair contagens com fallback para 0
    const totalArtists = artistsResult.status === 'fulfilled' 
      ? artistsResult.value.count || 0 
      : 0;
    
    const totalTracks = tracksResult.status === 'fulfilled' 
      ? tracksResult.value.count || 0 
      : 0;
    
    const totalAlbums = albumsResult.status === 'fulfilled' 
      ? albumsResult.value.count || 0 
      : 0;
    
    const totalVideos = videosResult.status === 'fulfilled' 
      ? videosResult.value.count || 0 
      : 0;
    
    const totalUsers = usersResult.status === 'fulfilled' 
      ? usersResult.value.count || 0 
      : 0;

    // Calcular total de reproduções
    let totalPlays = 0;
    if (playsResult.status === 'fulfilled' && playsResult.value.data) {
      totalPlays = playsResult.value.data.reduce((sum, track) => {
        return sum + (track.streams || 0);
      }, 0);
    }

    // Calcular receita total
    let totalRevenue = 0;
    if (revenueResult.status === 'fulfilled' && revenueResult.value.data) {
      totalRevenue = revenueResult.value.data.reduce((sum, artist) => {
        return sum + (artist.total_revenue || 0);
      }, 0);
    }

    const stats: DashboardStats = {
      totalArtists,
      totalTracks,
      totalAlbums,
      totalVideos,
      totalUsers,
      totalPlays,
      totalRevenue
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    
    // Retornar dados de fallback em caso de erro
    const fallbackStats: DashboardStats = {
      totalArtists: 0,
      totalTracks: 0,
      totalAlbums: 0,
      totalVideos: 0,
      totalUsers: 0,
      totalPlays: 0,
      totalRevenue: 0
    };
    
    return NextResponse.json(fallbackStats);
  }
}