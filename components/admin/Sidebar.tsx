// components/admin/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Music,
  DollarSign,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  UserCircle,
  FileAudio,
  type LucideIcon,
} from 'lucide-react';
import type { NavItem } from '@/types/admin';

const navigation: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
    icon: 'LayoutDashboard',
  },
  {
    id: 'artists',
    label: 'Artistas',
    href: '/admin/artists',
    icon: 'UserCircle',
    badge: 5,
  },
  {
    id: 'users',
    label: 'Usuários',
    href: '/admin/users',
    icon: 'Users',
  },
  {
    id: 'content',
    label: 'Conteúdo',
    href: '/admin/content',
    icon: 'FileAudio',
    subItems: [
      { id: 'tracks', label: 'Faixas', href: '/admin/content/tracks', icon: 'Music' },
      { id: 'albums', label: 'Álbuns', href: '/admin/content/albums', icon: 'Music' },
      { id: 'videos', label: 'Vídeos', href: '/admin/content/videos', icon: 'Music' },
    ],
  },
  {
    id: 'monetization',
    label: 'Monetização',
    href: '/admin/monetization',
    icon: 'DollarSign',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/admin/analytics',
    icon: 'BarChart3',
  },
  {
    id: 'settings',
    label: 'Configurações',
    href: '/admin/settings',
    icon: 'Settings',
  },
];

// Mapeamento de ícones para componentes LucideIcon
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Music,
  DollarSign,
  BarChart3,
  Settings,
  UserCircle,
  FileAudio,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: NavItem) => {
    if (pathname === item.href) return true;
    return item.subItems?.some(sub => pathname === sub.href) || false;
  };

  return (
    <aside className="w-[var(--sidebar-width)] bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="flex h-[var(--header-height)] items-center justify-center border-b border-gray-800">
        <h1 className="text-2xl font-bold">EiMusic Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-1.5">
          {navigation.map((item) => {
            const Icon = iconMap[item.icon];
            const isExpanded = expandedItems.includes(item.id);
            const isItemActive = isParentActive(item);

            return (
              <li key={item.id}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                        isItemActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="mr-3 size-5" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs bg-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="ml-auto size-4" />
                      ) : (
                        <ChevronRight className="ml-auto size-4" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 ml-2 pl-6 border-l border-gray-700 space-y-1"
                      >
                        {item.subItems.map((subItem) => {
                          const SubIcon = iconMap[subItem.icon];
                          const isSubActive = isActive(subItem.href);
                          
                          return (
                            <li key={subItem.id}>
                              <Link
                                href={subItem.href}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                                  isSubActive
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                              >
                                <SubIcon className="mr-3 size-4" />
                                {subItem.label}
                              </Link>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                      isItemActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="mr-3 size-5" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs bg-primary rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer com informações do usuário */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center">
          <Image
            className="size-8 rounded-full ring-1 ring-gray-700"
            src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff"
            alt="Admin"
            width={32}
            height={32}
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">admin@eimusic.co.mz</p>
          </div>
        </div>
      </div>
    </aside>
  );
}