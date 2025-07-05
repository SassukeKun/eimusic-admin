// app/api/dashboard/recent-artists/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Interface para artistas recentes
 */
interface RecentArtist {
  id: string;
  name: string;
  genre: string;
  image: string;
  joinedDate: string;
}

/**
 * GET /api/dashboard/recent-artists
 * Busca os artistas mais recentes do banco de dados REAL
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    
    // Buscar artistas reais ordenados por data de criação (mais recentes primeiro)
    const { data, error } = await supabaseAdmin
      .from('artists')
      .select(`
        id,
        name,
        genre,
        profile_image,
        created_at,
        joined_date
      `)
      .order('created_at', { ascending: false })
      .limit(Math.min(limit, 20)); // Máximo 20 para performance
    
    if (error) {
      console.error('Erro do Supabase ao buscar artistas:', error);
      throw error;
    }
    
    // Mapear para o formato da resposta com dados reais
    const recentArtists: RecentArtist[] = (data || []).map(artist => {
      // Gerar avatar padrão se não houver imagem
      const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=6366f1&color=fff&size=100`;
      
      return {
        id: artist.id,
        name: artist.name,
        genre: artist.genre || 'Género não definido',
        image: artist.profile_image || defaultAvatar,
        joinedDate: artist.joined_date || artist.created_at
      };
    });
    
    return NextResponse.json(recentArtists);
  } catch (error) {
    console.error('Erro ao buscar artistas recentes:', error);
    
    // Retornar array vazio em caso de erro para não quebrar o UI
    return NextResponse.json([]);
  }
}