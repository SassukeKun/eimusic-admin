/**
 * Componente Badge para status no EiMusic Admin
 * Mostra status com cores específicas do design system
 */

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import type { UserStatus, ArtistStatus, ContentStatus } from '@/types/admin';

// Interface para as props do Badge
interface BadgeProps {
  status: UserStatus | ArtistStatus | ContentStatus | 'verified' | 'featured';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

// Mapeamento de status para configurações visuais
const statusConfig = {
  active: {
    label: 'Ativo',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: '●'
  },
  approved: {
    label: 'Aprovado',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: '✓'
  },
  pending: {
    label: 'Pendente',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    icon: '⏳'
  },
  blocked: {
    label: 'Bloqueado',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: '✗'
  },
  verified: {
    label: 'Verificado',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: '✓'
  },
  featured: {
    label: 'Destaque',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    icon: '★'
  }
} as const;

// Classes por tamanho
const sizeClasses = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2'
};

/**
 * Componente Badge com animações e cores do design system
 */
export default function Badge({
  status,
  size = 'md',
  showIcon = true,
  animated = true,
  className
}: BadgeProps) {
  const config = statusConfig[status];
  
  if (!config) {
    console.warn(`Status "${status}" não encontrado no statusConfig`);
    return null;
  }

  // Classes base do badge
  const baseClasses = [
    'inline-flex items-center justify-center',
    'rounded-md font-medium border',
    'transition-all duration-200'
  ].join(' ');

  // Conteúdo do badge
  const badgeContent = (
    <span className={clsx(
      baseClasses,
      config.color,
      config.bg,
      config.border,
      sizeClasses[size],
      className
    )}>
      {/* Ícone do status */}
      {showIcon && (
        <span className="flex-shrink-0" role="img" aria-label={config.label}>
          {config.icon}
        </span>
      )}
      
      {/* Label do status */}
      <span>{config.label}</span>
    </span>
  );

  // Se não tem animação, retorna o conteúdo simples
  if (!animated) {
    return badgeContent;
  }

  // Com animação de entrada
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {badgeContent}
    </motion.div>
  );
}

// Componente auxiliar para verificação com badge azul
interface VerificationBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function VerificationBadge({ size = 'md', className }: VerificationBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={clsx(
        'inline-flex items-center justify-center',
        'bg-blue-500 text-white rounded-full',
        size === 'sm' && 'w-4 h-4 text-xs',
        size === 'md' && 'w-5 h-5 text-xs',
        size === 'lg' && 'w-6 h-6 text-sm',
        className
      )}
      title="Artista Verificado"
    >
      ✓
    </motion.div>
  );
}

// Componente auxiliar para artista em destaque
interface FeaturedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FeaturedBadge({ size = 'md', className }: FeaturedBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={clsx(
        'inline-flex items-center justify-center',
        'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full',
        size === 'sm' && 'w-4 h-4 text-xs',
        size === 'md' && 'w-5 h-5 text-xs',
        size === 'lg' && 'w-6 h-6 text-sm',
        className
      )}
      title="Artista em Destaque"
    >
      ★
    </motion.div>
  );
}