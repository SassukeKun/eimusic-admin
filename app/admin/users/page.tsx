// app/admin/users/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';
import DataTable from '@/components/admin/DataTable';
import FilterBar from '@/components/admin/FilterBar';
import PageHeader from '@/components/admin/PageHeader';
import Button from '@/components/admin/Button';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import EditUserModal from '@/components/ui/EditUserModal';
import { useToast } from '@/components/hooks/useToast';
import { 
  mockUsersData, 
  filterUsers,
  type UserRecord 
} from '@/data/usersData';
import type { FilterConfig } from '@/types/admin';
import type { UserFormData } from '@/types/modal';
import type { ArtistStatus } from '@/types/modal';

export default function UsersPage() {
  const [filteredUsers, setFilteredUsers] = useState<UserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState<'create' | 'edit'>('edit');
  const itemsPerPage = 10; // Número de itens por página
  
  const { success, error } = useToast();

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
// app/admin/users/page.tsx - TRECHO DAS COLUNAS ATUALIZADO

  // Configuração das colunas da tabela - ATUALIZADA com campos de pagamento
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
            <div className="text-sm font-medium text-gray-900">
              {user.name}
            </div>
            <div className="text-sm text-gray-500">
              {user.email}
            </div>
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
            planClass = 'bg-blue-100 text-blue-800';
            planText = 'Premium';
            break;
          case 'vip':
            planClass = 'bg-purple-100 text-purple-800';
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
    // NOVA COLUNA: Método de Pagamento
    {
      key: 'paymentMethod' as keyof UserRecord,
      label: 'Método Pagamento',
      sortable: true,
      render: (value: unknown, user: UserRecord) => {
        if (!value) return <span className="text-gray-400">-</span>;
        
        const method = String(value);
        let methodClass = '';
        let methodText = '';
        
        switch (method) {
          case 'mpesa':
            methodClass = 'bg-green-100 text-green-800';
            methodText = 'M-Pesa';
            break;
          case 'visa':
            methodClass = 'bg-blue-100 text-blue-800';
            methodText = 'Visa/MC';
            break;
          case 'paypal':
            methodClass = 'bg-yellow-100 text-yellow-800';
            methodText = 'PayPal';
            break;
          default:
            methodClass = 'bg-gray-100 text-gray-800';
            methodText = method;
        }
        
        return (
          <div>
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${methodClass}`}>
              {methodText}
            </span>
            {user.phoneNumber && method === 'mpesa' && (
              <div className="text-xs text-gray-500 mt-1">
                {user.phoneNumber}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'totalSpent' as keyof UserRecord,
      label: 'Total Gasto',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-green-600 font-medium">
          MT {Number(value).toLocaleString('pt-MZ')}
        </span>
      ),
    },
    // NOVA COLUNA: Status da Assinatura
    {
      key: 'subscriptionStatus' as keyof UserRecord,
      label: 'Assinatura',
      sortable: true,
      render: (value: unknown) => {
        const status = String(value);
        let statusClass = '';
        let statusText = '';
        
        switch (status) {
          case 'active':
            statusClass = 'bg-green-100 text-green-800';
            statusText = 'Ativa';
            break;
          case 'expired':
            statusClass = 'bg-yellow-100 text-yellow-800';
            statusText = 'Expirada';
            break;
          case 'cancelled':
            statusClass = 'bg-red-100 text-red-800';
            statusText = 'Cancelada';
            break;
          default:
            statusClass = 'bg-gray-100 text-gray-800';
            statusText = status || 'N/A';
        }
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
            {statusText}
          </span>
        );
      },
    },
    // NOVA COLUNA: Último Pagamento
    {
      key: 'lastPaymentDate' as keyof UserRecord,
      label: 'Último Pagamento',
      sortable: true,
      render: (value: unknown) => {
        if (!value) return <span className="text-gray-400">-</span>;
        
        const date = new Date(String(value));
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let timeAgo = '';
        if (diffDays === 1) {
          timeAgo = 'ontem';
        } else if (diffDays < 7) {
          timeAgo = `${diffDays} dias atrás`;
        } else if (diffDays < 30) {
          timeAgo = `${Math.floor(diffDays / 7)} semanas atrás`;
        } else {
          timeAgo = date.toLocaleDateString('pt-MZ');
        }
        
        return (
          <div>
            <div className="text-sm text-gray-900">
              {date.toLocaleDateString('pt-MZ')}
            </div>
            <div className="text-xs text-gray-500">
              {timeAgo}
            </div>
          </div>
        );
      },
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
            statusClass = 'bg-gray-100 text-gray-800';
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
      key: 'actions',
      label: 'Ações',
      render: (_: unknown, user: UserRecord) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(user);
            }}
            className="p-1 text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(user);
            }}
            className="p-1 text-red-600 hover:text-red-800 focus:outline-none"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev, [filterKey]: value };
      const filtered = filterUsers(mockUsersData, newFilters, searchQuery);
      setFilteredUsers(filtered);
      return newFilters;
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const filtered = filterUsers(mockUsersData, activeFilters, query);
    setFilteredUsers(filtered);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setFilteredUsers(mockUsersData);
  };

  const handleRowClick = (user: UserRecord) => {
    setSelectedUser(user);
    setEditMode('edit');
    setIsEditModalOpen(true);
  };
  
  const handleEditClick = useCallback((user: UserRecord) => {
    setSelectedUser(user);
    setEditMode('edit');
    setIsEditModalOpen(true);
  }, []);
  
  const handleDeleteClick = useCallback((user: UserRecord) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  }, []);
  
  const handleCreateClick = useCallback(() => {
    setSelectedUser(null);
    setEditMode('create');
    setIsEditModalOpen(true);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  }, []);
  
  const handleSaveUser = useCallback(async (userData: UserFormData) => {
    setIsLoading(true);
    
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editMode === 'create') {
        // Simular criação de usuário
        const newUser: UserRecord = {
          ...userData,
          id: `${mockUsersData.length + 1}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff`,
          joinedDate: new Date().toISOString().split('T')[0],
          lastActive: new Date().toISOString().split('T')[0],
          totalSpent: 0,
          status: userData.isActive ? 'active' as ArtistStatus : 'inactive' as ArtistStatus,
        };
        
        // Atualizar dados localmente
        const updatedUsers = [...mockUsersData, newUser];
        setFilteredUsers(updatedUsers);
        
        success('Usuário criado com sucesso', 'O novo usuário foi adicionado ao sistema');
      } else {
        // Simular atualização de usuário
        const updatedUsers = mockUsersData.map(user => 
          user.id === selectedUser?.id 
            ? { 
                ...user, 
                name: userData.name,
                email: userData.email,
                plan: userData.plan,
                paymentMethod: userData.paymentMethod,
                phoneNumber: userData.phoneNumber,
                status: userData.isActive ? 'active' as ArtistStatus : 'inactive' as ArtistStatus,
                subscriptionStatus: userData.status,
              } 
            : user
        );
        
        // Atualizar dados localmente
        setFilteredUsers(updatedUsers);
        
        success('Usuário atualizado com sucesso', 'As alterações foram salvas');
      }
      
      handleCloseModal();
    } catch {
      error('Erro ao salvar usuário', 'Tente novamente mais tarde');
    } finally {
      setIsLoading(false);
    }
  }, [editMode, selectedUser, success, error, handleCloseModal]);
  
  const handleDeleteUser = useCallback(async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filtrar usuário excluído
      const updatedUsers = mockUsersData.filter(user => user.id !== selectedUser.id);
      setFilteredUsers(updatedUsers);
      
      success('Usuário excluído com sucesso', 'O usuário foi removido do sistema');
      handleCloseModal();
    } catch {
      error('Erro ao excluir usuário', 'Tente novamente mais tarde');
    } finally {
      setIsLoading(false);
    }
  }, [selectedUser, success, error, handleCloseModal]);

  // Mapear dados do usuário selecionado para o formato do formulário
  const mapUserToFormData = useCallback((user: UserRecord | null): UserFormData | undefined => {
    if (!user) return undefined;
    
    return {
      id: user.id,
      name: user.name as string,
      email: user.email as string,
      plan: user.plan,
      paymentMethod: user.paymentMethod,
      phoneNumber: user.phoneNumber || '',
      isActive: user.status === 'active',
      receiveNotifications: true, // Valor padrão
      status: user.subscriptionStatus || 'active',
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuários"
        description="Gerencie os usuários da plataforma"
      >
        <Button
          variant="primary"
          onClick={handleCreateClick}
          leftIcon={<Plus size={16} />}
        >
          Novo Usuário
        </Button>
      </PageHeader>
      
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onReset={handleResetFilters}
      />
      
      <DataTable
        data={filteredUsers}
        columns={columns}
        onRowClick={handleRowClick}
        itemsPerPage={itemsPerPage}
      />
      
      {/* Modal de Edição */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        user={mapUserToFormData(selectedUser)}
        loading={isLoading}
        mode={editMode}
      />
      
      {/* Modal de Confirmação de Exclusão */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir o usuário ${selectedUser?.name}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmVariant="danger"
        onConfirm={handleDeleteUser}
        onCancel={handleCloseModal}
      />
    </div>
  );
}