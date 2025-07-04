// app/api/dashboard/recent-artists/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/dashboard/recent-artists
 * Busca os artistas mais recentes
 */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('artists')
      .select('id, name, genre, profile_image, joined_date')
      .order('joined_date', { ascending: false })
      .limit(5);

    if (error) throw error;

    // Mapear dados para o formato esperado pelo front-end
    const recentArtists = data.map(artist => ({
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