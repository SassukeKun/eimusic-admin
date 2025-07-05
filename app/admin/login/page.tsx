// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/components/hooks/useToast';
import SupabaseConfig from '@/components/admin/SupabaseConfig';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';
  const toast = useToast();
  const supabase = createClientComponentClient();

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
        
        // Verifica se o usuário é um administrador (isso também é verificado no middleware)
        const adminEmails = ['admin@eimusic.co.mz', 'allenvictor33@gmail.com'];
        if (!adminEmails.includes(data.user.email || '')) {
          await supabase.auth.signOut();
          throw new Error('Você não tem permissão para acessar o painel administrativo');
        }

        toast.success('Login realizado com sucesso');
        
        // Redirecionar para o dashboard ou a página solicitada
        console.log('Redirecionando para:', redirectTo);
        router.push(redirectTo);
        router.refresh();
      }
    } catch (error) {
      console.error('Erro completo:', error);
      
      if (error instanceof Error) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else {
        setErrorMessage('Falha ao fazer login. Verifique suas credenciais.');
        toast.error('Falha ao fazer login. Verifique suas credenciais.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Para fins de desenvolvimento/teste, vamos mostrar as credenciais de acesso
  const testCredentials = {
    email: 'admin@eimusic.co.mz',
    password: 'admin123'
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-indigo-600">EiMusic Admin</h1>
            <p className="text-gray-500 mt-1">Painel de administração</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            <p className="font-medium">Erro ao fazer login:</p>
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

        {/* Credenciais de teste - remover em produção */}
        <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Credenciais para teste:</h3>
          <div className="text-xs text-gray-600">
            <div><strong>Email:</strong> {testCredentials.email}</div>
            <div><strong>Senha:</strong> {testCredentials.password}</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Nota: Estas credenciais são apenas para desenvolvimento. Remover em produção.
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Acesso restrito a administradores
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            {showConfig ? 'Ocultar configuração' : 'Verificar configuração do Supabase'}
          </button>
          
          {showConfig && (
            <div className="mt-4">
              <SupabaseConfig />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}