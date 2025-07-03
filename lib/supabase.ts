import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { supabaseConfig } from '@/config/supabase';

// Obter configurações
const { url: supabaseUrl, anonKey: supabaseAnonKey, serviceKey: supabaseServiceKey } = supabaseConfig;

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não estão definidas');
}

// Cliente público (com permissões limitadas)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Cliente de serviço (com permissões administrativas)
// Usado apenas no servidor para operações administrativas
export const supabaseAdmin = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  : supabase;

// Função auxiliar para obter o cliente correto com base no contexto
export const getSupabaseClient = (admin = false) => {
  return admin ? supabaseAdmin : supabase;
}; 