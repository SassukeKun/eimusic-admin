'use client';

import { useState, useEffect } from 'react';
import { X, Upload, User as UserIcon, Mail, Shield, CreditCard, Crown } from 'lucide-react';
import type { User, UserFormData } from '@/types/users';

interface EditUserModalProps {
  isOpen: boolean;
  user?: User | null;
  onClose: () => void;
  onSave: (data: UserFormData) => Promise<void>;
  subscriptionPlans: Array<{ id: string; name: string; price: number }>;
}

export default function EditUserModal({
  isOpen,
  user,
  onClose,
  onSave,
  subscriptionPlans
}: EditUserModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'subscription' | 'permissions'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    paymentMethod: '',
    hasActiveSubscription: false,
    subscriptionPlanId: '',
    isAdmin: false,
  });

  const isEditMode = Boolean(user);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        paymentMethod: user.paymentMethod || '',
        hasActiveSubscription: user.hasActiveSubscription,
        subscriptionPlanId: user.subscriptionPlanId || '',
        isAdmin: user.isAdmin,
        existingProfileImageUrl: user.profileImageUrl,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        paymentMethod: '',
        hasActiveSubscription: false,
        subscriptionPlanId: '',
        isAdmin: false,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserIcon className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-semibold">
                {isEditMode ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isEditMode && user && (
          <div className="bg-gray-50 px-6 py-4 border-b">
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
              <div>
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.hasActiveSubscription 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.hasActiveSubscription ? 'Assinatura Ativa' : 'Sem Assinatura'}
                  </span>
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
        )}

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'basic'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Dados Básicos
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'subscription'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Assinatura
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'permissions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Permissões
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome do usuário"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Upload className="inline w-4 h-4 mr-1" />
                    Foto de Perfil (Opcional)
                  </label>
                  {formData.existingProfileImageUrl ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-2">Foto atual:</p>
                      <img
                        src={formData.existingProfileImageUrl}
                        alt="Foto atual"
                        className="w-24 h-24 object-cover rounded-full"
                      />
                    </div>
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.files?.[0] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasSubscription"
                    checked={formData.hasActiveSubscription}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      hasActiveSubscription: e.target.checked,
                      subscriptionPlanId: e.target.checked ? formData.subscriptionPlanId : ''
                    })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="hasSubscription" className="text-sm font-medium text-gray-700">
                    <Crown className="inline w-4 h-4 mr-1" />
                    Usuário tem assinatura ativa
                  </label>
                </div>

                {formData.hasActiveSubscription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plano de Assinatura
                    </label>
                    <select
                      value={formData.subscriptionPlanId}
                      onChange={(e) => setFormData({ ...formData, subscriptionPlanId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um plano</option>
                      {subscriptionPlans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - {plan.price} MT/mês
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="inline w-4 h-4 mr-1" />
                    Método de Pagamento (Opcional)
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione o método</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="emola">E-Mola</option>
                    <option value="cartao">Cartão de Crédito</option>
                    <option value="transferencia">Transferência Bancária</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-yellow-800 mb-1">
                        Permissões de Administrador
                      </h3>
                      <p className="text-sm text-yellow-700">
                        Administradores têm acesso completo ao painel e podem gerenciar todos os aspectos da plataforma.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isAdmin" className="text-sm font-medium text-gray-700">
                    <Shield className="inline w-4 h-4 mr-1" />
                    Conceder privilégios de administrador
                  </label>
                </div>

                {formData.isAdmin && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h4 className="font-medium text-purple-800 mb-2">
                      Permissões incluídas:
                    </h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Gerenciar usuários e artistas</li>
                      <li>• Moderar conteúdo (faixas, álbuns, vídeos)</li>
                      <li>• Acessar relatórios financeiros</li>
                      <li>• Configurar sistema e políticas</li>
                      <li>• Acesso completo ao painel administrativo</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name || !formData.email}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Salvando...' : isEditMode ? 'Salvar Alterações' : 'Criar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}