// components/admin/Sidebar.tsx - SIDEBAR MODERNA E CAPRICHADA
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Music,
  DollarSign,
  BarChart3,
  Settings,
  ChevronRight,
  UserCircle,
  FileAudio,
  Disc3,
  Play,
  TrendingUp,
  CreditCard,
  Shield,
  Bell,
  Palette,
  Database,
  Headphones,
  Video,
  type LucideIcon,
} from 'lucide-react';
import type { NavItem } from '@/types/admin';

/**
 * ESTRUTURA DE NAVEGAÇÃO COMPLETA E ORGANIZADA
 * 
 * BOAS PRÁTICAS DE UX:
 * 1. Agrupamento lógico por categoria
 * 2. Ícones consistentes e intuitivos
 * 3. Badges para indicar status/contadores
 * 4. Hierarquia visual clara
 * 5. Estados de ativo/hover bem definidos
 */
const navigation: NavItem[] = [
  // DASHBOARD PRINCIPAL
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
    icon: 'LayoutDashboard',
  },
  
  // GESTÃO DE PESSOAS
  {
    id: 'artists',
    label: 'Artistas',
    href: '/admin/artists',
    icon: 'UserCircle',
    badge: 12, // Número de artistas pendentes de aprovação
  },
  {
    id: 'users',
    label: 'Usuários',
    href: '/admin/users',
    icon: 'Users',
    badge: 3, // Usuários com problemas ou novos
  },
  
  // GESTÃO DE CONTEÚDO (Seção expandível)
  {
    id: 'content',
    label: 'Conteúdo',
    href: '/admin/content',
    icon: 'FileAudio',
    subItems: [
      { 
        id: 'tracks', 
        label: 'Faixas', 
        href: '/admin/content/tracks', 
        icon: 'Headphones',
        badge: 5, // Faixas pendentes de revisão
      },
      { 
        id: 'albums', 
        label: 'Álbuns', 
        href: '/admin/content/albums', 
        icon: 'Disc3',
      },
      { 
        id: 'videos', 
        label: 'Vídeos', 
        href: '/admin/content/videos', 
        icon: 'Video',
        badge: 2, // Vídeos para moderação
      },
    ],
  },
  
  // MONETIZAÇÃO E FINANÇAS
  {
    id: 'monetization',
    label: 'Monetização',
    href: '/admin/monetization',
    icon: 'DollarSign',
    subItems: [
      { 
        id: 'revenue', 
        label: 'Receitas', 
        href: '/admin/monetization/revenue', 
        icon: 'TrendingUp',
      },
      { 
        id: 'payments', 
        label: 'Pagamentos', 
        href: '/admin/monetization/payments', 
        icon: 'CreditCard',
        badge: 7, // Pagamentos pendentes
      },
      { 
        id: 'plans', 
        label: 'Planos', 
        href: '/admin/monetization/plans', 
        icon: 'Shield',
      },
    ],
  },
  
  // ANALYTICS E RELATÓRIOS
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/admin/analytics',
    icon: 'BarChart3',
    subItems: [
      { 
        id: 'overview', 
        label: 'Visão Geral', 
        href: '/admin/analytics/overview', 
        icon: 'BarChart3',
      },
      { 
        id: 'streams', 
        label: 'Reproduções', 
        href: '/admin/analytics/streams', 
        icon: 'Play',
      },
      { 
        id: 'engagement', 
        label: 'Engajamento', 
        href: '/admin/analytics/engagement', 
        icon: 'TrendingUp',
      },
    ],
  },
  
  // CONFIGURAÇÕES DO SISTEMA
  {
    id: 'settings',
    label: 'Configurações',
    href: '/admin/settings',
    icon: 'Settings',
    subItems: [
      { 
        id: 'general', 
        label: 'Geral', 
        href: '/admin/settings/general', 
        icon: 'Settings',
      },
      { 
        id: 'notifications', 
        label: 'Notificações', 
        href: '/admin/settings/notifications', 
        icon: 'Bell',
      },
      { 
        id: 'appearance', 
        label: 'Aparência', 
        href: '/admin/settings/appearance', 
        icon: 'Palette',
      },
      { 
        id: 'database', 
        label: 'Base de Dados', 
        href: '/admin/settings/database', 
        icon: 'Database',
      },
    ],
  },
];

// MAPEAMENTO DE ÍCONES EXPANDIDO
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Music,
  DollarSign,
  BarChart3,
  Settings,
  UserCircle,
  FileAudio,
  Disc3,
  Play,
  TrendingUp,
  CreditCard,
  Shield,
  Bell,
  Palette,
  Database,
  Headphones,
  Video,
};

/**
 * COMPONENTE SIDEBAR MODERNO
 */
export default function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['content']); // Conteúdo expandido por padrão
  const [isCollapsed, setIsCollapsed] = useState(false);

  /**
   * AUTO-EXPANDIR seções baseadas na rota atual
   */
  useEffect(() => {
    navigation.forEach(item => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some(sub => pathname.startsWith(sub.href));
        if (hasActiveSubItem && !expandedItems.includes(item.id)) {
          setExpandedItems(prev => [...prev, item.id]);
        }
      }
    });
  }, [pathname, expandedItems]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const isParentActive = (item: NavItem) => {
    if (isActive(item.href)) return true;
    return item.subItems?.some(sub => isActive(sub.href)) || false;
  };

  return (
    <aside className={`bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-[280px]'
    } shadow-2xl border-r border-gray-700/50`}>
      
      {/* HEADER COM LOGO */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-700/50 bg-gray-800/50">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EiMusic
              </h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </motion.div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </button>
      </div>

      {/* NAVEGAÇÃO PRINCIPAL */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
        {navigation.map((item) => {
          const Icon = iconMap[item.icon];
          const isExpanded = expandedItems.includes(item.id);
          const isItemActive = isParentActive(item);

          return (
            <div key={item.id}>
              {/* ITEM PRINCIPAL */}
              {item.subItems ? (
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className={`w-full flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isItemActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${
                    isItemActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'
                  }`} />
                  
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 flex-1 text-left">{item.label}</span>
                      
                      {/* BADGE */}
                      {item.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full font-medium">
                          {item.badge}
                        </span>
                      )}
                      
                      {/* CHEVRON */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-2"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isItemActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${
                    isItemActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'
                  }`} />
                  
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 flex-1">{item.label}</span>
                      
                      {/* BADGE */}
                      {item.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full font-medium">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )}

              {/* SUBITENS EXPANDÍVEIS */}
              {item.subItems && !isCollapsed && (
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 ml-2 pl-4 border-l-2 border-gray-700/50 space-y-1">
                        {item.subItems.map((subItem) => {
                          const SubIcon = iconMap[subItem.icon];
                          const isSubActive = isActive(subItem.href);
                          
                          return (
                            <motion.div
                              key={subItem.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              <Link
                                href={subItem.href}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                  isSubActive
                                    ? 'bg-blue-600/30 text-blue-200 border border-blue-500/30'
                                    : 'text-gray-400 hover:bg-gray-800/30 hover:text-gray-200'
                                }`}
                              >
                                <SubIcon className={`w-4 h-4 transition-colors ${
                                  isSubActive ? 'text-blue-300' : 'text-gray-500 group-hover:text-gray-400'
                                }`} />
                                <span className="ml-3 flex-1">{subItem.label}</span>
                                
                                {/* BADGE DO SUBITEM */}
                                {subItem.badge && (
                                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded-full font-medium">
                                    {subItem.badge}
                                  </span>
                                )}
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </nav>

      {/* FOOTER COM INFO DO USUÁRIO */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t border-gray-700/50 p-4 bg-gray-800/30"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-400 truncate">
                admin@eimusic.co.mz
              </p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Online" />
          </div>
        </motion.div>
      )}
    </aside>
  );
}