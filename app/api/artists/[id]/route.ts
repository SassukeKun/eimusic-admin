// app/api/artists/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { ArtistUpdateData } from '@/types/artists';
import { mapArtistFromDB } from '@/types/artists';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { data: artistData, error: artistError } = await supabaseAdmin
      .from('artists')
      .select('*')
      .eq('id', id)
      .single();

    if (artistError) {
      if (artistError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Artista não encontrado' },
          { status: 404 }
        );
      }
      throw artistError;
    }

    // Buscar plano de monetização se existir
    let monetizationPlanName;
    if (artistData.monetization_plan_id) {
      const { data: planData } = await supabaseAdmin
        .from('monetization_plans')
        .select('name')
        .eq('id', artistData.monetization_plan_id)
        .single();
      
      monetizationPlanName = planData?.name;
    }

    // Buscar estatísticas do artista
    const [tracksResult, albumsResult] = await Promise.all([
      supabaseAdmin
        .from('tracks')
        .select('streams')
        .eq('artist_id', id),
      supabaseAdmin
        .from('albums')
        .select('id')
        .eq('artist_id', id)
    ]);

    const totalTracks = tracksResult.data?.length || 0;
    const totalAlbums = albumsResult.data?.length || 0;
    const totalStreams = tracksResult.data?.reduce((sum, track) => sum + (track.streams || 0), 0) || 0;

    const artist = {
      ...mapArtistFromDB(artistData),
      monetizationPlanName,
      totalTracks,
      totalAlbums,
      totalStreams,
    };

    return NextResponse.json(artist);

  } catch (error) {
    console.error('Erro ao buscar artist:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar artista' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`🔄 Iniciando PATCH /api/artists/${id}`);
    
    const body = await request.json();
    console.log('📋 Body recebido:', body);
    
    const updateData: ArtistUpdateData = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.bio !== undefined) updateData.bio = body.bio || null;
    if (body.phone !== undefined) updateData.phone = body.phone || null;
    if (body.monetizationPlanId !== undefined) {
      updateData.monetization_plan_id = body.monetizationPlanId || null;
    }
    if (body.profileImageUrl !== undefined) {
      updateData.profile_image_url = body.profileImageUrl || null;
    }
    if (body.socialLinks !== undefined) {
      updateData.social_links = body.socialLinks || null;
    }
    if (body.verified !== undefined) updateData.verified = body.verified;
    if (body.subscribers !== undefined) updateData.subscribers = body.subscribers;
    if (body.province !== undefined) updateData.province = body.province || null;

    console.log('📝 Dados para atualizar:', updateData);

    const { data, error } = await supabaseAdmin
      .from('artists')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro do Supabase:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Artista não encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }

    console.log('✅ Artista atualizado com sucesso:', data);
    return NextResponse.json(mapArtistFromDB(data));

  } catch (error) {
    console.error('❌ Erro completo ao atualizar artista:', {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      details: error instanceof Error ? error.stack : error,
    });
    
    return NextResponse.json(
      { error: 'Falha ao atualizar artista' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verificar se o artista tem conteúdo associado
    const [tracksCount, albumsCount] = await Promise.all([
      supabaseAdmin
        .from('tracks')
        .select('id', { count: 'exact', head: true })
        .eq('artist_id', id),
      supabaseAdmin
        .from('albums')
        .select('id', { count: 'exact', head: true })
        .eq('artist_id', id)
    ]);

    if ((tracksCount.count || 0) > 0 || (albumsCount.count || 0) > 0) {
      return NextResponse.json(
        { 
          error: 'Não é possível excluir artista com conteúdo associado',
          details: `Este artista possui ${tracksCount.count || 0} faixas e ${albumsCount.count || 0} álbuns`
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('artists')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro ao deletar artist:', error);
    return NextResponse.json(
      { error: 'Falha ao deletar artista' },
      { status: 500 }
    );
  }
}