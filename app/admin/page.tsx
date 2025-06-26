// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Users, Music, DollarSign, UserCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import StatsCard from '@/components/admin/StatsCard';
import PageHeader from '@/components/admin/PageHeader';
import Button from '@/components/admin/Button';
import type { DashboardStats } from '@/types/admin';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simular carregamento assíncrono
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock data - em Meticais (MT)
  const stats: DashboardStats = {
    totalUsers: 45320,
    totalArtists: 1250,
    totalTracks: 15680,
    totalRevenue: 2456000, // 2.456M MT
    monthlyGrowth: {
      users: 12.5,
      artists: 8.3,
      tracks: 15.7,
      revenue: 23.4,
    },
  };

  // Dados recentes para os cards
  const recentArtists = [
    { id: '1', name: 'Lizha James', genre: 'Pandza', image: 'https://ui-avatars.com/api/?name=Lizha+James&background=6366f1&color=fff', joinedDate: '2023-04-15' },
    { id: '2', name: 'Valter Artístico', genre: 'Hip Hop', image: 'https://ui-avatars.com/api/?name=Valter+Artistico&background=6366f1&color=fff', joinedDate: '2023-05-22' },
    { id: '3', name: 'Marllen', genre: 'Pop', image: 'https://ui-avatars.com/api/?name=Marllen&background=6366f1&color=fff', joinedDate: '2023-08-05' },
  ];
  
  const topTracks = [
    { id: '1', title: 'Nita Famba', artist: 'Lizha James', plays: 45600, revenue: 12500 },
    { id: '2', title: 'Tsovani Wanga', artist: 'MC Roger', plays: 32000, revenue: 8900 },
    { id: '3', title: 'Eparaka', artist: 'Valter Artístico', plays: 28500, revenue: 7300 },
  ];

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
        {isLoading ? (
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
            <Button 
              variant="ghost" 
              size="sm"
              rightIcon={<ArrowRight className="size-4" />}
            >
              Ver todos
            </Button>
          </div>
          <div className="card-body">
            {isLoading ? (
              // Skeleton loader para a lista
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center animate-pulse">
                    <div className="size-10 bg-gray-200 rounded-full"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-24 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Lista de artistas recentes
              <ul className="divide-y divide-border">
                {recentArtists.map((artist, index) => (
                  <motion.li 
                    key={artist.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="py-3 flex items-center"
                  >
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="size-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-foreground">{artist.name}</p>
                      <p className="text-xs text-muted">{artist.genre}</p>
                    </div>
                    <p className="ml-auto text-xs text-muted">
                      {new Date(artist.joinedDate).toLocaleDateString('pt-MZ', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Top Tracks */}
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h2 className="text-lg font-semibold text-foreground">Top Faixas da Semana</h2>
            <Button 
              variant="ghost" 
              size="sm"
              rightIcon={<ArrowRight className="size-4" />}
            >
              Ver todas
            </Button>
          </div>
          <div className="card-body">
            {isLoading ? (
              // Skeleton loader para a lista
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center animate-pulse">
                    <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-24 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              // Lista de faixas principais
              <ul className="divide-y divide-border">
                {topTracks.map((track, index) => (
                  <motion.li 
                    key={track.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="py-3 flex items-center"
                  >
                    <span className="size-6 flex items-center justify-center bg-gray-100 rounded-full text-sm font-medium text-foreground">
                      {index + 1}
                    </span>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-foreground">{track.title}</p>
                      <p className="text-xs text-muted">{track.artist}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {track.plays.toLocaleString('pt-MZ')}
                      </p>
                      <p className="text-xs text-success">
                        MT {track.revenue.toLocaleString('pt-MZ')}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}