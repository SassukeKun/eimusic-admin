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
  subtitle?: string;
  valueFormatter?: (value: number) => string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  prefix = '',
  suffix = '',
  subtitle,
  valueFormatter,
}: StatsCardProps) {
  const isPositive = changeType === 'increase';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  // Formatação de valores numéricos para exibição com separador de milhares
  const formattedValue = valueFormatter && typeof value === 'number'
    ? valueFormatter(value)
    : typeof value === 'number' 
      ? new Intl.NumberFormat('pt-MZ').format(value) 
      : value;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow hover:shadow-md transition-all duration-200"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {prefix}{formattedValue}{suffix}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
            <div className="flex items-center mt-4">
              <div className={`flex items-center text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendIcon className="h-4 w-4 mr-1" />
                {Math.abs(change).toFixed(1)}%
              </div>
              <span className="text-sm text-gray-500 ml-2">vs mês anterior</span>
            </div>
          </div>
          <div className="ml-4">
            <div className={`flex items-center justify-center h-12 w-12 rounded-full ${
              isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}