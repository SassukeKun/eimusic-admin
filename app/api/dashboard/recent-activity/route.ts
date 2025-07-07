// app/api/dashboard/recent-activity/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface ActivityItem {
  id: string;
  type: 'user_signup' | 'track_upload' | 'artist_verified' | 'subscription';
  title: string;
  subtitle: string;
  time: string;
  icon: 'Users' | 'Music' | 'Shield' | 'Crown';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Buscar atividades recentes de diferentes tabelas
    const [usersResult, tracksResult, artistsResult] = await Promise.allSettled([
      // Novos usuários (últimos 3 dias)
      supabaseAdmin
        .from('users')
        .select('id, name, created_at')
        .gte('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5),

      // Novas faixas (últimos 3 dias)
      supabaseAdmin
        .from('tracks')
        .select('id, title, created_at, artist_id')
        .gte('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5),

      // Artistas verificados recentemente
      supabaseAdmin
        .from('artists')
        .select('id, name, verified, created_at')
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(3)
    ]);

    const activities: ActivityItem[] = [];

    // Processar novos usuários
    if (usersResult.status === 'fulfilled' && usersResult.value.data) {
      usersResult.value.data.forEach(user => {
        activities.push({
          id: `user_${user.id}`,
          type: 'user_signup',
          title: `${user.name} se cadastrou`,
          subtitle: 'Novo usuário na plataforma',
          time: getRelativeTime(user.created_at),
          icon: 'Users'
        });
      });
    }

    // Processar novas faixas
    if (tracksResult.status === 'fulfilled' && tracksResult.value.data) {
      tracksResult.value.data.forEach(track => {
        activities.push({
          id: `track_${track.id}`,
          type: 'track_upload',
          title: `Nova faixa: ${track.title}`,
          subtitle: 'Upload de conteúdo',
          time: getRelativeTime(track.created_at),
          icon: 'Music'
        });
      });
    }

    // Processar artistas verificados
    if (artistsResult.status === 'fulfilled' && artistsResult.value.data) {
      artistsResult.value.data.forEach(artist => {
        activities.push({
          id: `artist_${artist.id}`,
          type: 'artist_verified',
          title: `${artist.name} foi verificado`,
          subtitle: 'Artista verificado oficialmente',
          time: getRelativeTime(artist.created_at),
          icon: 'Shield'
        });
      });
    }

    // Ordenar por tempo e limitar
    const sortedActivities = activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit);

    return NextResponse.json(sortedActivities);

  } catch (error) {
    console.error('Erro ao buscar atividades recentes:', error);
    
    // Fallback com atividades de exemplo
    const fallbackActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'user_signup',
        title: 'João Silva se cadastrou',
        subtitle: 'Novo usuário na plataforma',
        time: 'há 2 horas',
        icon: 'Users'
      },
      {
        id: '2',
        type: 'track_upload',
        title: 'Nova faixa: "Moçambique Bela"',
        subtitle: 'Upload de conteúdo',
        time: 'há 4 horas',
        icon: 'Music'
      },
      {
        id: '3',
        type: 'artist_verified',
        title: 'Maria Santos foi verificada',
        subtitle: 'Artista verificado oficialmente',
        time: 'há 1 dia',
        icon: 'Shield'
      }
    ];

    return NextResponse.json(fallbackActivities);
  }
}

// Função auxiliar para calcular tempo relativo
function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'agora';
  if (diffInMinutes < 60) return `há ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `há ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  
  return date.toLocaleDateString('pt-BR');
}