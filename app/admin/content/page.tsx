// app/admin/content/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';   
import { Music, Disc3, Film, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/admin/PageHeader';

// Tipos de conteúdo para cards
interface ContentType {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  href: string;
  count: number;
  bgColor: string;
  hoverColor: string;
}

export default function ContentPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simular carregamento assíncrono
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Dados dos tipos de conteúdo
  const contentTypes: ContentType[] = [
    {
      id: 'tracks',
      title: 'Faixas',
      icon: <Music className="h-8 w-8 text-purple-500" />,
      description: 'Gerencie faixas de música individuais',
      href: '/admin/content/tracks',
      count: 15680,
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
    },
    {
      id: 'albums',
      title: 'Álbuns',
      icon: <Disc3 className="h-8 w-8 text-blue-500" />,
      description: 'Gerencie coleções de faixas em álbuns',
      href: '/admin/content/albums',
      count: 1250,
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
    },
    {
      id: 'videos',
      title: 'Vídeos',
      icon: <Film className="h-8 w-8 text-pink-500" />,
      description: 'Gerencie videoclipes e conteúdo visual',
      href: '/admin/content/videos',
      count: 950,
      bgColor: 'bg-pink-50',
      hoverColor: 'hover:bg-pink-100',
    },
  ];

  // Card de tipo de conteúdo com skeleton loader
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow animate-pulse">
      <div className="p-6">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-gray-300"></div>
          <div className="ml-4 flex-1">
            <div className="h-5 w-24 bg-gray-300 rounded mb-3"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
   <div>
    {/* Cabeçalho da página com botão de volta */}
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <Link 
          href="/admin/content" 
          className="inline-flex items-center mr-4 text-sm text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para Conteúdo
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Vídeos</h1>
      <p className="text-gray-600 mt-1">
        Gerencie os vídeos de música na plataforma EiMusic.
      </p>
    </div>

      {/* Cards de tipos de conteúdo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {isLoading
          ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : contentTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={type.href}>
                  <div className={`bg-white rounded-lg shadow overflow-hidden ${type.hoverColor} transition-all cursor-pointer h-full`}>
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className={`${type.bgColor} p-3 rounded-lg`}>
                          {type.icon}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">{type.title}</h3>
                          <p className="text-sm text-gray-500">{type.description}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-700">
                          {type.count.toLocaleString('pt-MZ')} itens
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
        }
      </div>

      {/* Estatísticas de conteúdo */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Estatísticas de Conteúdo</h2>
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Reproduções</h3>
              <p className="text-2xl font-bold text-gray-900">8.5M</p>
              <span className="text-xs text-green-600 font-medium flex items-center mt-1">
                +12.3% <span className="ml-1 text-gray-500">desde o mês passado</span>
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-4 mb-4 md:mb-0">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Receita Total</h3>
              <p className="text-2xl font-bold text-gray-900">MT 256.450</p>
              <span className="text-xs text-green-600 font-medium flex items-center mt-1">
                +8.7% <span className="ml-1 text-gray-500">desde o mês passado</span>
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Uploads Este Mês</h3>
              <p className="text-2xl font-bold text-gray-900">324</p>
              <span className="text-xs text-green-600 font-medium flex items-center mt-1">
                +5.2% <span className="ml-1 text-gray-500">em relação à média</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/admin/content/tracks?status=published"
            className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Music className="h-5 w-5 text-gray-500 mr-3" />
            <span className="text-sm text-gray-700">Faixas Publicadas</span>
          </Link>
          <Link 
            href="/admin/content/tracks?status=draft"
            className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Music className="h-5 w-5 text-gray-500 mr-3" />
            <span className="text-sm text-gray-700">Faixas em Rascunho</span>
          </Link>
          <Link 
            href="/admin/content/albums?status=published"
            className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Disc3 className="h-5 w-5 text-gray-500 mr-3" />
            <span className="text-sm text-gray-700">Álbuns Publicados</span>
          </Link>
          <Link 
            href="/admin/content/videos?status=published"
            className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Film className="h-5 w-5 text-gray-500 mr-3" />
            <span className="text-sm text-gray-700">Vídeos Publicados</span>
          </Link>
        </div>
      </div>
    </div>
  );
}