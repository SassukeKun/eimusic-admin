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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          <div className="flex items-center mt-4">
            <TrendIcon 
              className={`h-4 w-4 ${
                isPositive ? 'text-green-500' : 'text-red-500'
              }`} 
            />
            <span className={`text-sm font-medium ml-1 ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {Math.abs(change)}%
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>
        <div className="ml-4">
          <div className={`p-3 rounded-full ${
            isPositive ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <Icon className={`h-6 w-6 ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}