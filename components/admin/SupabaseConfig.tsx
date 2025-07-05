'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { supabaseConfig } from '@/config/supabase';

export default function SupabaseConfig() {
  const [configStatus, setConfigStatus] = useState<{
    url: string;
    anonKeyPresent: boolean;
    serviceKeyPresent: boolean;
    connectionTest: 'pending' | 'success' | 'error';
    error?: string;
  }>({
    url: '',
    anonKeyPresent: false,
    serviceKeyPresent: false,
    connectionTest: 'pending',
  });

  useEffect(() => {
    const checkConfig = async () => {
      const { url, anonKey, serviceKey } = supabaseConfig;
      
      // Verificar configuração básica
      const config = {
        url: url || 'Não configurado',
        anonKeyPresent: !!anonKey,
        serviceKeyPresent: !!serviceKey,
        connectionTest: 'pending' as const,
      };
      
      setConfigStatus(config);
      
      // Testar conexão
      if (url && anonKey) {
        try {
          const supabase = createClientComponentClient();
          const { error } = await supabase.from('_dummy_query').select('*').limit(1);
          
          if (error && !error.message.includes('does not exist')) {
            setConfigStatus(prev => ({
              ...prev,
              connectionTest: 'error',
              error: error.message
            }));
          } else {
            setConfigStatus(prev => ({
              ...prev,
              connectionTest: 'success'
            }));
          }
        } catch (error) {
          setConfigStatus(prev => ({
            ...prev,
            connectionTest: 'error',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          }));
        }
      }
    };
    
    checkConfig();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Configuração do Supabase</h2>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="font-medium w-32">URL:</span>
          <span className="text-gray-700">{configStatus.url}</span>
        </div>
        
        <div className="flex items-center">
          <span className="font-medium w-32">Chave Anônima:</span>
          <span className={`${configStatus.anonKeyPresent ? 'text-green-600' : 'text-red-600'}`}>
            {configStatus.anonKeyPresent ? 'Configurada' : 'Não configurada'}
          </span>
        </div>
        
        <div className="flex items-center">
          <span className="font-medium w-32">Chave de Serviço:</span>
          <span className={`${configStatus.serviceKeyPresent ? 'text-green-600' : 'text-red-600'}`}>
            {configStatus.serviceKeyPresent ? 'Configurada' : 'Não configurada'}
          </span>
        </div>
        
        <div className="flex items-center">
          <span className="font-medium w-32">Teste de Conexão:</span>
          {configStatus.connectionTest === 'pending' && (
            <span className="text-yellow-600">Testando...</span>
          )}
          {configStatus.connectionTest === 'success' && (
            <span className="text-green-600">Conexão bem-sucedida</span>
          )}
          {configStatus.connectionTest === 'error' && (
            <span className="text-red-600">Falha na conexão</span>
          )}
        </div>
        
        {configStatus.error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            <p className="font-medium">Erro:</p>
            <p>{configStatus.error}</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>
          Para configurar o Supabase, crie um arquivo <code>.env.local</code> na raiz do projeto com as seguintes variáveis:
        </p>
        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
          {`NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico`}
        </pre>
      </div>
    </div>
  );
} 