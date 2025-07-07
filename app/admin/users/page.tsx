'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Users, Crown, Shield, UserCheck, Mail, Calendar } from 'lucide-react';
import EditUserModal from '@/components/admin/EditUserModal';
import DeleteUserModal from '@/components/admin/DeleteUserModal';
import type { User, UsersResponse, UserFormData, UserFilters } from '@/types/users';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<UserFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [subscriptionPlans, setSubscriptionPlans] = useState<Array<{ id: string; name: string; price: number }>>([]);

  const pageSize = 20;

  useEffect(() => {
    fetchUsers();
    fetchSubscriptionPlans();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, filters]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (filters.hasSubscription !== undefined) params.append('hasSubscription', filters.hasSubscription.toString());
      if (filters.isAdmin !== undefined) params.append('isAdmin', filters.isAdmin.toString());

      const response = await fetch(`/api/users?${params}`);
      if (!response.ok) throw new Error('Falha ao carregar usuários');

      const data: UsersResponse = await response.json();
      setUsers(data.data);
      setTotalPages(data.totalPages);
      setTotalUsers(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await fetch('/api/subscription-plans');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionPlans(data);
      }
    } catch (err) {
      console.error('Erro ao carregar planos:', err);
      setSubscriptionPlans([
        { id: '1', name: 'Básico', price: 200 },
        { id: '2', name: 'Premium', price: 500 },
        { id: '3', name: 'VIP', price: 1000 }
      ]);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof UserFilters, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({});
    setCurrentPage(1);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsEditModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = async (formData: UserFormData) => {
    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Falha ao salvar usuário');

      await fetchUsers();
      setIsEditModalOpen(false);
    } catch (err) {
      throw err;
    }
  };

  const handleConfirmDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Falha ao excluir usuário');

      await fetchUsers();
      setIsDeleteModalOpen(false);
    } catch (err) {
      throw err;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const activeSubscriptions = users.filter(user => user.hasActiveSubscription).length;
  const adminUsers = users.filter(user => user.isAdmin).length;
  const subscriptionRate = totalUsers > 0 ? (activeSubscriptions / totalUsers) * 100 : 0;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Erro ao carregar usuários</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciamento de Usuários</h1>
            <p className="text-blue-100">
              Gerencie todos os usuários registrados na plataforma EiMusic
            </p>
          </div>
          <button
            onClick={handleCreateUser}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Usuário
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total de Usuários</p>
              <p className="text-2xl font-bold text-blue-900">{totalUsers.toLocaleString()}</p>
            </div>
            <Users className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Assinantes Ativos</p>
              <p className="text-2xl font-bold text-green-900">{activeSubscriptions}</p>
              <p className="text-xs text-green-600">{subscriptionRate.toFixed(1)}% do total</p>
            </div>
            <Crown className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Administradores</p>
              <p className="text-2xl font-bold text-purple-900">{adminUsers}</p>
            </div>
            <Shield className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Novos Este Mês</p>
              <p className="text-2xl font-bold text-orange-900">
                {users.filter(user => {
                  const userDate = new Date(user.createdAt);
                  const thisMonth = new Date();
                  return userDate.getMonth() === thisMonth.getMonth() && 
                         userDate.getFullYear() === thisMonth.getFullYear();
                }).length}
              </p>
            </div>
            <UserCheck className="w-10 h-10 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por nome ou email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={filters.hasSubscription?.toString() || ''}
              onChange={(e) => handleFilterChange('hasSubscription', 
                e.target.value === '' ? undefined : e.target.value === 'true'
              )}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as Assinaturas</option>
              <option value="true">Apenas Assinantes</option>
              <option value="false">Sem Assinatura</option>
            </select>

            <select
              value={filters.isAdmin?.toString() || ''}
              onChange={(e) => handleFilterChange('isAdmin', 
                e.target.value === '' ? undefined : e.target.value === 'true'
              )}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os Tipos</option>
              <option value="true">Apenas Admins</option>
              <option value="false">Usuários Normais</option>
            </select>

            {(searchQuery || Object.keys(filters).some(key => filters[key as keyof UserFilters] !== undefined)) && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                title="Limpar filtros"
              >
                <Filter className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Carregando usuários...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
            <p className="text-gray-500">
              {searchQuery || Object.keys(filters).length > 0
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando o primeiro usuário'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Usuário</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Criado em</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          {user.profileImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.profileImageUrl}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-gray-700">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.hasActiveSubscription 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.hasActiveSubscription ? (
                            <>
                              <Crown className="w-3 h-3 mr-1" />
                              Assinante
                            </>
                          ) : (
                            'Gratuito'
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </span>
                        ) : (
                          <span className="text-gray-500">Usuário</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Editar usuário"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Excluir usuário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-700">
                  Mostrando {(currentPage - 1) * pageSize + 1} a{' '}
                  {Math.min(currentPage * pageSize, totalUsers)} de {totalUsers} usuários
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <EditUserModal
        isOpen={isEditModalOpen}
        user={editingUser}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUser}
        subscriptionPlans={subscriptionPlans}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        user={deletingUser}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}