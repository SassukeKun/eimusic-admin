'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const supabase = createClientComponentClient();
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setMessage('Um email de recuperação foi enviado. Verifique sua caixa de entrada.');
    } catch (error: any) {
      console.error('Erro ao enviar email de recuperação:', error);
      setError(error.message || 'Falha ao enviar email de recuperação.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image 
            src="/logo.svg" 
            alt="EI Music Logo" 
            width={150} 
            height={40} 
            priority
          />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Recuperar Senha
        </h1>
        
        <p className="text-center text-gray-600 mb-6">
          Digite seu email para receber instruções de recuperação de senha.
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
            {message}
          </div>
        )}
        
        <form onSubmit={handleResetPassword} className="space-y-4">
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
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar instruções'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
} 