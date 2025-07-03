import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { Database } from '@/types/database';

type ArtistUpdate = Database['public']['Tables']['artists']['Update'];

/**
 * GET /api/artists/[id]
 * Busca um artista pelo ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { data, error } = await supabaseAdmin
      .from('artists')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Artista não encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Erro ao buscar artista ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao buscar artista' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/artists/[id]
 * Atualiza um artista existente
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Verificar se o artista existe
    const { data: existingArtist, error: findError } = await supabaseAdmin
      .from('artists')
      .select('id')
      .eq('id', id)
      .single();
    
    if (findError || !existingArtist) {
      return NextResponse.json(
        { error: 'Artista não encontrado' },
        { status: 404 }
      );
    }
    
    // Preparar dados para atualização
    const artistData: ArtistUpdate = {
      name: body.name,
      email: body.email,
      profile_image: body.profileImage !== undefined ? body.profileImage : undefined,
      genre: body.genre,
      verified: body.verified !== undefined ? body.verified : undefined,
      status: body.status,
      monetization_plan: body.monetizationPlan,
      payment_method: body.paymentMethod !== undefined ? body.paymentMethod : undefined,
      phone_number: body.phoneNumber !== undefined ? body.phoneNumber : undefined,
      bio: body.bio !== undefined ? body.bio : undefined,
      updated_at: new Date().toISOString(),
    };
    
    // Remover campos undefined
    Object.keys(artistData).forEach(key => {
      if (artistData[key as keyof ArtistUpdate] === undefined) {
        delete artistData[key as keyof ArtistUpdate];
      }
    });
    
    // Atualizar no banco de dados
    const { data, error } = await supabaseAdmin
      .from('artists')
      .update(artistData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Erro ao atualizar artista ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao atualizar artista' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/artists/[id]
 * Exclui um artista
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Verificar se o artista existe
    const { data: existingArtist, error: findError } = await supabaseAdmin
      .from('artists')
      .select('id')
      .eq('id', id)
      .single();
    
    if (findError || !existingArtist) {
      return NextResponse.json(
        { error: 'Artista não encontrado' },
        { status: 404 }
      );
    }
    
    // Excluir do banco de dados
    const { error } = await supabaseAdmin
      .from('artists')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Erro ao excluir artista ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao excluir artista' },
      { status: 500 }
    );
  }
} 