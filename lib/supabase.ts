import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { supabaseConfig } from '@/config/supabase';

// Obter configurações
const { url: supabaseUrl, anonKey: supabaseAnonKey, serviceKey: supabaseServiceKey } = supabaseConfig;

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO: Variáveis de ambiente do Supabase não estão definidas corretamente');
  console.error('Verifique se NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão configuradas no arquivo .env.local');
}

// Aviso sobre a chave de serviço
if (!supabaseServiceKey) {
  console.warn('AVISO: SUPABASE_SERVICE_ROLE_KEY não está definida. Algumas funcionalidades do servidor podem não funcionar corretamente.');
  console.warn('Adicione SUPABASE_SERVICE_ROLE_KEY ao seu arquivo .env.local para resolver este problema.');
}

// Cliente público (com permissões limitadas)
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Cliente de serviço (com permissões administrativas)
// Usado apenas no servidor para operações administrativas
export const supabaseAdmin = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl || 'https://placeholder-url.supabase.co', supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  : supabase;

// Função auxiliar para obter o cliente correto com base no contexto
export const getSupabaseClient = (admin = false) => {
  return admin ? supabaseAdmin : supabase;
}; 