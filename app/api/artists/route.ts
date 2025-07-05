import { NextResponse } from 'next/server';
import { fetchAllArtists, fetchArtistsWithFilters, createArtist } from '@/services/artists';
import { supabaseAdmin } from '@/lib/supabase';
import type { ArtistFormData } from '@/types/modal';

/**
 * GET /api/artists
 * Lista todos os artistas com suporte a filtros e busca
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || undefined;
    
    // Extrair filtros dos parâmetros de consulta
    const filters: Record<string, string> = {};
    
    // Filtros possíveis: status, genre, verified, monetization_plan
    ['status', 'genre', 'verified', 'monetization_plan'].forEach(key => {
      const value = searchParams.get(key);
      if (value) filters[key] = value;
    });
    
    // Se houver filtros ou busca, usar a função de filtros
    const artists = Object.keys(filters).length > 0 || searchQuery
      ? await fetchArtistsWithFilters(filters, searchQuery)
      : await fetchAllArtists();
    
    return NextResponse.json(artists);
  } catch (error) {
    console.error('Erro ao listar artistas:', error);
    return NextResponse.json(
      { error: 'Falha ao listar artistas' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/artists
 * Cria um novo artista
 */
export async function POST(request: Request) {
  try {
    const formData = await request.json() as ArtistFormData;
    
    // Validar dados obrigatórios
    if (!formData.name || !formData.email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Verificar se já existe um artista com o mesmo email
    const { data: existingArtist } = await supabaseAdmin
      .from('artists')
      .select('id')
      .eq('email', formData.email)
      .single();
    
    if (existingArtist) {
      return NextResponse.json(
        { error: 'Já existe um artista com este email' },
        { status: 409 }
      );
    }
    
    // Criar o artista
    const newArtist = await createArtist(formData);
    
    return NextResponse.json(newArtist, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar artista:', error);
    return NextResponse.json(
      { error: 'Falha ao criar artista' },
      { status: 500 }
    );
  }
} 