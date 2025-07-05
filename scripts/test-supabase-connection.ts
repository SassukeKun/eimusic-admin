// scripts/test-supabase-connection.ts
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabase';

/**
 * Script para testar a conexão com o Supabase
 * 
 * Executar com: npx ts-node scripts/test-supabase-connection.ts
 * 
 * Certifique-se de que as variáveis de ambiente estão configuradas:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

async function main() {
  try {
    // Obter configurações
    const { url: supabaseUrl, anonKey: supabaseAnonKey } = supabaseConfig;
    
    console.log('Configuração do Supabase:');
    console.log(`URL: ${supabaseUrl || 'Não configurada'}`);
    console.log(`Chave Anônima: ${supabaseAnonKey ? 'Configurada' : 'Não configurada'}`);
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('\nErro: Variáveis de ambiente do Supabase não estão definidas');
      process.exit(1);
    }
    
    // Criar cliente
    console.log('\nCriando cliente Supabase...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Testar conexão
    console.log('Testando conexão...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    console.log('\nConexão bem-sucedida!');
    console.log(`Sessão atual: ${data.session ? 'Autenticado' : 'Não autenticado'}`);
    
    // Testar autenticação
    console.log('\nTestando autenticação com email/senha...');
    const testEmail = 'admin@eimusic.co.mz';
    const testPassword = 'admin123';
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    if (authError) {
      console.error(`\nErro ao autenticar com ${testEmail}: ${authError.message}`);
      
      // Verificar se o usuário existe
      console.log('\nVerificando se o usuário existe...');
      
      // Criar cliente com chave de serviço (admin)
      const { serviceKey } = supabaseConfig;
      if (!serviceKey) {
        console.error('Erro: Chave de serviço não configurada');
        process.exit(1);
      }
      
      const adminClient = createClient(supabaseUrl, serviceKey);
      
      try {
        const { data: userData, error: userError } = await adminClient.auth.admin.listUsers();
        
        if (userError) {
          throw userError;
        }
        
        // Corrige tipagem para evitar erro TS2339
        const user = (userData.users as { email: string }[]).find(u => u.email === testEmail);
        
        if (user) {
          console.log(`Usuário ${testEmail} existe no Supabase.`);
          console.log('O problema pode ser com a senha ou com as permissões.');
        } else {
          console.log(`Usuário ${testEmail} NÃO existe no Supabase.`);
          console.log('Execute o script create-test-user.ts para criar o usuário de teste.');
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      }
    } else {
      console.log('\nAutenticação bem-sucedida!');
      console.log(`Usuário: ${authData.user?.email}`);
      console.log(`ID: ${authData.user?.id}`);
    }

    // Testar leitura da tabela "albums" com a chave anon
    console.log('\nTestando leitura da tabela "albums"...');
    const { data: albums, error: albumsError } = await supabase
      .from('albums')
      .select('*');
    if (albumsError) {
      console.error('Erro ao buscar álbuns:', albumsError.message);
    } else {
      console.log(`Álbuns encontrados: ${albums.length}`);
      console.dir(albums, { depth: null });
    }
  } catch (error) {
    console.error('\nErro ao testar conexão:', error);
    process.exit(1);
  }
}

main();