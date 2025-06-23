/**
 * Layout principal do dashboard administrativo
 * Estrutura com sidebar e header para todas as páginas admin
 */

'use client';

import React from 'react';
import { motion } from 'motion/react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principal do dashboard com sidebar e header
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="admin-bg min-h-screen flex">
      {/* Sidebar de navegação */}
      <AdminSidebar />
      
      {/* Área principal do conteúdo */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header principal */}
        <AdminHeader />
        
        {/* Conteúdo das páginas */}
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}