// app/admin/layout.tsx
import '../globals.css';
import { Metadata } from 'next';
import Sidebar from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { ToastProvider } from '@/components/ui/contexts/ToastContext';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'EI Music - Painel Administrativo',
  description: 'Painel de administração da plataforma EI Music',
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
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
      </ToastProvider>
    </AuthProvider>
  );
}