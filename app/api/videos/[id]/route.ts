import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadImage, uploadVideo } from '@/lib/cloudinary';
import type { Database } from '@/types/database';

type VideoUpdate = Database['public']['Tables']['videos']['Update'];

/**
 * GET /api/videos/[id]
 * Busca um vídeo pelo ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { data, error } = await supabaseAdmin
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Vídeo não encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Erro ao buscar vídeo ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao buscar vídeo' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/videos/[id]
 * Atualiza um vídeo existente
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Verificar se o vídeo existe
    const { data: existingVideo, error: findError } = await supabaseAdmin
      .from('videos')
      .select('id')
      .eq('id', id)
      .single();
    
    if (findError || !existingVideo) {
      return NextResponse.json(
        { error: 'Vídeo não encontrado' },
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
      const duration = Number(formData.get('duration') || 0);
      const status = formData.get('status') as 'published' | 'draft' | 'removed';
      const videoFile = formData.get('videoFile') as File | null;
      const thumbnailFile = formData.get('thumbnailFile') as File | null;
      
      const videoData: VideoUpdate = {
        title,
        duration,
        status,
        updated_at: new Date().toISOString(),
      };
      
      let videoUrl: string | null = null;
      let thumbnailUrl: string | null = null;
      
      // Se houver um arquivo de vídeo, fazer upload para o Cloudinary
      if (videoFile) {
        const uploadResult = await uploadVideo(videoFile, 'eimusic/videos');
        videoUrl = uploadResult.videoUrl;
        thumbnailUrl = uploadResult.thumbnailUrl;
        
        videoData.video_url = videoUrl;
        videoData.thumbnail_url = thumbnailUrl;
      }
      
      // Se houver um arquivo de thumbnail separado, fazer upload para o Cloudinary
      if (thumbnailFile) {
        thumbnailUrl = await uploadImage(thumbnailFile, 'eimusic/videos/thumbnails');
        videoData.thumbnail_url = thumbnailUrl;
      }
      
      // Se o ID do artista mudou, atualizar o nome do artista
      if (artistId) {
        videoData.artist_id = artistId;
        
        // Buscar o nome do artista
        const { data: artistData, error: artistError } = await supabaseAdmin
          .from('artists')
          .select('name')
          .eq('id', artistId)
          .single();
        
        if (!artistError && artistData) {
          videoData.artist_name = artistData.name;
        }
      }
      
      // Atualizar no banco de dados
      const { data, error } = await supabaseAdmin
        .from('videos')
        .update(videoData)
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
      const videoData: VideoUpdate = {
        title: body.title,
        duration: body.duration,
        status: body.status,
        updated_at: new Date().toISOString(),
      };
      
      // Adicionar URLs apenas se fornecidas
      if (body.thumbnailUrl !== undefined) {
        videoData.thumbnail_url = body.thumbnailUrl;
      }
      
      if (body.videoUrl !== undefined) {
        videoData.video_url = body.videoUrl;
      }
      
      // Se o ID do artista mudou, atualizar o nome do artista
      if (body.artistId) {
        videoData.artist_id = body.artistId;
        
        // Buscar o nome do artista
        const { data: artistData, error: artistError } = await supabaseAdmin
          .from('artists')
          .select('name')
          .eq('id', body.artistId)
          .single();
        
        if (!artistError && artistData) {
          videoData.artist_name = artistData.name;
        }
      }
      
      // Remover campos undefined
      Object.keys(videoData).forEach(key => {
        if (videoData[key as keyof VideoUpdate] === undefined) {
          delete videoData[key as keyof VideoUpdate];
        }
      });
      
      // Atualizar no banco de dados
      const { data, error } = await supabaseAdmin
        .from('videos')
        .update(videoData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error(`Erro ao atualizar vídeo ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao atualizar vídeo' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/videos/[id]
 * Exclui um vídeo
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Verificar se o vídeo existe
    const { data: existingVideo, error: findError } = await supabaseAdmin
      .from('videos')
      .select('id')
      .eq('id', id)
      .single();
    
    if (findError || !existingVideo) {
      return NextResponse.json(
        { error: 'Vídeo não encontrado' },
        { status: 404 }
      );
    }
    
    // Excluir o vídeo
    const { error } = await supabaseAdmin
      .from('videos')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Erro ao excluir vídeo ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao excluir vídeo' },
      { status: 500 }
    );
  }
} 