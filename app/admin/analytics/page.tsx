// app/admin/analytics/page.tsx
'use client';

import { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Music, 
  PlayCircle,
  Calendar
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { motion } from 'framer-motion';
import { generateStatsCards } from '@/data/analyticsData';
// Removi a importação de mockAnalyticsData já que não está sendo usado

export default function AnalyticsPage() {
  // Períodos disponíveis para visualização
  const periods = [
    { id: 'day', name: 'Diário' },
    { id: 'week', name: 'Semanal' },
    { id: 'month', name: 'Mensal' },
    { id: 'quarter', name: 'Trimestral' },
    { id: 'year', name: 'Anual' },
  ];

  // Estado para o período selecionado
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Gerar cards de estatísticas usando a função do arquivo de dados
  const statsCards = generateStatsCards();

  return (
    <div>
      {/* Cabeçalho da página */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Visualize métricas e tendências da plataforma EiMusic.
        </p>
      </div>

      {/* Seletor de período */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Período</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period.id}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                selectedPeriod === period.id
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedPeriod(period.id)}
            >
              {period.name}
            </button>
          ))}
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          // Mapear nome de ícone para componente
          let IconComponent;
          switch (stat.icon) {
            case 'Users':
              IconComponent = Users;
              break;
            case 'Music':
              IconComponent = Music;
              break;
            case 'PlayCircle':
              IconComponent = PlayCircle;
              break;
            case 'DollarSign':
              IconComponent = DollarSign;
              break;
            default:
              IconComponent = Users;
          }

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <StatsCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changeType={stat.change >= 0 ? 'increase' : 'decrease'}
                icon={IconComponent}
                prefix={stat.prefix}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Placeholder para gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Crescimento de Usuários</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
            <p className="text-gray-500">Gráfico de crescimento de usuários seria renderizado aqui</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Receita por Plano</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
            <p className="text-gray-500">Gráfico de receita por plano seria renderizado aqui</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Artistas</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
            <p className="text-gray-500">Gráfico de artistas mais populares seria renderizado aqui</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição Geográfica</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
            <p className="text-gray-500">Mapa de distribuição de usuários seria renderizado aqui</p>
          </div>
        </div>
      </div>
    </div>
  );
}