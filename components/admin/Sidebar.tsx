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
    label: 'Artists',
    href: '/admin/artists',
    icon: 'UserCircle',
    badge: 5,
  },
  {
    id: 'users',
    label: 'Users',
    href: '/admin/users',
    icon: 'Users',
  },
  {
    id: 'content',
    label: 'Content',
    href: '/admin/content',
    icon: 'FileAudio',
    subItems: [
      { id: 'tracks', label: 'Tracks', href: '/admin/content/tracks', icon: 'Music' },
      { id: 'albums', label: 'Albums', href: '/admin/content/albums', icon: 'Music' },
      { id: 'videos', label: 'Videos', href: '/admin/content/videos', icon: 'Music' },
    ],
  },
  {
    id: 'monetization',
    label: 'Monetization',
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
    label: 'Settings',
    href: '/admin/settings',
    icon: 'Settings',
  },
];

// CORRIGIDO: Tipagem específica ao invés de any
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
    <aside className="w-64 bg-gray-900 text-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">EiMusic Admin</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = iconMap[item.icon];
            const isExpanded = expandedItems.includes(item.id);
            const isItemActive = isParentActive(item);

            return (
              <div key={item.id}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className={`
                        w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md
                        transition-colors duration-200
                        ${isItemActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-5 w-5" />
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-primary-600 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 space-y-1"
                      >
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.id}
                            href={subItem.href}
                            className={`
                              block pl-11 pr-4 py-2 text-sm rounded-md transition-colors duration-200
                              ${isActive(subItem.href)
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                              }
                            `}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-2 text-sm font-medium rounded-md
                      transition-colors duration-200
                      ${isActive(item.href)
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs bg-primary-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer - CORRIGIDO: Usando Next.js Image */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center">
            <Image
              className="h-8 w-8 rounded-full"
              src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff"
              alt="Admin"
              width={32}
              height={32}
            />
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-400">admin@eimusic.co.mz</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}