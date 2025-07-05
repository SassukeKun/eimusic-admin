// src/app/api/admin/test-supabase/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  console.log('📋 [API] Iniciando teste de conexão com Supabase...');
  
  const results = {
    environment: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurado' : 'Não configurado',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configurado' : 'Não configurado',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configurado' : 'Não configurado',
    },
    tests: {
      createClient: false,
      connectWithAnonKey: { success: false, error: null as string | null },
      connectWithServiceKey: { success: false, error: null as string | null },
      listTables: { success: false, error: null as string | null, tables: [] as string[] },
      queryArtists: { success: false, error: null as string | null, count: 0, sample: null as Record<string, unknown> | null }
    }
  };
  
  try {
    // Verificar se podemos criar o cliente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Variáveis de ambiente do Supabase não configuradas');
    }
    
    results.tests.createClient = true;
    
    // Teste com chave anônima
    try {
      const anonClient = createClient(supabaseUrl, supabaseAnonKey);
      const { error } = await anonClient
        .from('artists')
        .select('count')
        .single();
      
      if (error) throw error;
      
      results.tests.connectWithAnonKey.success = true;
    } catch (error) {
      results.tests.connectWithAnonKey.success = false;
      results.tests.connectWithAnonKey.error = error instanceof Error ? error.message : 'Erro desconhecido';
    }
    
    // Teste com chave de serviço
    if (supabaseServiceKey) {
      try {
        const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
        const { error } = await serviceClient
          .from('artists')
          .select('count')
          .single();
        
        if (error) throw error;
        
        results.tests.connectWithServiceKey.success = true;
        
        // Listar tabelas disponíveis
        try {
          const { data: tablesData, error: tablesError } = await serviceClient
            .from('pg_tables')
            .select('tablename')
            .eq('schemaname', 'public');
          
          if (tablesError) throw tablesError;
          
          results.tests.listTables.success = true;
          results.tests.listTables.tables = tablesData.map(t => t.tablename);
        } catch (tablesError) {
          results.tests.listTables.error = tablesError instanceof Error ? tablesError.message : 'Erro desconhecido';
        }
        
        // Testar query na tabela de artistas
        try {
          const { data: artistsData, error: artistsError } = await serviceClient
            .from('artists')
            .select('*')
            .limit(1);
          
          if (artistsError) throw artistsError;
          
          results.tests.queryArtists.success = true;
          results.tests.queryArtists.count = artistsData.length;
          results.tests.queryArtists.sample = artistsData[0] || null;
        } catch (artistsError) {
          results.tests.queryArtists.error = artistsError instanceof Error ? artistsError.message : 'Erro desconhecido';
        }
      } catch (error) {
        results.tests.connectWithServiceKey.success = false;
        results.tests.connectWithServiceKey.error = error instanceof Error ? error.message : 'Erro desconhecido';
      }
    }
    
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('❌ [API] Erro nos testes do Supabase:', error);
    return NextResponse.json({
      ...results,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}