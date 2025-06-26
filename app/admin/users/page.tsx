// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import DataTable from '@/components/admin/DataTable';
import FilterBar from '@/components/admin/FilterBar';
import { 
  mockUsersData, 
  filterUsers,
  type UserRecord 
} from '@/data/usersData';
import type { FilterConfig } from '@/types/admin';

export default function UsersPage() {
  const [filteredUsers, setFilteredUsers] = useState<UserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Inicializar os usuários filtrados com todos os usuários
  useEffect(() => {
    setFilteredUsers(mockUsersData);
  }, []);

  // Configuração dos filtros
  const filters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Ativo' },
        { value: 'inactive', label: 'Inativo' },
        { value: 'suspended', label: 'Suspenso' },
      ],
    },
    {
      key: 'plan',
      label: 'Plano',
      type: 'select',
      options: [
        { value: 'free', label: 'Gratuito' },
        { value: 'premium', label: 'Premium' },
        { value: 'vip', label: 'VIP' },
      ],
    },
    {
      key: 'joinedDate',
      label: 'Data de Ingresso',
      type: 'date',
    },
  ];

  // Configuração das colunas da tabela
  const columns = [
    {
      key: 'name' as keyof UserRecord,
      label: 'Usuário',
      sortable: true,
      render: (value: unknown, user: UserRecord) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <Image
              className="h-10 w-10 rounded-full"
              src={user.avatar?.toString() || 'https://ui-avatars.com/api/?name=Unknown&background=6366f1&color=fff'}
              alt={user.name?.toString() || 'Usuário'}
              width={40}
              height={40}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'plan' as keyof UserRecord,
      label: 'Plano',
      sortable: true,
      render: (value: unknown) => {
        const plan = String(value);
        let planClass = '';
        let planText = '';
        
        switch (plan) {
          case 'free':
            planClass = 'bg-gray-100 text-gray-800';
            planText = 'Gratuito';
            break;
          case 'premium':
            planClass = 'bg-purple-100 text-purple-800';
            planText = 'Premium';
            break;
          case 'vip':
            planClass = 'bg-indigo-100 text-indigo-800';
            planText = 'VIP';
            break;
          default:
            planClass = 'bg-gray-100 text-gray-800';
            planText = plan;
        }
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${planClass}`}>
            {planText}
          </span>
        );
      },
    },
    {
      key: 'joinedDate' as keyof UserRecord,
      label: 'Data de Ingresso',
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
      key: 'lastActive' as keyof UserRecord,
      label: 'Última Atividade',
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
      key: 'totalSpent' as keyof UserRecord,
      label: 'Total Gasto',
      sortable: true,
      render: (value: unknown) => (
        <span>MT {Number(value).toLocaleString('pt-MZ')}</span>
      ),
    },
    {
      key: 'status' as keyof UserRecord,
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
          case 'inactive':
            statusClass = 'bg-yellow-100 text-yellow-800';
            statusText = 'Inativo';
            break;
          case 'suspended':
            statusClass = 'bg-red-100 text-red-800';
            statusText = 'Suspenso';
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
      key: 'id' as keyof UserRecord,
      label: 'Ações',
      render: () => (
        <div className="flex space-x-2">
          <button 
            className="text-indigo-600 hover:text-indigo-900"
            aria-label="Editar usuário"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button 
            className="text-red-600 hover:text-red-900"
            aria-label="Excluir usuário"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  // Manipuladores de eventos
  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    
    // Aplicar filtros aos dados usando a função do arquivo de dados
    const filtered = filterUsers(mockUsersData, newFilters, searchQuery);
    setFilteredUsers(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // Aplicar a nova pesquisa junto com os filtros existentes
    const filtered = filterUsers(mockUsersData, activeFilters, query);
    setFilteredUsers(filtered);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setFilteredUsers(mockUsersData);
  };

  const handleRowClick = (user: UserRecord) => {
    console.log('User clicked:', user);
    // Implementar a lógica de navegação ou exibição de detalhes aqui
  };

  return (
    <div>
      {/* Cabeçalho da página */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <p className="text-gray-600 mt-1">
          Gerencie os usuários da plataforma EiMusic.
        </p>
      </div>

      {/* Barra de filtros */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onReset={handleResetFilters}
      />

      {/* Tabela de usuários */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        onRowClick={handleRowClick}
      />
    </div>
  );
}