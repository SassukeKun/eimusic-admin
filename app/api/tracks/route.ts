// app/api/tracks/route.ts - VERSÃO CORRIGIDA
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { TrackDB, Track, TrackCreateData } from '@/types/tracks';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';
    const artistId = searchParams.get('artistId');
    const albumId = searchParams.get('albumId');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortDir = searchParams.get('sortDir') || 'desc';

    // Query simples sem joins - buscar todas as tracks primeiro
    let query = supabaseAdmin
      .from('tracks')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (artistId) {
      query = query.eq('artist_id', artistId);
    }

    if (albumId) {
      query = query.eq('album_id', albumId);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query
      .order(sortBy, { ascending: sortDir === 'asc' })
      .range(from, to);

    const { data: tracksData, error: tracksError, count } = await query;

    if (tracksError) throw tracksError;

    // Buscar todos os artistas únicos das tracks
    const artistIds = [...new Set(
      (tracksData || [])
        .map(track => track.artist_id)
        .filter(Boolean)
    )];

    // Buscar todos os álbuns únicos das tracks
    const albumIds = [...new Set(
      (tracksData || [])
        .map(track => track.album_id)
        .filter(Boolean)
    )];

    // Queries separadas para buscar nomes
    const [artistsResult, albumsResult] = await Promise.all([
      artistIds.length > 0 
        ? supabaseAdmin.from('artists').select('id, name').in('id', artistIds)
        : { data: [] },
      albumIds.length > 0
        ? supabaseAdmin.from('albums').select('id, title').in('id', albumIds)
        : { data: [] }
    ]);

    // Criar maps para lookup
    const artistsMap = new Map(
      (artistsResult.data || []).map((artist: { id: string; name: string }) => [artist.id, artist.name])
    );
    
    const albumsMap = new Map(
      (albumsResult.data || []).map((album: { id: string; title: string }) => [album.id, album.title])
    );

    // Mapear tracks com nomes
    const tracks = (tracksData || []).map((track) => ({
      ...mapTrackFromDB(track),
      artistName: artistsMap.get(track.artist_id) || 'Artista desconhecido',
      albumTitle: track.album_id ? albumsMap.get(track.album_id) : undefined,
    }));

    const totalPages = Math.ceil((count || 0) / pageSize);

    return NextResponse.json({
      data: tracks,
      total: count || 0,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    });

  } catch (error) {
    console.error('Erro ao buscar tracks:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar tracks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const trackData: TrackCreateData = {
      title: body.title,
      artist_id: body.artistId,
      duration: body.duration || 0,
      file_url: body.fileUrl,
      cover_url: body.coverUrl || null,
      album_id: body.albumId || null,
      // ✅ CORRIGIDO: Validação de data
      release_date: (body.releaseDate && body.releaseDate !== '') ? body.releaseDate : null,
      streams: 0,
    };

    const { data, error } = await supabaseAdmin
      .from('tracks')
      .insert(trackData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(mapTrackFromDB(data));

  } catch (error) {
    console.error('Erro ao criar track:', error);
    return NextResponse.json(
      { error: 'Falha ao criar track' },
      { status: 500 }
    );
  }
}