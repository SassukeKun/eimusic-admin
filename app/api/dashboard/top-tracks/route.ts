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
 * Busca as faixas mais populares (com mais reproduções) do banco REAL
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    
    // Buscar faixas reais ordenadas por número de reproduções (streams)
    const { data, error } = await supabaseAdmin
      .from('singles')
      .select(`
        id,
        title,
        streams,
        artist:artists(name)
      `)
      .not('streams', 'is', null)
      .order('streams', { ascending: false })
      .limit(Math.min(limit, 20)); // Máximo 20 para performance
    
    if (error) {
      console.error('Erro do Supabase ao buscar faixas:', error);
      throw error;
    }
    
    // Mapear para o formato da resposta com dados reais
    const topTracks: TopTrack[] = (data || []).map(track => {
      // Calcular receita estimada baseada nos streams
      // Fórmula: streams * 0.125 MT (valor típico por stream em Moçambique)
      const estimatedRevenue = Math.round((track.streams || 0) * 0.125);
      
      return {
        id: track.id,
        title: track.title,
        artist: track.artist?.[0]?.name || 'Artista desconhecido',
        plays: track.streams || 0,
        revenue: estimatedRevenue
      };
    });
    
    return NextResponse.json(topTracks);
  } catch (error) {
    console.error('Erro ao buscar faixas populares:', error);
    
    // Retornar array vazio em caso de erro para não quebrar o UI
    return NextResponse.json([]);
  }
}