'use client';

import { useState } from 'react';
import { AlertTriangle, X, User as UserIcon, Trash2, Shield, Crown } from 'lucide-react';
import type { User } from '@/types/users';

interface DeleteUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: (userId: string) => Promise<void>;
}

export default function DeleteUserModal({
  isOpen,
  user,
  onClose,
  onConfirm
}: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      await onConfirm(user.id);
      onClose();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-semibold">Excluir Usuário</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800 mb-1">
                  Esta ação não pode ser desfeita
                </h3>
                <p className="text-sm text-red-700">
                  Todos os dados do usuário serão permanentemente removidos do sistema.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-4">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {user.hasActiveSubscription && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      <Crown className="inline w-3 h-3 mr-1" />
                      Assinante
                    </span>
                  )}
                  {user.isAdmin && (
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                      <Shield className="inline w-3 h-3 mr-1" />
                      Admin
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    Desde {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {user.isAdmin && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-orange-800 mb-1">
                    Atenção: Usuário Administrador
                  </h4>
                  <p className="text-sm text-orange-700">
                    Este usuário possui privilégios administrativos. Certifique-se de que há outros administradores ativos antes de prosseguir.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-yellow-800 mb-2">
              O que será perdido:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Perfil e dados pessoais do usuário</li>
              <li>• Histórico de playlists e favoritos</li>
              <li>• Dados de pagamento e assinatura</li>
              {user.hasActiveSubscription && (
                <li>• Assinatura ativa será cancelada</li>
              )}
              <li>• Histórico de reproduções e preferências</li>
              <li>• Comentários e avaliações</li>
              {user.isAdmin && (
                <li>• Acesso administrativo será revogado</li>
              )}
            </ul>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isDeleting ? (
                'Excluindo...'
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Definitivamente
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}