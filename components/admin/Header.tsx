// components/admin/Header.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Search, 
  Bell, 
  Menu, 
  X,
  User,
  Settings,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock notifications
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Novo Artista Registrado',
      message: 'MC Azagaia acabou de se registrar',
      time: '5 min atrás',
      read: false,
    },
    {
      id: '2',
      title: 'Marco de Receita',
      message: 'Plataforma atingiu 1M MT de receita',
      time: '1 hora atrás',
      read: false,
    },
    {
      id: '3',
      title: 'Conteúdo Sinalizado',
      message: 'Revisão necessária para 3 faixas',
      time: '3 horas atrás',
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Efeito de transição para animações - limitado a 300ms
  const transitionSettings = {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1] as const
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implementar lógica de busca
  };

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Search on desktop, menu on mobile */}
        <div className="flex items-center flex-1">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden mr-4 text-gray-600 hover:text-foreground focus:outline-none"
            aria-label={showMobileMenu ? "Fechar menu" : "Abrir menu"}
          >
            {showMobileMenu ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
          
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="size-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-white 
                       placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 
                       focus:border-primary text-sm"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Right side - Notifications and profile */}
        <div className="flex items-center gap-4">
          {/* Help button */}
          <button 
            className="p-2 text-gray-600 hover:text-foreground focus:outline-none hidden sm:block"
            aria-label="Ajuda"
          >
            <HelpCircle className="size-5" />
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 
                         focus:outline-none relative"
              aria-label="Notificações"
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 size-4 rounded-full bg-danger text-white 
                               text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
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
                  <div className="px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-semibold text-foreground">Notificações</h3>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-border last:border-b-0 ${
                            !notification.read ? 'bg-primary/5' : ''
                          }`}
                        >
                          <h4 className="font-medium text-sm text-foreground">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Sem notificações
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 text-center border-t border-border">
                    <button className="text-primary hover:text-primary-dark text-sm font-medium">
                      Ver todas as notificações
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center focus:outline-none"
              aria-label="Menu de perfil"
            >
              <div className="text-right hidden md:block mr-3">
                <p className="text-sm font-medium text-foreground">Admin User</p>
                <p className="text-xs text-muted">Super Admin</p>
              </div>
              <div className="size-10 rounded-full overflow-hidden ring-2 ring-gray-200">
                <Image
                  src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff"
                  alt="Admin"
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
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
                    <a href="/admin/profile" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-gray-50">
                      <User className="mr-3 size-4 text-gray-500" />
                      Perfil
                    </a>
                    <a href="/admin/settings" className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-gray-50">
                      <Settings className="mr-3 size-4 text-gray-500" />
                      Configurações
                    </a>
                    <div className="border-t border-border my-1"></div>
                    <a href="/logout" className="flex items-center px-4 py-2 text-sm text-danger hover:bg-danger/5">
                      <LogOut className="mr-3 size-4 text-danger" />
                      Sair
                    </a>
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