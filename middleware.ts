import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de emails com permissão de administrador
const ADMIN_EMAILS = [
  'admin@eimusic.com',
  // Adicione outros emails de administradores conforme necessário
];

// Rotas que requerem autenticação de administrador
const PROTECTED_ROUTES = [
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
  
  // Verificar se a rota atual requer autenticação de administrador
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute) {
    // Verificar a sessão do usuário
    const { data: { session } } = await supabase.auth.getSession();
    
    // Se não houver sessão, redirecionar para a página de login
    if (!session) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
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

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 