/**
 * Header principal do EiMusic Admin
 * Cabeçalho com busca, notificações e perfil do administrador
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  ChevronDown,
  Crown,
  TrendingUp,
  DollarSign,
  Users
} from 'lucide-react';
import { clsx } from 'clsx';
import Button from '@/components/ui/Button';

// Interface para notificações
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  isRead: boolean;
}

// Interface para as props do header
interface AdminHeaderProps {
  className?: string;
}

/**
 * Componente AdminHeader com funcionalidades completas
 */
export default function AdminHeader({ className }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mock de notificações
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Novo Artista Pendente',
      message: 'MC Joaquim enviou documentos para verificação',
      type: 'info',
      timestamp: '2 min atrás',
      isRead: false
    },
    {
      id: '2',
      title: 'Meta de Revenue Atingida',
      message: 'Revenue mensal ultrapassou 50,000 MT',
      type: 'success',
      timestamp: '1 hora atrás',
      isRead: false
    },
    {
      id: '3',
      title: 'Conteúdo Reportado',
      message: 'Track "Marrabenta 2024" foi reportada por usuários',
      type: 'warning',
      timestamp: '3 horas atrás',
      isRead: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Mock do admin atual
  const currentAdmin = {
    name: 'Allen Santos',
    email: 'allen@eimusic.co.mz',
    role: 'Super Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Allen'
  };

  // Stats rápidas para o header
  const quickStats = [
    {
      label: 'Usuários Hoje',
      value: '1,234',
      icon: <Users size={16} />,
      color: 'text-blue-400'
    },
    {
      label: 'Revenue MT',
      value: '23,450',
      icon: <DollarSign size={16} />,
      color: 'text-green-400'
    },
    {
      label: 'Crescimento',
      value: '+12%',
      icon: <TrendingUp size={16} />,
      color: 'text-purple-400'
    }
  ];

  return (
    <header className={clsx('admin-header', className)}>
      {/* Linha gradiente do topo */}
      <div className="admin-gradient-line"></div>
      
      <div className="flex items-center justify-between px-6 py-4">
        {/* Lado esquerdo - Busca */}
        <div className="flex items-center gap-6 flex-1">
          {/* Busca global */}
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search w-full"
              placeholder="Buscar usuários, artistas, conteúdo..."
            />
            {/* Resultados da busca aparecem aqui */}
            {searchQuery && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-2 admin-card p-4 z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" as const }}
              >
                <p className="text-gray-400 text-sm">
                  Buscando por &quot;{searchQuery}&quot;...
                </p>
              </motion.div>
            )}
          </div>

          {/* Stats rápidas */}
          <div className="hidden lg:flex items-center gap-4">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/30"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, ease: "easeOut" as const }}
              >
                <span className={stat.color}>{stat.icon}</span>
                <div className="text-xs">
                  <p className="text-gray-400">{stat.label}</p>
                  <p className="text-white font-medium">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lado direito - Notificações e Perfil */}
        <div className="flex items-center gap-4">
          {/* Botão de configurações */}
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Settings size={16} />}
            className="hidden md:flex"
          >
            Configurações
          </Button>

          {/* Notificações */}
          <div className="relative">
            <motion.button
              className="relative p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={20} className="text-gray-300" />
              {unreadCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Dropdown de notificações */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-80 admin-card p-4 z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" as const }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Notificações</h3>
                    <span className="text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-md text-xs font-medium">
                      {notifications.length}
                    </span>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className={clsx(
                          'p-3 rounded-lg border transition-colors cursor-pointer',
                          notification.isRead 
                            ? 'bg-gray-800/30 border-gray-700' 
                            : 'bg-gray-800/50 border-gray-600'
                        )}
                        whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.7)' }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={clsx(
                            'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                            notification.type === 'info' && 'bg-blue-400',
                            notification.type === 'success' && 'bg-green-400',
                            notification.type === 'warning' && 'bg-yellow-400',
                            notification.type === 'error' && 'bg-red-400'
                          )} />
                          <div className="flex-1">
                            <h4 className="text-white text-sm font-medium">
                              {notification.title}
                            </h4>
                            <p className="text-gray-400 text-xs mt-1">
                              {notification.message}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                              {notification.timestamp}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-700">
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Todas as Notificações
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Perfil do admin */}
          <div className="relative">
            <motion.button
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              onClick={() => setShowProfile(!showProfile)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                  <Image
                    src={currentAdmin.avatar}
                    alt={currentAdmin.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium">{currentAdmin.name}</p>
                  <div className="flex items-center gap-1">
                    <Crown size={12} className="text-purple-400" />
                    <p className="text-gray-400 text-xs">{currentAdmin.role}</p>
                  </div>
                </div>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </motion.button>

            {/* Dropdown do perfil */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-64 admin-card p-4 z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" as const }}
                >
                  {/* Info do admin */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
                    {/* CORREÇÃO: Usar Next.js Image em vez de <img> */}
                    <div className="relative w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                      <Image
                        src={currentAdmin.avatar}
                        alt={currentAdmin.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">{currentAdmin.name}</p>
                      <p className="text-gray-400 text-sm">{currentAdmin.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Crown size={12} className="text-purple-400" />
                        <span className="text-purple-300 text-xs">{currentAdmin.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu do perfil */}
                  <div className="py-4 space-y-2">
                    <motion.button
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors text-left"
                      whileHover={{ x: 4 }}
                    >
                      <User size={16} className="text-gray-400" />
                      <span className="text-gray-300">Meu Perfil</span>
                    </motion.button>
                    
                    <motion.button
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors text-left"
                      whileHover={{ x: 4 }}
                    >
                      <Settings size={16} className="text-gray-400" />
                      <span className="text-gray-300">Configurações</span>
                    </motion.button>
                  </div>

                  {/* Logout */}
                  <div className="pt-4 border-t border-gray-700">
                    <motion.button
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600/10 transition-colors text-left"
                      whileHover={{ x: 4 }}
                    >
                      <LogOut size={16} className="text-red-400" />
                      <span className="text-red-300">Sair do Sistema</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}