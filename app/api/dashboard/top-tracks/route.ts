// app/api/dashboard/top-tracks/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Interface para faixas populares
 */
interface TopTrack {
  id: string;
  title: string;
  artist: string;
  plays: number;
  revenue: number;
}

/**
 * GET /api/dashboard/top-tracks
 * Busca as faixas mais populares (com mais reproduções)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    
    // Buscar faixas ordenadas por número de reproduções (mais populares primeiro)
    const { data, error } = await supabaseAdmin
      .from('tracks')
      .select('id, title, artist_name, plays, revenue')
      .order('plays', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Mapear para o formato da resposta
    const topTracks: TopTrack[] = (data || []).map(track => ({
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