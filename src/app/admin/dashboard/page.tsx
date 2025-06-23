/**
 * Página principal do Dashboard EiMusic Admin
 * Overview com estatísticas, gráficos e atividades recentes
 */

'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { 
  Users, 
  Mic2, 
  Music, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  MapPin,
  Star 
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAdminStats } from '@/hooks/useAdminStats';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

/**
 * Página principal do dashboard
 */
export default function DashboardPage() {
  const {
    dashboardStats,
    recentActivities,
    isLoading,
    isRefreshing,
    formatCurrency,
    formatNumber,
    refreshStats
  } = useAdminStats();

  // Cards de estatísticas principais
  const statsCards = [
    {
      title: 'Total de Usuários',
      value: dashboardStats?.totalUsers || 0,
      icon: <Users size={24} />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Artistas Ativos',
      value: dashboardStats?.totalArtists || 0,
      icon: <Mic2 size={24} />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Conteúdo Total',
      value: dashboardStats?.totalContent || 0,
      icon: <Music size={24} />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      title: 'Revenue Mensal',
      value: dashboardStats?.monthlyRevenue || 0,
      icon: <DollarSign size={24} />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      change: '+23%',
      changeType: 'positive' as const,
      isCurrency: true
    }
  ];

  // Cards de ação rápida
  const quickActions = [
    {
      title: 'Aprovar Artistas',
      description: `${dashboardStats?.pendingApprovals || 0} pendentes`,
      icon: <Mic2 size={20} />,
      color: 'text-purple-400',
      href: '/artists'
    },
    {
      title: 'Moderar Conteúdo',
      description: '23 tracks aguardando',
      icon: <Music size={20} />,
      color: 'text-green-400',
      href: '/content'
    },
    {
      title: 'Ver Analytics',
      description: 'Relatórios detalhados',
      icon: <TrendingUp size={20} />,
      color: 'text-blue-400',
      href: '/analytics'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-card p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard EiMusic Admin
          </h1>
          <p className="text-gray-400">
            Visão geral da plataforma musical moçambicana
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin size={16} />
            <span>Cidade Popular: {dashboardStats?.topCity}</span>
          </div>
          
          <Button
            variant="primary"
            size="sm"
            leftIcon={<TrendingUp size={16} />}
            onClick={refreshStats}
            isLoading={isRefreshing}
          >
            Atualizar
          </Button>
        </div>
      </motion.div>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            className="admin-stats-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" as const }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={clsx('p-3 rounded-xl', card.bgColor)}>
                <span className={card.color}>{card.icon}</span>
              </div>
              <div className="text-right">
                <span className={clsx(
                  'text-xs font-medium px-2 py-1 rounded-full',
                  card.changeType === 'positive' 
                    ? 'text-green-400 bg-green-500/10' 
                    : 'text-red-400 bg-red-500/10'
                )}>
                  {card.change}
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-white">
                {card.isCurrency 
                  ? formatCurrency(card.value)
                  : formatNumber(card.value)
                }
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Seção de ações rápidas e atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ações rápidas */}
        <motion.div
          className="admin-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" as const }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Star size={20} className="text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Ações Rápidas</h2>
          </div>
          
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <motion.a
                key={action.title}
                href={action.href}
                className="block p-4 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-800/30 transition-all duration-200"
                whileHover={{ x: 4 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, ease: "easeOut" as const }}
              >
                <div className="flex items-center gap-3">
                  <span className={action.color}>{action.icon}</span>
                  <div>
                    <h3 className="text-white font-medium">{action.title}</h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Atividades recentes */}
        <motion.div
          className="lg:col-span-2 admin-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" as const }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Atividades Recentes</h2>
            </div>
            {/* CORREÇÃO: Usar span em vez de Badge com children */}
            <span className="text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-md text-xs">
              {recentActivities.length}
            </span>
          </div>
          
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentActivities.slice(0, 8).map((activity, index) => (
              <motion.div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-800/30 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05, ease: "easeOut" as const }}
              >
                {/* Avatar ou ícone - CORREÇÃO: Usar Next.js Image */}
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {activity.userImage ? (
                    <Image 
                      src={activity.userImage} 
                      alt={activity.userName}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users size={16} className="text-gray-400" />
                  )}
                </div>
                
                {/* Conteúdo da atividade */}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm">
                    <span className="font-medium text-white">{activity.userName}</span>
                    {' '}
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-gray-500 text-xs">{activity.timestamp}</span>
                    {activity.amount && (
                      <span className="text-green-400 text-xs font-medium">
                        {formatCurrency(activity.amount)}
                      </span>
                    )}
                    <Badge 
                      status={
                        activity.status === 'success' ? 'approved' : 
                        activity.status === 'pending' ? 'pending' : 'blocked'
                      } 
                      size="sm"
                      animated={false}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-700">
            <Button variant="outline" size="sm" className="w-full">
              Ver Todas as Atividades
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}