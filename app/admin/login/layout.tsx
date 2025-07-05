import '../../globals.css';
import { Metadata } from 'next';
import { ToastProvider } from '@/components/ui/contexts/ToastContext';

export const metadata: Metadata = {
  title: 'EI Music - Login Administrativo',
  description: 'Acesso ao painel de administração da plataforma EI Music',
};

interface LoginLayoutProps {
  children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
    </ToastProvider>
  );
} 