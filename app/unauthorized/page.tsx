'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    
    checkSession();
  }, [supabase]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Image 
            src="/logo.svg" 
            alt="EI Music Logo" 
            width={150} 
            height={40} 
            priority
          />
        </div>
        
        <div className="text-red-600 text-5xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Acesso Negado
        </h1>
        
        <p className="text-gray-600 mb-6">
          {userEmail ? (
            <>
              O email <span className="font-semibold">{userEmail}</span> não tem permissão para acessar esta área.
            </>
          ) : (
            <>
              Você não tem permissão para acessar esta área.
            </>
          )}
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sair e fazer login com outra conta
          </button>
          
          <Link href="/" className="block w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
} 