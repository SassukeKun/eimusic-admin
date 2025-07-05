// app/api/albums/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * PATCH /api/albums/[id]
 * Atualiza um álbum existente
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('📝 API: Atualizando álbum', id);
    
    const body = await request.json();
    console.log('📊 Dados recebidos:', body);
    
    // ✅ CORRIGIDO: Mapear campos para snake_case do banco
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.artistName !== undefined) updateData.artist_name = body.artistName;
    if (body.trackCount !== undefined) updateData.track_count = body.trackCount;
    if (body.releaseDate !== undefined) updateData.release_date = body.releaseDate;
    if (body.visibility !== undefined) updateData.visibility = body.visibility;
    if (body.isExplicit !== undefined) updateData.is_explicit = body.isExplicit;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.coverArt !== undefined) updateData.cover_url = body.coverArt; // ✅ IMPORTANTE: coverArt -> cover_url
    
    console.log('🔄 Dados formatados para o banco:', updateData);
    
    const { data, error } = await supabaseAdmin
      .from('albums')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro do Supabase:', error);
      throw error;
    }
    
    console.log('✅ Álbum atualizado com sucesso:', data);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ Erro na API de atualização:', error);
    return NextResponse.json(
      { error: 'Falha ao atualizar álbum' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/albums/[id]
 * Busca um álbum pelo ID
 */
export async function GET(
  request: NextRequest,
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
    console.error(`❌ Erro ao buscar álbum ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao buscar álbum' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/albums/[id]
 * Exclui um álbum
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { error } = await supabaseAdmin
      .from('albums')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`❌ Erro ao excluir álbum ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao excluir álbum' },
      { status: 500 }
    );
  }
}