// app/api/tracks/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { TrackDB, Track, TrackUpdateData } from '@/types/tracks';

function mapTrackFromDB(trackDB: TrackDB): Track {
  return {
    id: trackDB.id,
    title: trackDB.title,
    artistId: trackDB.artist_id,
    duration: trackDB.duration,
    fileUrl: trackDB.file_url,
    coverUrl: trackDB.cover_url || undefined,
    albumId: trackDB.album_id || undefined,
    createdAt: trackDB.created_at,
    releaseDate: trackDB.release_date || undefined,
    streams: trackDB.streams,
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Buscar track sem joins problemáticos
    const { data: trackData, error: trackError } = await supabaseAdmin
      .from('tracks')
      .select('*')
      .eq('id', params.id)
      .single();

    if (trackError) {
      if (trackError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Track não encontrado' },
          { status: 404 }
        );
      }
      throw trackError;
    }

    // Buscar artista e álbum separadamente se existirem
    const [artistResult, albumResult] = await Promise.all([
      trackData.artist_id 
        ? supabaseAdmin.from('artists').select('name').eq('id', trackData.artist_id).single()
        : { data: null },
      trackData.album_id
        ? supabaseAdmin.from('albums').select('title').eq('id', trackData.album_id).single()
        : { data: null }
    ]);

    const track = {
      ...mapTrackFromDB(trackData),
      artistName: artistResult.data?.name || 'Artista desconhecido',
      albumTitle: albumResult.data?.title,
    };

    return NextResponse.json(track);

  } catch (error) {
    console.error('Erro ao buscar track:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar track' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔄 Iniciando PATCH /api/tracks/${params.id}`);
    
    const body = await request.json();
    console.log('📋 Body recebido:', body);
    
    const updateData: TrackUpdateData = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.artistId !== undefined) updateData.artist_id = body.artistId;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.fileUrl !== undefined) updateData.file_url = body.fileUrl;
    if (body.coverUrl !== undefined) updateData.cover_url = body.coverUrl;
    if (body.albumId !== undefined) updateData.album_id = body.albumId;
    
    // ✅ CORRIGIDO: Validação correta para data
    if (body.releaseDate !== undefined) {
      // Se for string vazia ou null, definir como null
      if (body.releaseDate === '' || body.releaseDate === null) {
        updateData.release_date = null;
      } else {
        updateData.release_date = body.releaseDate;
      }
    }
    
    if (body.streams !== undefined) updateData.streams = body.streams;

    console.log('📝 Dados para atualizar:', updateData);

    const { data, error } = await supabaseAdmin
      .from('tracks')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro do Supabase:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Track não encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }

    console.log('✅ Track atualizado com sucesso:', data);
    return NextResponse.json(mapTrackFromDB(data));

  } catch (error) {
    console.error('❌ Erro completo ao atualizar track:', {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      details: error instanceof Error ? error.stack : error,
      trackId: params.id
    });
    
    return NextResponse.json(
      { error: 'Falha ao atualizar track' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('tracks')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro ao deletar track:', error);
    return NextResponse.json(
      { error: 'Falha ao deletar track' },
      { status: 500 }
    );
  }
}