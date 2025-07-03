import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadImage } from '@/lib/cloudinary';
import type { Database } from '@/types/database';

/**
 * GET /api/albums
 * Busca todos os álbuns
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('search') || '';
    const statusFilter = url.searchParams.get('status') || '';
    const artistIdFilter = url.searchParams.get('artist_id') || '';
    const releaseDateFromFilter = url.searchParams.get('release_date_from') || '';
    const releaseDateToFilter = url.searchParams.get('release_date_to') || '';
    
    // Iniciar a consulta
    let query = supabaseAdmin.from('albums').select('*');
    
    // Aplicar filtros
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }
    
    if (artistIdFilter) {
      query = query.eq('artist_id', artistIdFilter);
    }
    
    if (releaseDateFromFilter) {
      query = query.gte('release_date', releaseDateFromFilter);
    }
    
    if (releaseDateToFilter) {
      query = query.lte('release_date', releaseDateToFilter);
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
    console.error('Erro ao buscar álbuns:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar álbuns' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/albums
 * Cria um novo álbum
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
      const trackCount = Number(formData.get('trackCount') || 0);
      const totalDuration = Number(formData.get('totalDuration') || 0);
      const releaseDate = formData.get('releaseDate') as string || new Date().toISOString();
      const status = formData.get('status') as 'published' | 'draft' | 'removed';
      const coverFile = formData.get('coverFile') as File | null;
      
      // Validação básica
      if (!title || !artistId) {
        return NextResponse.json(
          { error: 'Título e ID do artista são obrigatórios' },
          { status: 400 }
        );
      }
      
      let coverArtUrl: string | null = null;
      
      // Se houver um arquivo de capa, fazer upload para o Cloudinary
      if (coverFile) {
        coverArtUrl = await uploadImage(coverFile, 'eimusic/albums');
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
      const albumData: Database['public']['Tables']['albums']['Insert'] = {
        title,
        artist_id: artistId,
        artist_name: artistData.name,
        track_count: trackCount,
        total_duration: totalDuration,
        plays: 0,
        revenue: 0,
        release_date: releaseDate,
        status,
        cover_art: coverArtUrl,
        created_at: now,
      };
      
      // Inserir no banco de dados
      const { data, error } = await supabaseAdmin
        .from('albums')
        .insert(albumData)
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
      const albumData: Database['public']['Tables']['albums']['Insert'] = {
        title: body.title,
        artist_id: body.artistId,
        artist_name: artistData.name,
        track_count: body.trackCount || 0,
        total_duration: body.totalDuration || 0,
        plays: 0,
        revenue: 0,
        release_date: body.releaseDate || now,
        status: body.status || 'draft',
        cover_art: body.coverArt || null,
        created_at: now,
      };
      
      // Inserir no banco de dados
      const { data, error } = await supabaseAdmin
        .from('albums')
        .insert(albumData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return NextResponse.json(data, { status: 201 });
    }
  } catch (error) {
    console.error('Erro ao criar álbum:', error);
    return NextResponse.json(
      { error: 'Falha ao criar álbum' },
      { status: 500 }
    );
  }
} 