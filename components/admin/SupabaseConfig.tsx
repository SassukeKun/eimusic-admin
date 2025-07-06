// components/admin/SupabaseConfig.tsx
'use client';

import { useState, useEffect } from 'react';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CheckCircle, XCircle, AlertTriangle, Database, Key, Globe } from 'lucide-react';

interface ConfigStatus {
  hasUrl: boolean;
  hasAnonKey: boolean;
  hasServiceKey: boolean;
  canConnect: boolean;
  tablesAccessible: boolean;
  error?: string;
}

export default function SupabaseConfig() {
  const [status, setStatus] = useState<ConfigStatus>({
    hasUrl: false,
    hasAnonKey: false,
    hasServiceKey: false,
    canConnect: false,
    tablesAccessible: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkSupabaseConfig();
  }, []);

  const checkSupabaseConfig = async () => {
    setIsLoading(true);
    
    try {
      // Verificar variáveis de ambiente
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
      const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      // Verificar se tem service key (via API route)
      let hasServiceKey = false;
      let canConnect = false;
      let tablesAccessible = false;
      let error: string | undefined;

      try {
        const response = await fetch('/api/test-supabase');
        const result = await response.json();
        
        hasServiceKey = result.environment?.supabaseServiceKey === 'Configurado';
        canConnect = result.tests?.connectWithServiceKey?.success || false;
        tablesAccessible = result.tests?.queryArtists?.success || false;
        
        if (!canConnect && result.tests?.connectWithServiceKey?.error) {
          error = result.tests.connectWithServiceKey.error;
        }
      } catch (err) {
        error = 'Erro ao testar conexão com Supabase';
        console.error('Erro ao verificar Supabase:', err);
      }

      setStatus({
        hasUrl,
        hasAnonKey,
        hasServiceKey,
        canConnect,
        tablesAccessible,
        error,
      });
    } catch (err) {
      console.error('Erro ao verificar configuração:', err);
      setStatus({
        hasUrl: false,
        hasAnonKey: false,
        hasServiceKey: false,
        canConnect: false,
        tablesAccessible: false,
        error: 'Erro ao verificar configuração',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (isOk: boolean, isLoading = false) => {
    if (isLoading) {
      return <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />;
    }
    return isOk ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const allConfigured = status.hasUrl && status.hasAnonKey && status.hasServiceKey && status.canConnect;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Configuração Supabase
        </h3>
        <button
          onClick={checkSupabaseConfig}
          disabled={isLoading}
          className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
        >
          {isLoading ? 'Verificando...' : 'Atualizar'}
        </button>
      </div>

      {/* STATUS GERAL */}
      <div className={`p-4 rounded-lg border-2 mb-4 ${
        allConfigured 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center">
          {allConfigured ? (
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
          )}
          <div>
            <p className={`font-medium ${
              allConfigured ? 'text-green-800' : 'text-red-800'
            }`}>
              {allConfigured 
                ? 'Supabase configurado corretamente!' 
                : 'Configuração do Supabase incompleta'
              }
            </p>
            {!allConfigured && (
              <p className="text-sm text-red-600 mt-1">
                Verifique as variáveis de ambiente e a conectividade
              </p>
            )}
          </div>
        </div>
      </div>

      {/* DETALHES DA CONFIGURAÇÃO */}
      <div className="space-y-3">
        {/* URL */}
        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Globe className="w-4 h-4 text-gray-500 mr-3" />
            <span className="text-sm text-gray-700">SUPABASE_URL</span>
          </div>
          {getStatusIcon(status.hasUrl, isLoading)}
        </div>

        {/* ANON KEY */}
        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Key className="w-4 h-4 text-gray-500 mr-3" />
            <span className="text-sm text-gray-700">SUPABASE_ANON_KEY</span>
          </div>
          {getStatusIcon(status.hasAnonKey, isLoading)}
        </div>

        {/* SERVICE KEY */}
        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Key className="w-4 h-4 text-gray-500 mr-3" />
            <span className="text-sm text-gray-700">SERVICE_ROLE_KEY</span>
          </div>
          {getStatusIcon(status.hasServiceKey, isLoading)}
        </div>

        {/* CONEXÃO */}
        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Database className="w-4 h-4 text-gray-500 mr-3" />
            <span className="text-sm text-gray-700">Conectividade</span>
          </div>
          {getStatusIcon(status.canConnect, isLoading)}
        </div>

        {/* ACESSO A TABELAS */}
        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Database className="w-4 h-4 text-gray-500 mr-3" />
            <span className="text-sm text-gray-700">Acesso a Tabelas</span>
          </div>
          {getStatusIcon(status.tablesAccessible, isLoading)}
        </div>
      </div>

      {/* ERRO DETALHADO */}
      {status.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Erro:</strong> {status.error}
          </p>
        </div>
      )}

      {/* INSTRUÇÕES */}
      {!allConfigured && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Como configurar:
          </h4>
          <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
            <li>Crie um arquivo <code>.env.local</code> na raiz do projeto</li>
            <li>Adicione as variáveis do Supabase:</li>
          </ol>
          <div className="mt-2 p-2 bg-blue-100 rounded text-xs font-mono text-blue-800">
            NEXT_PUBLIC_SUPABASE_URL=sua_url<br/>
            NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave<br/>
            SUPABASE_SERVICE_ROLE_KEY=sua_service_key
          </div>
          <p className="text-xs text-blue-700 mt-2">
            Reinicie o servidor após adicionar as variáveis.
          </p>
        </div>
      )}

      {/* TOGGLE DETALHES */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800 underline"
      >
        {showDetails ? 'Ocultar detalhes técnicos' : 'Mostrar detalhes técnicos'}
      </button>

      {/* DETALHES TÉCNICOS */}
      {showDetails && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-medium text-gray-800 mb-2">
            Status Técnico:
          </h4>
          <pre className="text-xs text-gray-600 overflow-x-auto">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}