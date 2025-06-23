/**
 * Componente UsersStats - Estatísticas de usuários
 * Responsabilidade única: exibir cards de estatísticas
 */

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Crown,
  DollarSign,
  UserPlus
} from 'lucide-react';
import { clsx } from 'clsx';

interface UsersStatsProps {
  statistics: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    blocked: number;
    premium: number;
    vip: number;
    totalRevenue: number;
    averageSpent: number;
  };
  isLoading?: boolean;
}

/**
 * Interface para um card de estatística
 */
interface StatCard {
  id: string;
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  format?: 'number' | 'currency';
}

/**
 * Hook para formatação
 */
const useFormatters = () => {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('pt-PT').format(num);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return { formatNumber, formatCurrency };
};

/**
 * Componente de loading para card
 */
const StatsCardSkeleton: React.FC = () => (
  <div className="admin-stats-card animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-xl bg-gray-700 w-12 h-12"></div>
      <div className="w-16 h-6 bg-gray-700 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-8 bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

/**
 * Componente individual de card de estatística
 */
const StatsCard: React.FC<{
  card: StatCard;
  index: number;
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number) => string;
}> = ({ card, index, formatNumber, formatCurrency }) => (
  <motion.div
    className="admin-stats-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      delay: index * 0.1, 
      duration: 0.3, 
      ease: "easeOut" as const 
    }}
    whileHover={{ 
      y: -2,
      transition: { duration: 0.2 }
    }}
  >
    {/* Header do card */}
    <div className="flex items-center justify-between mb-4">
      <div className={clsx('p-3 rounded-xl', card.bgColor)}>
        <span className={card.color}>{card.icon}</span>
      </div>
      
      {card.change && (
        <div className={clsx(
          'text-xs font-medium px-2 py-1 rounded-full',
          card.changeType === 'positive' && 'text-green-400 bg-green-500/10',
          card.changeType === 'negative' && 'text-red-400 bg-red-500/10',
          card.changeType === 'neutral' && 'text-gray-400 bg-gray-500/10'
        )}>
          {card.change}
        </div>
      )}
    </div>
    
    {/* Conteúdo do card */}
    <div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">
        {card.title}
      </h3>
      <p className="text-2xl font-bold text-white">
        {card.format === 'currency' 
          ? formatCurrency(card.value)
          : formatNumber(card.value)
        }
      </p>
    </div>
  </motion.div>
);

/**
 * Componente principal UsersStats
 */
export default function UsersStats({ statistics, isLoading = false }: UsersStatsProps) {
  const { formatNumber, formatCurrency } = useFormatters();

  // Configuração dos cards de estatística
  const statsCards: StatCard[] = [
    {
      id: 'total',
      title: 'Total de Usuários',
      value: statistics.total,
      icon: <Users size={24} />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      change: '+12%',
      changeType: 'positive',
      format: 'number'
    },
    {
      id: 'active',
      title: 'Usuários Ativos',
      value: statistics.active,
      icon: <UserCheck size={24} />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      change: '+8%',
      changeType: 'positive',
      format: 'number'
    },
    {
      id: 'premium',
      title: 'Assinantes Premium',
      value: statistics.premium + statistics.vip,
      icon: <Crown size={24} />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      change: '+15%',
      changeType: 'positive',
      format: 'number'
    },
    {
      id: 'pending',
      title: 'Usuários Pendentes',
      value: statistics.pending,
      icon: <UserPlus size={24} />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      change: statistics.pending > 0 ? '+3' : '0',
      changeType: statistics.pending > 0 ? 'neutral' : 'positive',
      format: 'number'
    },
    {
      id: 'blocked',
      title: 'Usuários Bloqueados',
      value: statistics.blocked,
      icon: <UserX size={24} />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      change: statistics.blocked > 0 ? `+${statistics.blocked}` : '0',
      changeType: statistics.blocked > 0 ? 'negative' : 'positive',
      format: 'number'
    },
    {
      id: 'revenue',
      title: 'Revenue Total',
      value: statistics.totalRevenue,
      icon: <DollarSign size={24} />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      change: '+23%',
      changeType: 'positive',
      format: 'currency'
    }
  ];

  // Renderizar loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <StatsCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
    >
      {statsCards.map((card, index) => (
        <StatsCard
          key={card.id}
          card={card}
          index={index}
          formatNumber={formatNumber}
          formatCurrency={formatCurrency}
        />
      ))}
    </motion.div>
  );
}