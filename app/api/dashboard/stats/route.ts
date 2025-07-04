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

    // Buscar soma de receitas (das transações)
    const { data: revenueData, error: revenueError } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .not('status', 'eq', 'refunded');

    if (revenueError) throw revenueError;

    // Calcular receita total
    const totalRevenue = revenueData.reduce((sum, transaction) => sum + transaction.amount, 0);

    // Calcular crescimento mensal (simplificado)
    // Em um cenário real, você compararia com o mês anterior
    const monthlyGrowth = {
      users: 5.2,    // Exemplo - seria calculado com base em dados reais
      artists: 3.8,   // Exemplo - seria calculado com base em dados reais
      tracks: 7.5,    // Exemplo - seria calculado com base em dados reais
      revenue: 8.9,   // Exemplo - seria calculado com base em dados reais
    };

    // Montar objeto de estatísticas
    const stats: DashboardStats = {
      totalUsers: totalUsers || 0,
      totalArtists: totalArtists || 0,
      totalTracks: totalTracks || 0,
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