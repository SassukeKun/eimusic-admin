import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { Database } from '@/types/database';

/**
 * GET /api/artists
 * Busca todos os artistas
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('search') || '';
    const statusFilter = url.searchParams.get('status') || '';
    const verifiedFilter = url.searchParams.get('verified') || '';
    const planFilter = url.searchParams.get('plan') || '';
    
    // Iniciar a consulta
    let query = supabaseAdmin.from('artists').select('*');
    
    // Aplicar filtros
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    
    if (verifiedFilter) {
      const isVerified = verifiedFilter === 'verified';
      query = query.eq('verified', isVerified);
    }
    
    if (planFilter) {
      query = query.eq('monetization_plan', planFilter);
    }
    
    // Aplicar pesquisa
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,genre.ilike.%${searchQuery}%`);
    }
    
    // Ordenar por nome
    query = query.order('name');
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar artistas:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar artistas' },
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
    const body = await request.json();
    
    // Validação básica
    if (!body.name || !body.email || !body.genre) {
      return NextResponse.json(
        { error: 'Nome, email e gênero são obrigatórios' },
        { status: 400 }
      );
    }
    
    const now = new Date().toISOString();
    
    // Preparar dados para inserção
    const artistData: Database['public']['Tables']['artists']['Insert'] = {
      name: body.name,
      email: body.email,
      profile_image: body.profileImage || null,
      genre: body.genre,
      verified: body.verified || false,
      joined_date: now,
      total_tracks: 0,
      total_revenue: 0,
      status: body.status || 'active',
      monetization_plan: body.monetizationPlan || 'basic',
      payment_method: body.paymentMethod || null,
      phone_number: body.phoneNumber || null,
      bio: body.bio || null,
      created_at: now,
    };
    
    // Inserir no banco de dados
    const { data, error } = await supabaseAdmin
      .from('artists')
      .insert(artistData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar artista:', error);
    return NextResponse.json(
      { error: 'Falha ao criar artista' },
      { status: 500 }
    );
  }
} 