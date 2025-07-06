// app/api/videos/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET /api/videos
 * Busca todos os vídeos da tabela
 */
export async function GET() {
  try {
    console.log('🔍 Buscando vídeos...');
    
    // Buscar todos os vídeos ordenados por data de criação (mais recentes primeiro)
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro do Supabase:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar vídeos', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Encontrados ${data?.length || 0} vídeos`);
    
    return NextResponse.json(data || []);
    
  } catch (err) {
    console.error('❌ Erro inesperado:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}