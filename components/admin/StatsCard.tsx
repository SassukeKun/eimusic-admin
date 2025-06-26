// components/admin/StatsCard.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  type LucideIcon 
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  prefix = '',
  suffix = '',
}: StatsCardProps) {
  const isPositive = changeType === 'increase';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  // Formatação de valores numéricos para exibição com separador de milhares
  const formattedValue = typeof value === 'number' 
    ? new Intl.NumberFormat('pt-MZ').format(value) 
    : value;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card hover:shadow transition-all duration-200"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-2">
              {prefix}{formattedValue}{suffix}
            </p>
            <div className="flex items-center mt-4">
              <div className={`flex items-center text-sm font-medium ${
                isPositive ? 'text-success' : 'text-danger'
              }`}>
                <TrendIcon className="size-4 mr-1" />
                {Math.abs(change).toFixed(1)}%
              </div>
              <span className="text-sm text-muted ml-2">vs mês anterior</span>
            </div>
          </div>
          <div className="ml-4">
            <div className={`flex items-center justify-center size-12 rounded-full ${
              isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            }`}>
              <Icon className="size-6" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}