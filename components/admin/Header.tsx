// components/admin/Header.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Bell, 
  Search, 
  Menu,
  X,
  User, 
  Settings,
  LogOut,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut, isLoading } = useAuth();

  // Mock notifications
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Novo artista',
      message: 'Um novo artista foi cadastrado na plataforma.',
      time: '5 min atrás',
      read: false,
    },
    {
      id: '2',
      title: 'Álbum aprovado',
      message: 'O álbum "Sonhos" foi aprovado e publicado.',
      time: '1 hora atrás',
      read: false,
    },
    {
      id: '3',
      title: 'Relatório mensal',
      message: 'O relatório mensal de abril está disponível.',
      time: '1 dia atrás',
      read: true,
    },
  ];

  const transitionSettings = {
    type: 'spring',
    stiffness: 500,
    damping: 30,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de busca
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showMobileMenu ? 'Fechar menu' : 'Abrir menu'}
          >
            {showMobileMenu ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="size-4 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Buscar..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Notificações"
              >
                <Bell className="size-6" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 block size-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={transitionSettings}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10"
                  >
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-4 px-4 text-center text-sm text-gray-500">
                          Nenhuma notificação
                        </div>
                      ) : (
                        <div>
                          {notifications.map((notification) => (
                            <div 
                              key={notification.id}
                              className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-indigo-50' : ''}`}
                            >
                              <div className="flex justify-between">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="text-xs text-gray-500">{notification.time}</p>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <a href="#" className="text-xs text-indigo-600 hover:text-indigo-500 font-medium">Ver todas as notificações</a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Help */}
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
              <HelpCircle className="size-6" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center focus:outline-none"
                aria-label="Menu de perfil"
              >
                <div className="text-right hidden md:block mr-3">
                  <p className="text-sm font-medium text-foreground">
                    {isLoading ? 'Carregando...' : user?.email?.split('@')[0] || 'Usuário'}
                  </p>
                  <p className="text-xs text-muted">
                    {user?.email ? 'Administrador' : 'Não autenticado'}
                  </p>
                </div>
                <div className="size-10 rounded-full overflow-hidden ring-2 ring-gray-200">
                  {user?.email ? (
                    <div className="size-full bg-indigo-600 flex items-center justify-center text-white text-lg font-medium">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <Image
                      src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff"
                      alt="User"
                      width={40}
                      height={40}
                      className="size-full object-cover"
                    />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={transitionSettings}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                  >
                    <div className="py-1">
                      {user?.email && (
                        <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                          {user.email}
                        </div>
                      )}
                      <a href="/admin/settings" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-gray-50">
                        <Settings className="mr-3 size-4 text-gray-500" />
                        Configurações
                      </a>
                      <div className="border-t border-border my-1"></div>
                      <button 
                        onClick={signOut} 
                        className="flex w-full items-center px-4 py-2 text-sm text-danger hover:bg-danger/5"
                      >
                        <LogOut className="mr-3 size-4 text-danger" />
                        Sair
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}