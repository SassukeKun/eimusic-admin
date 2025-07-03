// app/api/albums/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadImage } from '@/lib/cloudinary';
import type { Database } from '@/types/database';

type AlbumUpdate = Database['public']['Tables']['albums']['Update'];

/**
 * GET /api/albums/[id]
 * Busca um álbum pelo ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { data, error } = await supabaseAdmin
      .from('albums')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Álbum não encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Erro ao buscar álbum ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao buscar álbum' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/albums/[id]
 * Atualiza um álbum existente
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Verificar se o álbum existe
    const { data: existingAlbum, error: findError } = await supabaseAdmin
      .from('albums')
      .select('id')
      .eq('id', id)
      .single();
    
    if (findError || !existingAlbum) {
      return NextResponse.json(
        { error: 'Álbum não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar se é uma requisição multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Processar formulário com arquivo
      const formData = await request.formData();
      const title = formData.get('title') as string;
      const artistId = formData.get('artistId') as string;
      const trackCount = Number(formData.get('trackCount') || 0);
      const totalDuration = Number(formData.get('totalDuration') || 0);
      const releaseDate = formData.get('releaseDate') as string;
      const status = formData.get('status') as 'published' | 'draft' | 'removed';
      const coverFile = formData.get('coverFile') as File | null;
      
      const albumData: AlbumUpdate = {
        title,
        track_count: trackCount,
        total_duration: totalDuration,
        status,
        updated_at: new Date().toISOString(),
      };
      
      // Adicionar data de lançamento se fornecida
      if (releaseDate) {
        albumData.release_date = releaseDate;
      }
      
      // Se houver um arquivo de capa, fazer upload para o Cloudinary
      if (coverFile) {
        albumData.cover_art = await uploadImage(coverFile, 'eimusic/albums');
      }
      
      // Se o ID do artista mudou, atualizar o nome do artista
      if (artistId) {
        albumData.artist_id = artistId;
        
        // Buscar o nome do artista
        const { data: artistData, error: artistError } = await supabaseAdmin
          .from('artists')
          .select('name')
          .eq('id', artistId)
          .single();
        
        if (!artistError && artistData) {
          albumData.artist_name = artistData.name;
        }
      }
      
      // Atualizar no banco de dados
      const { data, error } = await supabaseAdmin
        .from('albums')
        .update(albumData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return NextResponse.json(data);
    } else {
      // Processar JSON
      const body = await request.json();
      
      // Preparar dados para atualização
      const albumData: AlbumUpdate = {
        title: body.title,
        track_count: body.trackCount,
        total_duration: body.totalDuration,
        status: body.status,
        release_date: body.releaseDate,
        updated_at: new Date().toISOString(),
      };
      
      // Adicionar capa apenas se fornecida
      if (body.coverArt !== undefined) {
        albumData.cover_art = body.coverArt;
      }
      
      // Se o ID do artista mudou, atualizar o nome do artista
      if (body.artistId) {
        albumData.artist_id = body.artistId;
        
        // Buscar o nome do artista
        const { data: artistData, error: artistError } = await supabaseAdmin
          .from('artists')
          .select('name')
          .eq('id', body.artistId)
          .single();
        
        if (!artistError && artistData) {
          albumData.artist_name = artistData.name;
        }
      }
      
      // Remover campos undefined
      Object.keys(albumData).forEach(key => {
        if (albumData[key as keyof AlbumUpdate] === undefined) {
          delete albumData[key as keyof AlbumUpdate];
        }
      });
      
      // Atualizar no banco de dados
      const { data, error } = await supabaseAdmin
        .from('albums')
        .update(albumData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error(`Erro ao atualizar álbum ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao atualizar álbum' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/albums/[id]
 * Exclui um álbum
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Verificar se o álbum existe
    const { data: existingAlbum, error: findError } = await supabaseAdmin
      .from('albums')
      .select('id')
      .eq('id', id)
      .single();
    
    if (findError || !existingAlbum) {
      return NextResponse.json(
        { error: 'Álbum não encontrado' },
        { status: 404 }
      );
    }
    
    // Primeiro, verificar se há faixas associadas a este álbum
    const { data: tracks, error: tracksError } = await supabaseAdmin
      .from('tracks')
      .select('id')
      .eq('album_id', id);
    
    if (tracksError) {
      throw tracksError;
    }
    
    // Se houver faixas, atualizar para remover a associação com o álbum
    if (tracks && tracks.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('tracks')
        .update({ album_id: null })
        .eq('album_id', id);
      
      if (updateError) {
        throw updateError;
      }
    }
    
    // Agora excluir o álbum
    const { error } = await supabaseAdmin
      .from('albums')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Erro ao excluir álbum ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao excluir álbum' },
      { status: 500 }
    );
  }
}