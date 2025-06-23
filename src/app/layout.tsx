/**
 * Layout principal do EiMusic Admin
 * Configuração global da aplicação
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EiMusic Admin - Painel Administrativo',
  description: 'Painel administrativo da plataforma de distribuição musical moçambicana',
  keywords: 'music, mozambique, admin, dashboard, eimusic',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-MZ">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}