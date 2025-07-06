import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET /api/videos/[id]
 * Busca um vídeo específico pelo ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do vídeo é obrigatório' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
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
      
      return NextResponse.json(
        { error: 'Erro ao buscar vídeo', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
    
  } catch (err) {
    console.error('❌ Erro inesperado:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/videos/[id]
 * Atualiza um vídeo específico
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Verificar se o ID foi fornecido
    if (!id) {
      return NextResponse.json(
        { error: 'ID do vídeo é obrigatório' },
        { status: 400 }
      );
    }

    // Obter dados do corpo da requisição
    const body = await request.json();
    
    console.log(`🔄 Atualizando vídeo ${id} com dados:`, body);

    // Validar campos obrigatórios
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      );
    }

    // Preparar dados para atualização
    const updateData: {
      title: string;
      duration: number;
      is_video_clip: boolean;
      description?: string | null;
      genre?: string | null;
    } = {
      title: body.title.trim(),
      duration: body.duration || 0,
      is_video_clip: body.is_video_clip || false,
    };

    // Adicionar campos opcionais apenas se fornecidos
    if (body.description !== undefined) {
      updateData.description = body.description.trim() || null;
    }
    
    if (body.genre !== undefined) {
      updateData.genre = body.genre.trim() || null;
    }

    // Executar atualização no Supabase
    const { data, error } = await supabase
      .from('videos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Erro do Supabase:', error);
      
      // Verificar se o vídeo não foi encontrado
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Vídeo não encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Erro ao atualizar vídeo', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Vídeo atualizado com sucesso:', data);
    
    return NextResponse.json(data);
    
  } catch (err) {
    console.error('❌ Erro inesperado:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/videos/[id]
 * Exclui um vídeo específico
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do vídeo é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Deletando vídeo ${id}...`);

    // Verificar se o vídeo existe antes de deletar
    const { data: existingVideo, error: findError } = await supabase
      .from('videos')
      .select('id, title')
      .eq('id', id)
      .single();

    if (findError || !existingVideo) {
      return NextResponse.json(
        { error: 'Vídeo não encontrado' },
        { status: 404 }
      );
    }

    // Executar exclusão
    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('❌ Erro ao deletar:', deleteError);
      return NextResponse.json(
        { error: 'Erro ao deletar vídeo', details: deleteError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Vídeo "${existingVideo.title}" deletado com sucesso`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Vídeo deletado com sucesso' 
    });
    
  } catch (err) {
    console.error('❌ Erro inesperado ao deletar:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}