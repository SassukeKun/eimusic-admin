// app/admin/login/page.tsx - VERSÃO COM SUPABASE
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Eye, EyeOff, Music } from 'lucide-react';
import SupabaseConfig from '@/components/admin/SupabaseConfig';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';
  const supabase = createClientComponentClient();

  // Credenciais de teste
  const testCredentials = {
    email: 'admin@eimusic.co.mz',
    password: 'admin123'
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log(`Tentando login com email: ${email}`);
      
      // Tenta fazer login com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro de autenticação:', error);
        throw new Error(`Erro de autenticação: ${error.message}`);
      }

      if (data.user) {
        console.log('Login bem-sucedido:', data.user);
        
        // Verifica se o usuário é um administrador
        const adminEmails = ['admin@eimusic.co.mz', 'allenvictor33@gmail.com'];
        if (!adminEmails.includes(data.user.email || '')) {
          await supabase.auth.signOut();
          throw new Error('Você não tem permissão para acessar o painel administrativo');
        }

        console.log('Usuário autorizado, redirecionando...');
        
        // Redirecionar para o dashboard ou a página solicitada
        router.push(redirectTo);
        router.refresh();
      }
    } catch (error) {
      console.error('Erro completo:', error);
      
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Falha ao fazer login. Verifique suas credenciais.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setEmail(testCredentials.email);
    setPassword(testCredentials.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* HEADER */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">EiMusic Admin</h2>
          <p className="mt-2 text-sm text-gray-600">
            Acesse o painel administrativo
          </p>
        </div>

        {/* FORMULÁRIO */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            
            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="seu-email@eimusic.co.mz"
                disabled={isLoading}
              />
            </div>

            {/* SENHA */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* MENSAGEM DE ERRO */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          {/* BOTÃO DE LOGIN */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>

        {/* CREDENCIAIS DE TESTE */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Credenciais para teste:</h3>
            <button
              type="button"
              onClick={fillTestCredentials}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Preencher automaticamente
            </button>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>Email:</strong> {testCredentials.email}</div>
            <div><strong>Senha:</strong> {testCredentials.password}</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Clique em &quot;Preencher automaticamente&quot; para usar estas credenciais
          </p>
        </div>

        {/* DIVISOR */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Configuração
            </span>
          </div>
        </div>

        {/* CONFIGURAÇÃO SUPABASE */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {showConfig ? 'Ocultar configuração do Supabase' : 'Verificar configuração do Supabase'}
          </button>
          
          {showConfig && (
            <div className="mt-4">
              <SupabaseConfig />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Acesso restrito a administradores autorizados
          </p>
        </div>
      </div>
    </div>
  );
}