// app/admin/monetization/page.tsx
'use client';

import { useMemo } from 'react';
import { DollarSign, TrendingUp, Users, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import StatsCard from '@/components/admin/StatsCard';
import DataTable from '@/components/admin/DataTable';
import { 
  mockPlansData, 
  mockTransactionsData, 
  calculateMonetizationStats,
  type MonetizationPlanRecord,
  type RevenueTransactionRecord
} from '@/data/monetizationData';

export default function MonetizationPage() {
  // Usar os dados mockados do arquivo separado
  const plansData = useMemo(() => mockPlansData, []);
  const transactionsData = useMemo(() => mockTransactionsData, []);
  
  // Calcular estatísticas usando a função auxiliar
  const monetizationStats = useMemo(() => 
    calculateMonetizationStats(plansData), [plansData]);
    
  // Definir o número de itens por página para cada tabela
  const plansPerPage = 5;
  const transactionsPerPage = 10;

  // Configuração das colunas da tabela de planos
  const planColumns = [
    {
      key: 'name' as keyof MonetizationPlanRecord,
      label: 'Plano',
      sortable: true,
      render: (value: unknown, plan: MonetizationPlanRecord) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{plan.name}</div>
        </div>
      ),
    },
    {
      key: 'price' as keyof MonetizationPlanRecord,
      label: 'Preço',
      sortable: true,
      render: (value: unknown) => (
        <span>MT {Number(value).toLocaleString('pt-MZ')}</span>
      ),
    },
    {
      key: 'subscribers' as keyof MonetizationPlanRecord,
      label: 'Assinantes',
      sortable: true,
      render: (value: unknown) => Number(value).toLocaleString('pt-MZ'),
    },
    {
      key: 'monthlyRevenue' as keyof MonetizationPlanRecord,
      label: 'Receita Mensal',
      sortable: true,
      render: (value: unknown) => (
        <span>MT {Number(value).toLocaleString('pt-MZ')}</span>
      ),
    },
    {
      key: 'status' as keyof MonetizationPlanRecord,
      label: 'Status',
      sortable: true,
      render: (value: unknown) => {
        const status = String(value);
        let statusClass = '';
        let statusText = '';
        
        switch (status) {
          case 'active':
            statusClass = 'bg-green-100 text-green-800';
            statusText = 'Ativo';
            break;
          case 'deprecated':
            statusClass = 'bg-yellow-100 text-yellow-800';
            statusText = 'Descontinuado';
            break;
          case 'coming_soon':
            statusClass = 'bg-blue-100 text-blue-800';
            statusText = 'Em breve';
            break;
          default:
            statusClass = 'bg-gray-100 text-gray-800';
            statusText = status;
        }
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
            {statusText}
          </span>
        );
      },
    },
    {
      key: 'id' as keyof MonetizationPlanRecord,
      label: '',
      render: () => (
        <button 
          className="text-indigo-600 hover:text-indigo-900"
          aria-label="Ver detalhes"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      ),
    },
  ];

  // Configuração das colunas da tabela de transações
  const transactionColumns = [
    {
      key: 'userName' as keyof RevenueTransactionRecord,
      label: 'Usuário',
      sortable: true,
      render: (value: unknown, transaction: RevenueTransactionRecord) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <Image
              className="h-8 w-8 rounded-full"
              src={transaction.userAvatar?.toString() || 'https://ui-avatars.com/api/?name=Unknown&background=6366f1&color=fff'}
              alt={transaction.userName?.toString() || 'Usuário'}
              width={32}
              height={32}
            />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {transaction.userName}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'amount' as keyof RevenueTransactionRecord,
      label: 'Valor',
      sortable: true,
      render: (value: unknown, transaction: RevenueTransactionRecord) => (
        <span className={transaction.type === 'refund' ? 'text-red-600' : 'text-gray-900'}>
          {transaction.type === 'refund' ? '-' : ''}
          MT {Math.abs(Number(value)).toLocaleString('pt-MZ')}
        </span>
      ),
    },
    {
      key: 'planName' as keyof RevenueTransactionRecord,
      label: 'Plano',
      sortable: true,
    },
    {
      key: 'type' as keyof RevenueTransactionRecord,
      label: 'Tipo',
      sortable: true,
      render: (value: unknown) => {
        const type = String(value);
        let typeText = '';
        
        switch (type) {
          case 'subscription':
            typeText = 'Assinatura';
            break;
          case 'one_time':
            typeText = 'Pagamento único';
            break;
          case 'refund':
            typeText = 'Reembolso';
            break;
          default:
            typeText = type;
        }
        
        return typeText;
      },
    },
    {
      key: 'date' as keyof RevenueTransactionRecord,
      label: 'Data',
      sortable: true,
      render: (value: unknown) => {
        const date = new Date(String(value));
        return new Intl.DateTimeFormat('pt-MZ', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date);
      },
    },
    {
      key: 'status' as keyof RevenueTransactionRecord,
      label: 'Status',
      sortable: true,
      render: (value: unknown) => {
        const status = String(value);
        let statusClass = '';
        let statusText = '';
        
        switch (status) {
          case 'completed':
            statusClass = 'bg-green-100 text-green-800';
            statusText = 'Concluído';
            break;
          case 'pending':
            statusClass = 'bg-yellow-100 text-yellow-800';
            statusText = 'Pendente';
            break;
          case 'failed':
            statusClass = 'bg-red-100 text-red-800';
            statusText = 'Falhou';
            break;
          case 'refunded':
            statusClass = 'bg-gray-100 text-gray-800';
            statusText = 'Reembolsado';
            break;
          default:
            statusClass = 'bg-gray-100 text-gray-800';
            statusText = status;
        }
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
            {statusText}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      {/* Cabeçalho da página */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Monetização</h1>
        <p className="text-gray-600 mt-1">
          Gerencie os planos de monetização e visualize as receitas da plataforma.
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Receita Mensal"
          value={monetizationStats.totalMonthlyRevenue}
          change={monetizationStats.growth}
          changeType="increase"
          icon={DollarSign}
          prefix="MT "
        />
        <StatsCard
          title="Total de Assinantes"
          value={monetizationStats.totalSubscribers}
          change={4.3}
          changeType="increase"
          icon={Users}
        />
        <StatsCard
          title="Assinantes Pagantes"
          value={monetizationStats.paidSubscribers}
          change={6.8}
          changeType="increase"
          icon={Users}
        />
        <StatsCard
          title="Taxa de Conversão"
          value={monetizationStats.conversionRate.toFixed(1) + '%'}
          change={2.1}
          changeType="increase"
          icon={TrendingUp}
        />
      </div>

      {/* Seção de planos */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Planos de Monetização</h2>
        <DataTable
          data={plansData}
          columns={planColumns}
          itemsPerPage={plansPerPage}
        />
      </div>

      {/* Seção de transações recentes */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Transações Recentes</h2>
        <DataTable
          data={transactionsData}
          columns={transactionColumns}
          itemsPerPage={transactionsPerPage}
        />
      </div>
    </div>
  );
}