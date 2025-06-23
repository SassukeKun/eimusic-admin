/**
 * Página de Gestão de Usuários - EiMusic Admin
 * Responsabilidade: orquestrar componentes de gestão de usuários
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Mail, Plus, MoreVertical } from 'lucide-react';
import Button from '@/components/ui/Button';
import UsersStats from '@/components/admin/UsersStats';
import UsersFilters from '@/components/admin/UsersFilters';
import { useUsersData } from '@/hooks/useUsersData';
import type { AdminUser } from '@/types/admin';

/**
 * Componente de header da página
 */
const PageHeader: React.FC<{
  onExport: () => void;
  onBulkEmail: () => void;
  isRefreshing: boolean;
}> = ({ onExport, onBulkEmail, isRefreshing }) => (
  <motion.div
    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" as const }}
  >
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">
        Gestão de Usuários
      </h1>
      <p className="text-gray-400">
        Administre usuários da plataforma EiMusic em Moçambique
      </p>
    </div>

    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        leftIcon={<Download size={16} />}
        onClick={onExport}
        disabled={isRefreshing}
      >
        Exportar CSV
      </Button>
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<Mail size={16} />}
        onClick={onBulkEmail}
        disabled={isRefreshing}
      >
        Email em Massa
      </Button>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<Plus size={16} />}
      >
        Novo Usuário
      </Button>
    </div>
  </motion.div>
);

/**
 * Componente de tabela de usuários (temporário - será um componente separado)
 */
const UsersTablePreview: React.FC<{
  users: AdminUser[];
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  onViewUser: (user: AdminUser) => void;
}> = ({ users, isLoading, formatCurrency, formatDate, onViewUser }) => {
  if (isLoading) {
    return (
      <motion.div
        className="admin-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
      >
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="admin-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" as const }}
    >
      {/* Header da tabela */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Lista de Usuários ({users.length})
          </h2>
          <div className="text-sm text-gray-400">
            Total: {users.length} usuários
          </div>
        </div>
      </div>

      {/* Tabela responsiva */}
      <div className="overflow-x-auto">
        {users.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left py-3 px-6 text-gray-300 font-medium text-sm">
                  Usuário
                </th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium text-sm">
                  Contato
                </th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium text-sm">
                  Plano
                </th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium text-sm">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium text-sm">
                  Total Gasto
                </th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium text-sm">
                  Última Atividade
                </th>
                <th className="text-center py-3 px-6 text-gray-300 font-medium text-sm">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.slice(0, 10).map((user, index) => (
                <motion.tr
                  key={user.id}
                  className="hover:bg-gray-800/30 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.03, ease: "easeOut" as const }}
                  onClick={() => onViewUser(user)}
                >
                  {/* Usuário */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{user.name}</p>
                        <p className="text-gray-400 text-sm truncate">{user.location}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contato */}
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <p className="text-gray-300 text-sm truncate">{user.email}</p>
                      <p className="text-gray-400 text-xs">{user.phone}</p>
                    </div>
                  </td>

                  {/* Plano */}
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.plan === 'vip' 
                        ? 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20'
                        : user.plan === 'premium'
                        ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20'
                        : 'text-gray-400 bg-gray-500/10 border border-gray-500/20'
                    }`}>
                      {user.plan.toUpperCase()}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active'
                        ? 'text-green-400 bg-green-500/10 border border-green-500/20'
                        : user.status === 'pending'
                        ? 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20'
                        : user.status === 'blocked'
                        ? 'text-red-400 bg-red-500/10 border border-red-500/20'
                        : 'text-gray-400 bg-gray-500/10 border border-gray-500/20'
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  {/* Total Gasto */}
                  <td className="py-4 px-6">
                    <span className="text-green-400 font-medium text-sm">
                      {formatCurrency(user.totalSpent)}
                    </span>
                  </td>

                  {/* Última Atividade */}
                  <td className="py-4 px-6">
                    <span className="text-gray-400 text-sm">
                      {formatDate(user.lastActivity).split(',')[0]}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center">
                      <motion.button
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Ações para usuário:', user.id);
                        }}
                      >
                        <MoreVertical size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <Plus size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-400 mb-2">Nenhum usuário encontrado</p>
            <p className="text-gray-500 text-sm">
              Tente ajustar os filtros ou adicionar novos usuários
            </p>
          </div>
        )}
      </div>

      {/* Paginação (placeholder) */}
      {users.length > 10 && (
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Mostrando 1-10 de {users.length} usuários
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Próximo
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Modal simples de detalhes do usuário
 */
const UserModal: React.FC<{
  user: AdminUser;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}> = ({ user, onClose, formatCurrency, formatDate }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <motion.div
      className="admin-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Detalhes do Usuário
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Nome</label>
              <p className="text-white">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Telefone</label>
              <p className="text-white">{user.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Localização</label>
              <p className="text-white">{user.location}, Moçambique</p>
            </div>
          </div>

          {/* Status e plano */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                user.status === 'active'
                  ? 'text-green-400 bg-green-500/10 border border-green-500/20'
                  : user.status === 'pending'
                  ? 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20'
                  : 'text-red-400 bg-red-500/10 border border-red-500/20'
              }`}>
                {user.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Plano</label>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                user.plan === 'vip'
                  ? 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20'
                  : user.plan === 'premium'
                  ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20'
                  : 'text-gray-400 bg-gray-500/10 border border-gray-500/20'
              }`}>
                {user.plan.toUpperCase()}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Método de Pagamento</label>
              <p className="text-white">{user.preferredPayment}</p>
            </div>
          </div>

          {/* Dados financeiros */}
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h3 className="text-white font-medium mb-3">Informações Financeiras</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400">Total Gasto</label>
                <p className="text-green-400 font-semibold text-lg">
                  {formatCurrency(user.totalSpent)}
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-400">Assinatura Ativa</label>
                <p className={user.isSubscriptionActive ? 'text-green-400' : 'text-gray-400'}>
                  {user.isSubscriptionActive ? 'Sim' : 'Não'}
                </p>
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Data de Registro</label>
              <p className="text-white">{formatDate(user.registeredAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Última Atividade</label>
              <p className="text-white">{formatDate(user.lastActivity)}</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
          <Button variant="primary" size="sm" className="flex-1">
            Editar Usuário
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Enviar Email
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </motion.div>
  </div>
);

/**
 * Componente principal da página
 */
export default function UsersPage() {
  // Estados locais
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Hook de dados
  const {
    filteredUsers,
    statistics,
    isLoading,
    isRefreshing,
    error,
    filters,
    setFilters,
    clearFilters,
    refreshUsers,
    formatCurrency,
    formatDate,
    exportUsers
  } = useUsersData();

  // Handlers
  const handleBulkEmail = () => {
    console.log('Enviando email em massa para usuários filtrados');
    // TODO: Implementar modal de email em massa
  };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
  };

  // Renderizar erro se houver
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          onExport={exportUsers}
          onBulkEmail={handleBulkEmail}
          isRefreshing={isRefreshing}
        />
        <div className="admin-card p-8 text-center">
          <div className="text-red-400 mb-2">⚠️ Erro ao carregar dados</div>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={refreshUsers} variant="primary">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <PageHeader
        onExport={exportUsers}
        onBulkEmail={handleBulkEmail}
        isRefreshing={isRefreshing}
      />

      {/* Estatísticas */}
      <UsersStats
        statistics={statistics}
        isLoading={isLoading}
      />

      {/* Filtros */}
      <UsersFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        totalUsers={statistics.total}
        filteredCount={filteredUsers.length}
        isRefreshing={isRefreshing}
        onRefresh={refreshUsers}
      />

      {/* Tabela de usuários */}
      <UsersTablePreview
        users={filteredUsers}
        isLoading={isLoading}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        onViewUser={handleViewUser}
      />

      {/* Modal de detalhes do usuário */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}