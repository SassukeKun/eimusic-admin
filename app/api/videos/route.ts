import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadImage, uploadVideo } from '@/lib/cloudinary';
import type { Database } from '@/types/database';

/**
 * GET /api/videos
 * Busca todos os vídeos
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('search') || '';
    const statusFilter = url.searchParams.get('status') || '';
    const artistIdFilter = url.searchParams.get('artist_id') || '';
    const uploadDateFromFilter = url.searchParams.get('upload_date_from') || '';
    const uploadDateToFilter = url.searchParams.get('upload_date_to') || '';
    
    // Iniciar a consulta
    let query = supabaseAdmin.from('videos').select('*');
    
    // Aplicar filtros
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    
    if (artistIdFilter) {
      query = query.eq('artist_id', artistIdFilter);
    }
    
    if (uploadDateFromFilter) {
      query = query.gte('upload_date', uploadDateFromFilter);
    }
    
    if (uploadDateToFilter) {
      query = query.lte('upload_date', uploadDateToFilter);
    }
    
    // Aplicar pesquisa
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,artist_name.ilike.%${searchQuery}%`);
    }
    
    // Ordenar por título
    query = query.order('title');
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar vídeos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/videos
 * Cria um novo vídeo
 */
export async function POST(request: Request) {
  try {
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
      
      // Validação básica
      if (!title || !artistId) {
        return NextResponse.json(
          { error: 'Título e ID do artista são obrigatórios' },
          { status: 400 }
        );
      }
      
      let videoUrl: string | null = null;
      let thumbnailUrl: string | null = null;
      
      // Se houver um arquivo de vídeo, fazer upload para o Cloudinary
      if (videoFile) {
        const uploadResult = await uploadVideo(videoFile, 'eimusic/videos');
        videoUrl = uploadResult.videoUrl;
        thumbnailUrl = uploadResult.thumbnailUrl;
      }
      
      // Se houver um arquivo de thumbnail separado, fazer upload para o Cloudinary
      if (thumbnailFile) {
        thumbnailUrl = await uploadImage(thumbnailFile, 'eimusic/videos/thumbnails');
      }
      
      // Buscar o nome do artista
      const { data: artistData, error: artistError } = await supabaseAdmin
        .from('artists')
        .select('name')
        .eq('id', artistId)
        .single();
      
      if (artistError) {
        return NextResponse.json(
          { error: `Artista não encontrado: ${artistError.message}` },
          { status: 404 }
        );
      }
      
      const now = new Date().toISOString();
      
      // Preparar dados para inserção
      const videoData: Database['public']['Tables']['videos']['Insert'] = {
        title,
        artist_id: artistId,
        artist_name: artistData.name,
        duration,
        views: 0,
        revenue: 0,
        upload_date: now,
        status,
        thumbnail_url: thumbnailUrl,
        video_url: videoUrl,
        created_at: now,
      };
      
      // Inserir no banco de dados
      const { data, error } = await supabaseAdmin
        .from('videos')
        .insert(videoData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return NextResponse.json(data, { status: 201 });
    } else {
      // Processar JSON
      const body = await request.json();
      
      // Validação básica
      if (!body.title || !body.artistId) {
        return NextResponse.json(
          { error: 'Título e ID do artista são obrigatórios' },
          { status: 400 }
        );
      }
      
      // Buscar o nome do artista
      const { data: artistData, error: artistError } = await supabaseAdmin
        .from('artists')
        .select('name')
        .eq('id', body.artistId)
        .single();
      
      if (artistError) {
        return NextResponse.json(
          { error: `Artista não encontrado: ${artistError.message}` },
          { status: 404 }
        );
      }
      
      const now = new Date().toISOString();
      
      // Preparar dados para inserção
      const videoData: Database['public']['Tables']['videos']['Insert'] = {
        title: body.title,
        artist_id: body.artistId,
        artist_name: artistData.name,
        duration: body.duration || 0,
        views: 0,
        revenue: 0,
        upload_date: now,
        status: body.status || 'draft',
        thumbnail_url: body.thumbnailUrl || null,
        video_url: body.videoUrl || null,
        created_at: now,
      };
      
      // Inserir no banco de dados
      const { data, error } = await supabaseAdmin
        .from('videos')
        .insert(videoData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return NextResponse.json(data, { status: 201 });
    }
  } catch (error) {
    console.error('Erro ao criar vídeo:', error);
    return NextResponse.json(
      { error: 'Falha ao criar vídeo' },
      { status: 500 }
    );
  }
} 