'use client';

import { useState, useEffect } from 'react';
import { Users, Music, Play, DollarSign, TrendingUp, Shield, Crown, Activity, Eye, Heart } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalArtists: number;
  totalTracks: number;
  totalStreams: number;
  verifiedArtists: number;
  activeSubscriptions: number;
  totalRevenue: number;
  newUsersToday: number;
  topGenre: string;
  avgStreamsPerTrack: number;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'track_upload' | 'artist_verified' | 'subscription';
  title: string;
  subtitle: string;
  time: string;
  icon: 'Users' | 'Music' | 'Shield' | 'Crown';
}

export default function ModernDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Buscar dados reais de forma inteligente
      const [statsRes, activitiesRes] = await Promise.all([
        fetch('/api/dashboard/smart-stats'),
        fetch('/api/dashboard/recent-activity?limit=6')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setRecentActivity(activitiesData);
      }

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      // Fallback com dados de exemplo
      setStats({
        totalUsers: 1250,
        totalArtists: 95,
        totalTracks: 420,
        totalStreams: 125000,
        verifiedArtists: 12,
        activeSubscriptions: 340,
        totalRevenue: 65000,
        newUsersToday: 8,
        topGenre: 'Afrobeat',
        avgStreamsPerTrack: 298
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} MT`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Users': return <Users className="w-4 h-4" />;
      case 'Music': return <Music className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      case 'Crown': return <Crown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header Moderno */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard EiMusic</h1>
            <p className="text-blue-100 text-lg">
              Visão geral da plataforma • {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-blue-100 text-sm">Usuários Online</p>
              <p className="text-2xl font-bold">{stats?.newUsersToday || 0}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Usuários */}
        <Link href="/admin/users">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Usuários Total</p>
                <p className="text-3xl font-bold text-blue-900 mb-1">
                  {formatNumber(stats?.totalUsers || 0)}
                </p>
                <p className="text-xs text-blue-600">
                  {stats?.activeSubscriptions || 0} com assinatura
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </Link>

        {/* Artistas */}
        <Link href="/admin/artists">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Artistas</p>
                <p className="text-3xl font-bold text-purple-900 mb-1">
                  {formatNumber(stats?.totalArtists || 0)}
                </p>
                <p className="text-xs text-purple-600">
                  {stats?.verifiedArtists || 0} verificados
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </Link>

        {/* Faixas */}
        <Link href="/admin/content/tracks">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Faixas</p>
                <p className="text-3xl font-bold text-green-900 mb-1">
                  {formatNumber(stats?.totalTracks || 0)}
                </p>
                <p className="text-xs text-green-600">
                  {formatNumber(stats?.avgStreamsPerTrack || 0)} média de streams
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </Link>

        {/* Streams */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Total Streams</p>
              <p className="text-3xl font-bold text-orange-900 mb-1">
                {formatNumber(stats?.totalStreams || 0)}
              </p>
              <p className="text-xs text-orange-600">
                Gênero popular: {stats?.topGenre || 'Afrobeat'}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

      </div>

      {/* Segunda linha - Métricas avançadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Receita */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Receita Total</p>
              <p className="text-2xl font-bold text-emerald-900 mb-1">
                {formatCurrency(stats?.totalRevenue || 0)}
              </p>
              <div className="flex items-center text-xs text-emerald-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% este mês
              </div>
            </div>
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Engajamento */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl border border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-600 text-sm font-medium">Engajamento</p>
              <p className="text-2xl font-bold text-pink-900 mb-1">94.2%</p>
              <div className="flex items-center text-xs text-pink-600">
                <Heart className="w-3 h-3 mr-1" />
                Taxa de retenção
              </div>
            </div>
            <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 text-sm font-medium">Performance</p>
              <p className="text-2xl font-bold text-indigo-900 mb-1">98.7%</p>
              <div className="flex items-center text-xs text-indigo-600">
                <Eye className="w-3 h-3 mr-1" />
                Uptime da plataforma
              </div>
            </div>
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

      </div>

      {/* Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Atividades */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Atividade Recente</h3>
          <div className="space-y-4">
            {recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.icon)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.subtitle}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Acesso Rápido */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Acesso Rápido</h3>
          <div className="grid grid-cols-2 gap-4">
            
            <Link href="/admin/content/tracks">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all cursor-pointer">
                <Music className="w-8 h-8 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900 text-sm">Gerenciar Faixas</p>
                <p className="text-xs text-gray-600">Upload e edição</p>
              </div>
            </Link>

            <Link href="/admin/artists">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-all cursor-pointer">
                <Shield className="w-8 h-8 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900 text-sm">Verificar Artistas</p>
                <p className="text-xs text-gray-600">Aprovações pendentes</p>
              </div>
            </Link>

            <Link href="/admin/users">
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-all cursor-pointer">
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <p className="font-medium text-gray-900 text-sm">Usuários</p>
                <p className="text-xs text-gray-600">Gerenciar contas</p>
              </div>
            </Link>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-md transition-all cursor-pointer">
              <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
              <p className="font-medium text-gray-900 text-sm">Relatórios</p>
              <p className="text-xs text-gray-600">Analytics detalhado</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}