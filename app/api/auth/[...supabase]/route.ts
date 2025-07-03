import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }
  
  // URL para redirecionar após o login
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/admin';
  
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Obter o corpo da requisição
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const action = formData.get('action') as string;
  
  // Definir URL de redirecionamento após a ação
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/admin';
  
  if (action === 'signin') {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
  
  if (action === 'signout') {
    await supabase.auth.signOut();
  }
  
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
} 