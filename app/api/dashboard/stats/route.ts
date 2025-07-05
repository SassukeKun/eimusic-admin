// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { DashboardStats } from '@/types/admin';

/**
 * GET /api/dashboard/stats
 * Busca estatísticas para o dashboard
 */
export async function GET() {
  try {
    // Buscar total de usuários
    const { count: totalUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    // Buscar total de artistas
    const { count: totalArtists, error: artistsError } = await supabaseAdmin
      .from('artists')
      .select('*', { count: 'exact', head: true });

    if (artistsError) throw artistsError;

    // Buscar total de faixas
    const { count: totalTracks, error: tracksError } = await supabaseAdmin
      .from('tracks')
      .select('*', { count: 'exact', head: true });

    if (tracksError) throw tracksError;

    // Buscar total de vídeos
    const { count: totalVideos, error: videosError } = await supabaseAdmin
      .from('videos')
      .select('*', { count: 'exact', head: true });

    if (videosError) throw videosError;

    // Buscar soma de receitas (das transações)
    const { data: revenueData, error: revenueError } = await supabaseAdmin
      .from('revenue_transactions')
      .select('amount')
      .not('status', 'eq', 'refunded');

    if (revenueError) throw revenueError;

    // Calcular receita total
    const totalRevenue = revenueData?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;

    // Buscar dados do mês atual para cálculo de crescimento
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    
    // Usuários criados este mês
    const { count: newUsersThisMonth, error: newUsersError } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayOfMonth);

    if (newUsersError) throw newUsersError;

    // Artistas criados este mês
    const { count: newArtistsThisMonth, error: newArtistsError } = await supabaseAdmin
      .from('artists')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayOfMonth);

    if (newArtistsError) throw newArtistsError;

    // Faixas criadas este mês
    const { count: newTracksThisMonth, error: newTracksError } = await supabaseAdmin
      .from('tracks')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayOfMonth);

    if (newTracksError) throw newTracksError;

    // Receita deste mês
    const { data: revenueThisMonth, error: revenueThisMonthError } = await supabaseAdmin
      .from('revenue_transactions')
      .select('amount')
      .gte('date', firstDayOfMonth)
      .not('status', 'eq', 'refunded');

    if (revenueThisMonthError) throw revenueThisMonthError;

    const totalRevenueThisMonth = revenueThisMonth?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;

    // Calcular crescimento mensal
    // Em um cenário real, você compararia com o mês anterior
    // Aqui estamos calculando a porcentagem de novos itens em relação ao total
    const calculateGrowth = (newItems: number, totalItems: number) => {
      if (totalItems === 0) return 0;
      return parseFloat(((newItems / totalItems) * 100).toFixed(1));
    };

    const monthlyGrowth = {
      users: calculateGrowth(newUsersThisMonth || 0, totalUsers || 1),
      artists: calculateGrowth(newArtistsThisMonth || 0, totalArtists || 1),
      tracks: calculateGrowth(newTracksThisMonth || 0, totalTracks || 1),
      revenue: totalRevenue > 0 ? parseFloat(((totalRevenueThisMonth / totalRevenue) * 100).toFixed(1)) : 0,
    };

    // Montar objeto de estatísticas
    const stats: DashboardStats = {
      totalUsers: totalUsers || 0,
      totalArtists: totalArtists || 0,
      totalTracks: totalTracks || 0,
      totalVideos: totalVideos || 0,
      totalRevenue: totalRevenue || 0,
      monthlyGrowth,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar estatísticas do dashboard' },
      { status: 500 }
    );
  }
}