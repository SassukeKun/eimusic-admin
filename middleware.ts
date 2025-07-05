// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Lista de emails com permissão de administrador
const ADMIN_EMAILS = [
  'admin@eimusic.co.mz',
  'allenvictor33@gmail.com',
];

// Rotas que requerem autenticação de administrador
const ADMIN_ROUTES = [
  '/admin',
  '/admin/analytics',
  '/admin/artists',
  '/admin/content',
  '/admin/monetization',
  '/admin/settings',
  '/admin/users',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const path = req.nextUrl.pathname;
  
  // Verificar se a rota atual requer autenticação de administrador
  const isAdminRoute = ADMIN_ROUTES.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  // Permitir acesso à página de login do admin, mesmo sem autenticação
  if (path === '/admin/login') {
    return res;
  }
  
  // Para rotas administrativas, verificar autenticação e permissões
  if (isAdminRoute) {
    // Verificar a sessão do usuário
    const { data: { session } } = await supabase.auth.getSession();
    
    // Se não houver sessão, redirecionar para a página de login
    if (!session) {
      const redirectUrl = new URL('/admin/login', req.url);
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    }
    
    // Verificar se o email do usuário está na lista de administradores
    const userEmail = session.user?.email;
    
    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      // Usuário não tem permissão de administrador
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }
  
  return res;
}

// Definir quais rotas o middleware deve interceptar
export const config = {
  matcher: [
    '/admin/:path*',  // Intercepta todas as rotas que começam com /admin
  ],
};