// app/api/dashboard/top-tracks/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/dashboard/top-tracks
 * Busca as faixas mais populares
 */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('tracks')
      .select('id, title, artist_name, plays, revenue')
      .order('plays', { ascending: false })
      .limit(5);

    if (error) throw error;

    // Mapear dados para o formato esperado pelo front-end
    const topTracks = data.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist_name,
      plays: track.plays,
      revenue: track.revenue,
    }));

    return NextResponse.json(topTracks);
  } catch (error) {
    console.error('Erro ao buscar faixas populares:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar faixas populares' },
      { status: 500 }
    );
  }
}