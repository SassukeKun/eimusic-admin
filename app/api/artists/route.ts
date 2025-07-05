// src/app/api/admin/artists/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Função para criar cliente Supabase com chave de serviço para bypass de RLS
function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Variáveis de ambiente do Supabase não configuradas');
    throw new Error('Configuração do Supabase incompleta');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET - Listar artistas
export async function GET(request: Request) {
  console.log('📋 [API] Iniciando GET /api/admin/artists...');
  
  try {
    const supabase = createServiceRoleClient();
    
    // Extrair parâmetros de query
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    // Construir query
    let dbQuery = supabase
      .from('artists')
      .select('*');
    
    // Adicionar filtros se necessário
    if (query) {
      dbQuery = dbQuery.ilike('name', `%${query}%`);
    }
    
    // Executar query
    const { data, error } = await dbQuery;
    
    if (error) {
      console.error('❌ [API] Erro ao buscar artistas:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log(`✅ [API] ${data?.length || 0} artistas encontrados`);
    return NextResponse.json(data || []);
    
  } catch (error) {
    console.error('❌ [API] Erro não tratado:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST - Criar artista
export async function POST(request: Request) {
  console.log('📋 [API] Iniciando POST /api/admin/artists...');
  
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();
    
    // Validação básica
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Inserir artista
    const { data, error } = await supabase
      .from('artists')
      .insert({
        name: body.name,
        email: body.email,
        verified: body.verified || false,
        bio: body.bio || null,
        phone: body.phone || null
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ [API] Erro ao criar artista:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('✅ [API] Artista criado com sucesso:', data?.id);
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error('❌ [API] Erro não tratado:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT - Atualizar artista
export async function PUT(request: Request) {
  console.log('📋 [API] Iniciando PUT /api/admin/artists...');
  
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();
    
    // Validação básica
    if (!body.id || !body.name || !body.email) {
      return NextResponse.json(
        { error: 'ID, nome e email são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Atualizar artista
    const { data, error } = await supabase
      .from('artists')
      .update({
        name: body.name,
        email: body.email,
        verified: body.verified,
        bio: body.bio || null,
        phone: body.phone || null
      })
      .eq('id', body.id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ [API] Erro ao atualizar artista:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('✅ [API] Artista atualizado com sucesso:', data?.id);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ [API] Erro não tratado:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE - Excluir artista
export async function DELETE(request: Request) {
  console.log('📋 [API] Iniciando DELETE /api/admin/artists...');
  
  try {
    // Extrair parâmetros
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do artista é obrigatório' },
        { status: 400 }
      );
    }
    
    const supabase = createServiceRoleClient();
    
    // Excluir artista
    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ [API] Erro ao excluir artista:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('✅ [API] Artista excluído com sucesso:', id);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('❌ [API] Erro não tratado:', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}