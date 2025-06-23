/**
 * Sidebar de navegação principal do EiMusic Admin
 * Menu lateral com todas as funcionalidades administrativas
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Mic2, 
  Music, 
  BarChart3, 
  Settings, 
  Bell,
  LogOut,
  Menu,
  X,
  Crown,
  TrendingUp,
  Shield
} from 'lucide-react';
import { clsx } from 'clsx';

// Interface para item do menu
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number; // Número de notificações/pendências
  isActive?: boolean;
}

// Interface para as props da sidebar
interface AdminSidebarProps {
  className?: string;
}

/**
 * Componente AdminSidebar com navegação completa
 */
export default function AdminSidebar({ className }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Items do menu principal
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      href: '/dashboard',
      isActive: true // Simulando página ativa
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: <Users size={20} />,
      href: '/users',
      badge: 12 // Novos usuários pendentes
    },
    {
      id: 'artists',
      label: 'Artistas',
      icon: <Mic2 size={20} />,
      href: '/artists',
      badge: 5 // Artistas aguardando aprovação
    },
    {
      id: 'content',
      label: 'Conteúdo',
      icon: <Music size={20} />,
      href: '/content',
      badge: 23 // Músicas para moderar
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 size={20} />,
      href: '/analytics'
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Settings size={20} />,
      href: '/settings'
    }
  ];

  // Animações
  const sidebarAnimation = {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
    transition: { 
      duration: 0.3, 
      ease: "easeOut" as const  // Valor válido do Motion
    }
  };

  const itemAnimation = {
    hover: { x: 4, backgroundColor: 'rgba(124, 58, 237, 0.1)' },
    tap: { scale: 0.98 }
  };

  return (
    <>
      {/* Botão para mobile */}
      <motion.button
        className={clsx(
          'lg:hidden fixed top-4 left-4 z-50',
          'bg-gray-900/90 backdrop-blur-xl border border-gray-700',
          'p-2 rounded-lg text-gray-300 hover:text-white',
          'focus:outline-none focus:ring-2 focus:ring-purple-500'
        )}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      {/* Overlay para mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-50',
          'admin-sidebar',
          'flex flex-col',
          isCollapsed && 'lg:w-20',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'transition-all duration-300',
          className
        )}
        initial={sidebarAnimation.initial}
        animate={sidebarAnimation.animate}
        exit={sidebarAnimation.exit}
        transition={sidebarAnimation.transition}
      >
        {/* Header da sidebar */}
        <div className="p-4 border-b border-gray-800/50">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                <Crown size={24} className="text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-white font-bold text-lg">EiMusic</h1>
                  <p className="text-gray-400 text-xs">Admin Panel</p>
                </div>
              )}
            </motion.div>

            {/* Botão collapse (desktop) */}
            <motion.button
              className="hidden lg:block p-1 rounded hover:bg-gray-800/50"
              onClick={() => setIsCollapsed(!isCollapsed)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu size={16} className="text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Badge ADMIN */}
        <motion.div 
          className="mx-4 mt-4"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {!isCollapsed && (
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-purple-400" />
                <span className="text-purple-300 font-medium text-sm">ADMIN</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">Acesso Total</p>
            </div>
          )}
        </motion.div>

        {/* Menu de navegação */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item, index) => (
            <motion.a
              key={item.id}
              href={item.href}
              className={clsx(
                'admin-sidebar-item group relative',
                item.isActive && 'active'
              )}
              whileHover={itemAnimation.hover}
              whileTap={itemAnimation.tap}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.2,
                ease: "easeOut" as const
              }}
            >
              {/* Ícone */}
              <span className="flex-shrink-0">
                {item.icon}
              </span>

              {/* Label */}
              <motion.span
                className="flex-1"
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {!isCollapsed && item.label}
              </motion.span>

              {/* Badge de notificações */}
              {item.badge && item.badge > 0 && (
                <motion.span
                  className={clsx(
                    'bg-red-500 text-white text-xs rounded-full',
                    'min-w-[20px] h-5 flex items-center justify-center',
                    isCollapsed ? 'absolute -top-1 -right-1' : 'ml-auto'
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.3 + index * 0.1, 
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </motion.span>
              )}

              {/* Tooltip para collapsed */}
              {isCollapsed && (
                <motion.div
                  className={clsx(
                    'absolute left-full ml-2 px-2 py-1',
                    'bg-gray-900 text-white text-sm rounded',
                    'opacity-0 group-hover:opacity-100',
                    'transition-opacity duration-200 pointer-events-none',
                    'whitespace-nowrap z-50'
                  )}
                >
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </motion.div>
              )}
            </motion.a>
          ))}
        </nav>

        {/* Estatísticas rápidas */}
        <motion.div
          className="px-4 py-4 border-t border-gray-800/50"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {!isCollapsed && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Hoje</span>
                <span className="text-green-400 flex items-center gap-1">
                  <TrendingUp size={12} />
                  +12%
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Usuários Ativos</span>
                  <span className="text-white">1,234</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Revenue (MT)</span>
                  <span className="text-white">23,450</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer com notificações e logout */}
        <div className="p-4 border-t border-gray-800/50 space-y-2">
          {/* Notificações */}
          <motion.button
            className={clsx(
              'w-full admin-sidebar-item relative',
              isCollapsed && 'justify-center'
            )}
            whileHover={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Bell size={20} />
            {!isCollapsed && <span>Notificações</span>}
            <motion.span
              className={clsx(
                'bg-yellow-500 text-black text-xs rounded-full',
                'min-w-[20px] h-5 flex items-center justify-center font-bold',
                isCollapsed ? 'absolute -top-1 -right-1' : 'ml-auto'
              )}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut" as const
              }}
            >
              3
            </motion.span>
          </motion.button>

          {/* Logout */}
          <motion.button
            className={clsx(
              'w-full admin-sidebar-item text-red-400 hover:text-red-300',
              isCollapsed && 'justify-center'
            )}
            whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Sair</span>}
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}