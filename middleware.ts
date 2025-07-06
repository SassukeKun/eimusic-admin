// middleware.ts - MIDDLEWARE COM SUPABASE
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = request.nextUrl;
  
  // Rotas que requerem autenticação
  const protectedRoutes = ['/admin'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) && pathname !== '/admin/login'
  );
  
  if (isProtectedRoute) {
    try {
      // Criar cliente Supabase para middleware
      const supabase = createMiddlewareClient({ req: request, res });
      
      // Verificar se há uma sessão ativa
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao verificar sessão:', error);
      }
      
      if (!session) {
        // Redirecionar para login se não estiver autenticado
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirectTo', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // Verificar se o usuário é administrador
      const adminEmails = ['admin@eimusic.co.mz', 'allenvictor33@gmail.com'];
      if (!adminEmails.includes(session.user.email || '')) {
        // Usuário não autorizado, redirecionar para login
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(loginUrl);
      }
      
    } catch (error) {
      console.error('Erro no middleware:', error);
      // Em caso de erro, redirecionar para login
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Se está tentando acessar login mas já está logado, redirecionar para admin
  if (pathname === '/admin/login') {
    try {
      const supabase = createMiddlewareClient({ req: request, res });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const adminEmails = ['admin@eimusic.co.mz', 'allenvictor33@gmail.com'];
        if (adminEmails.includes(session.user.email || '')) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }
    } catch (error) {
      console.error('Erro ao verificar sessão no login:', error);
    }
  }
  
  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin/login'
  ]
};