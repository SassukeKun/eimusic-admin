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
 * Busca os artistas mais recentes
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    
    // Buscar artistas ordenados por data de criação (mais recentes primeiro)
    const { data, error } = await supabaseAdmin
      .from('artists')
      .select('id, name, genre, profile_image, joined_date')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Mapear para o formato da resposta
    const recentArtists: RecentArtist[] = (data || []).map(artist => ({
      id: artist.id,
      name: artist.name,
      genre: artist.genre,
      image: artist.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=6366f1&color=fff`,
      joinedDate: artist.joined_date,
    }));
    
    return NextResponse.json(recentArtists);
  } catch (error) {
    console.error('Erro ao buscar artistas recentes:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar artistas recentes' },
      { status: 500 }
    );
  }
}