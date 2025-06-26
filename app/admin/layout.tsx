// app/admin/layout.tsx
import { Metadata } from 'next';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';

export const metadata: Metadata = {
  title: 'EiMusic Admin - Dashboard',
  description: 'Painel administrativo da plataforma EiMusic',
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}