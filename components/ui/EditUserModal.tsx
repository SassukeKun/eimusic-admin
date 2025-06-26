'use client';

import { useState, useCallback } from 'react';
import { Input, Select, Switch } from './index';
import { useToast } from '@/components/hooks/useToast';
import { monetizationPlanOptions, paymentMethodOptions } from '../../data/selectOptions';
import Modal from './Modal';
import type { EditUserModalProps, UserFormData, MonetizationPlan, PaymentMethod } from '../../types/modal';

/**
 * Valores padrão para novo usuário
 */
const defaultUserData: UserFormData = {
  name: '',
  email: '',
  plan: 'basic',
  paymentMethod: 'mpesa',
  phoneNumber: '',
  isActive: true,
  receiveNotifications: true,
  status: 'active',
};

/**
 * Validação do formulário
 */
function validateUserForm(data: UserFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = 'Nome é obrigatório';
  }

  if (!data.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email inválido';
  }

  if (data.paymentMethod === 'mpesa' && !data.phoneNumber?.trim()) {
    errors.phoneNumber = 'Número de telefone é obrigatório para M-Pesa';
  }

  if (data.phoneNumber && !/^\+258\s(8[4-7])\s\d{3}\s\d{4}$/.test(data.phoneNumber)) {
    errors.phoneNumber = 'Formato: +258 84 XXX XXXX';
  }

  return errors;
}

/**
 * Componente EditUserModal - Modal para criar/editar usuários
 */
export default function EditUserModal({
  isOpen,
  onClose,
  onSave,
  user,
  loading = false,
  mode = 'edit',
}: EditUserModalProps) {
  
  const { success, error } = useToast();
  
  // Estado do formulário
  const [formData, setFormData] = useState<UserFormData>(
    user || defaultUserData
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler para mudanças nos campos de texto e boolean
  const handleFieldChange = useCallback((field: keyof UserFormData) => 
    (value: string | boolean) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Limpar erro quando usuário começar a digitar
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }, [errors]
  );
  
  // Handler específico para campo de plano
  const handlePlanChange = useCallback((value: MonetizationPlan | MonetizationPlan[]) => {
    // Garantir que estamos lidando com um único valor, não um array
    const singleValue = Array.isArray(value) ? value[0] : value;
    
    setFormData(prev => ({ ...prev, plan: singleValue }));
    
    if (errors.plan) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.plan;
        return newErrors;
      });
    }
  }, [errors]);
  
  // Handler específico para campo de método de pagamento
  const handlePaymentMethodChange = useCallback((value: PaymentMethod | '' | (PaymentMethod | '')[]) => {
    // Garantir que estamos lidando com um único valor, não um array
    const singleValue = Array.isArray(value) ? value[0] : value;
    
    setFormData(prev => ({ ...prev, paymentMethod: singleValue as PaymentMethod }));
    
    if (errors.paymentMethod) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.paymentMethod;
        return newErrors;
      });
    }
  }, [errors]);

  // Handler para reset do formulário
  const handleReset = useCallback(() => {
    setFormData(user || defaultUserData);
    setErrors({});
  }, [user]);

  // Handler para submit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    const validationErrors = validateUserForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      error('Formulário inválido', 'Corrija os erros e tente novamente');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      
      success(
        mode === 'create' ? 'Usuário criado!' : 'Usuário atualizado!',
        'Dados salvos com sucesso'
      );
      
      onClose();
      
    } catch {
      error(
        'Erro ao salvar',
        'Tente novamente mais tarde'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSave, onClose, success, error, mode]);

  const footer = (
    <div className="flex justify-between w-full">
      <button
        type="button"
        onClick={handleReset}
        disabled={isSubmitting || loading}
        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        Limpar
      </button>
      
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting || loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          form="user-form"
          disabled={isSubmitting || loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Salvando...
            </div>
          ) : (
            mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'
          )}
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Criar Novo Usuário' : 'Editar Usuário'}
      description={mode === 'create' 
        ? 'Preencha os dados para criar um novo usuário na plataforma'
        : 'Atualize as informações do usuário'
      }
      size="lg"
      footer={footer}
      closeOnBackdrop={!isSubmitting && !loading}
      closeOnEscape={!isSubmitting && !loading}
    >
      <div className="px-6 py-4">
        <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome do Usuário"
                value={formData.name}
                onChange={handleFieldChange('name')}
                error={errors.name}
                required
                placeholder="Digite o nome do usuário"
                disabled={isSubmitting || loading}
              />
              
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleFieldChange('email')}
                error={errors.email}
                required
                placeholder="usuario@exemplo.com"
                disabled={isSubmitting || loading}
              />
            </div>
          </div>

          {/* Informações de Assinatura */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Assinatura</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Plano"
                value={formData.plan}
                onChange={handlePlanChange}
                options={monetizationPlanOptions}
                required
                disabled={isSubmitting || loading}
              />
              
              <Select
                label="Método de Pagamento"
                value={formData.paymentMethod || ''}
                onChange={handlePaymentMethodChange}
                options={paymentMethodOptions}
                disabled={formData.plan === 'basic' || isSubmitting || loading}
                helpText={formData.plan === 'basic' ? 'Plano básico não requer pagamento' : undefined}
              />
            </div>

            <div className="mt-4">
              <Input
                label="Número de Telefone (M-Pesa)"
                value={formData.phoneNumber || ''}
                onChange={handleFieldChange('phoneNumber')}
                error={errors.phoneNumber}
                placeholder="+258 84 123 4567"
                disabled={formData.paymentMethod !== 'mpesa' || isSubmitting || loading}
                helpText={formData.paymentMethod === 'mpesa' ? 'Formato: +258 84 XXX XXXX' : undefined}
              />
            </div>
          </div>

          {/* Configurações */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações</h3>
            
            <div className="space-y-4">
              <Switch
                label="Usuário Ativo"
                checked={formData.isActive}
                onChange={handleFieldChange('isActive')}
                disabled={isSubmitting || loading}
                helpText="Usuários inativos não podem fazer login"
              />
              
              <Switch
                label="Receber Notificações"
                checked={formData.receiveNotifications}
                onChange={handleFieldChange('receiveNotifications')}
                disabled={isSubmitting || loading}
                helpText="Enviar notificações por email e push"
              />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
