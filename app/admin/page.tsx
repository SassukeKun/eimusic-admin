// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Users, Music, DollarSign, UserCheck, ArrowRight } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import PageHeader from '@/components/admin/PageHeader';
// import Button from '@/components/admin/Button';
import Link from 'next/link';
import type { DashboardStats } from '@/types/admin';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/components/hooks/useToast';

// Definir tipos para artistas recentes e faixas populares
interface RecentArtist {
  id: string;
  name: string;
  genre: string;
  image: string;
  joinedDate: string;
}

interface TopTrack {
  id: string;
  title: string;
  artist: string;
  plays: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentArtists, setRecentArtists] = useState<RecentArtist[]>([]);
  const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
  const api = useApi<DashboardStats | RecentArtist[] | TopTrack[]>();
  const toast = useToast();
  
  // Carregar dados do dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Buscar estatísticas
        const statsData = await api.get('/api/dashboard/stats');
        setStats(statsData as DashboardStats);
        
        // Buscar artistas recentes
        const artistsData = await api.get('/api/dashboard/recent-artists');
        setRecentArtists(artistsData as RecentArtist[]);
        
        // Buscar faixas populares
        const tracksData = await api.get('/api/dashboard/top-tracks');
        setTopTracks(tracksData as TopTrack[]);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error instanceof Error ? error.message : 'Erro desconhecido');
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [api, toast]);

  // Componente de skeleton loader para os cards
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow animate-pulse">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 w-32 bg-gray-300 rounded mb-4"></div>
            <div className="flex items-center mt-4">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="ml-4">
            <div className="size-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Cabeçalho da página */}
      <PageHeader
        title="Dashboard"
        description="Bem-vindo de volta! Aqui está o que está acontecendo com a plataforma EiMusic hoje."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading || !stats ? (
          // Skeleton loaders durante o carregamento
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          // Cards de estatísticas após o carregamento
          <>
            <StatsCard
              title="Total de Usuários"
              value={stats.totalUsers}
              change={stats.monthlyGrowth.users}
              changeType="increase"
              icon={Users}
            />
            <StatsCard
              title="Total de Artistas"
              value={stats.totalArtists}
              change={stats.monthlyGrowth.artists}
              changeType="increase"
              icon={UserCheck}
            />
            <StatsCard
              title="Total de Faixas"
              value={stats.totalTracks}
              change={stats.monthlyGrowth.tracks}
              changeType="increase"
              icon={Music}
            />
            <StatsCard
              title="Receita Total"
              value={stats.totalRevenue}
              change={stats.monthlyGrowth.revenue}
              changeType="increase"
              icon={DollarSign}
              prefix="MT "
            />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Artistas Recentes */}
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Artistas Recentes</h2>
            <Link href="/admin/artists" className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Ver todos
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center animate-pulse">
                    <div className="size-10 rounded-full bg-gray-200"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                      <div className="mt-2 h-3 w-1/3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentArtists.length === 0 ? (
              <div className="text-center p-6 text-gray-500">
                Nenhum artista encontrado
              </div>
            ) : (
              <div className="space-y-4">
                {recentArtists.map((artist) => (
                  <div key={artist.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <div className="size-10 rounded-full overflow-hidden">
                      <img 
                        src={artist.image}
                        alt={artist.name}
                        className="object-cover size-full"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{artist.name}</h3>
                      <p className="text-sm text-gray-500">{artist.genre}</p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                      {new Date(artist.joinedDate).toLocaleDateString('pt-PT')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Tracks */}
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Faixas Populares</h2>
            <Link href="/admin/content/tracks" className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Ver todas
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center animate-pulse">
                    <div className="h-4 w-8 bg-gray-200 rounded mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                      <div className="mt-2 h-3 w-1/3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-16 bg-gray-200 rounded ml-4"></div>
                  </div>
                ))}
              </div>
            ) : topTracks.length === 0 ? (
              <div className="text-center p-6 text-gray-500">
                Nenhuma faixa encontrada
              </div>
            ) : (
              <div className="space-y-4">
                {topTracks.map((track, index) => (
                  <div key={track.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <div className="w-8 text-center font-medium text-gray-500">
                      #{index + 1}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900">{track.title}</h3>
                      <p className="text-sm text-gray-500">{track.artist}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-gray-900">
                        {new Intl.NumberFormat('pt-MZ').format(track.plays)} plays
                      </span>
                      <span className="text-xs text-gray-500">
                        MT {new Intl.NumberFormat('pt-MZ').format(track.revenue)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}