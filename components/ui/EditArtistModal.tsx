// components/ui/EditArtistModal.tsx
'use client';

import { useState, useCallback } from 'react';
import { Input, Select, Textarea, Checkbox, Switch } from './index';
import { useToast } from '@/components/hooks/useToast';
import { genreOptions, monetizationPlanOptions, paymentMethodOptions } from '../../data/selectOptions';
import Modal from './Modal';
import type { EditArtistModalProps, ArtistFormData } from '../../types/modal';

/**
 * Valores padrão para novo artista
 */
const defaultArtistData: ArtistFormData = {
  name: '',
  email: '',
  bio: '',
  genre: '',
  monetizationPlan: 'basic',
  paymentMethod: 'mpesa',
  phoneNumber: '',
  verified: false,
  isActive: true,
  receiveNotifications: true,
  allowPublicProfile: true,
};

/**
 * Validação do formulário
 */
function validateArtistForm(data: ArtistFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = 'Nome é obrigatório';
  }

  if (!data.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email inválido';
  }

  if (!data.genre) {
    errors.genre = 'Gênero musical é obrigatório';
  }

  if (data.bio.length < 50) {
    errors.bio = 'Biografia deve ter pelo menos 50 caracteres';
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
 * Componente EditArtistModal - Modal para criar/editar artistas
 */
export default function EditArtistModal({
  isOpen,
  onClose,
  onSave,
  artist,
  loading = false,
  mode = 'edit',
}: EditArtistModalProps) {
  
  const { success, error } = useToast();
  
  // Estado do formulário
  const [formData, setFormData] = useState<ArtistFormData>(
    artist || defaultArtistData
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler para mudanças nos campos
  const handleFieldChange = useCallback((field: keyof ArtistFormData) => 
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

  // Handler para reset do formulário
  const handleReset = useCallback(() => {
    setFormData(artist || defaultArtistData);
    setErrors({});
  }, [artist]);

  // Handler para submit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    const validationErrors = validateArtistForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      error('Formulário inválido', 'Corrija os erros e tente novamente');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      
      success(
        mode === 'create' ? 'Artista criado!' : 'Artista atualizado!',
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
          form="artist-form"
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
            mode === 'create' ? 'Criar Artista' : 'Salvar Alterações'
          )}
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Criar Novo Artista' : 'Editar Artista'}
      description={mode === 'create' 
        ? 'Preencha os dados para criar um novo artista na plataforma'
        : 'Atualize as informações do artista'
      }
      size="xl"
      footer={footer}
      closeOnBackdrop={!isSubmitting && !loading}
      closeOnEscape={!isSubmitting && !loading}
    >
      <div className="px-6 py-4">
        <form id="artist-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome do Artista"
                value={formData.name}
                onChange={handleFieldChange('name')}
                error={errors.name}
                required
                placeholder="Digite o nome do artista"
                disabled={isSubmitting || loading}
              />
              
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleFieldChange('email')}
                error={errors.email}
                required
                placeholder="artista@eimusic.co.mz"
                disabled={isSubmitting || loading}
              />
            </div>

            <div className="mt-4">
              <Textarea
                label="Biografia do Artista"
                value={formData.bio}
                onChange={handleFieldChange('bio')}
                error={errors.bio}
                placeholder="Conte a história do artista, suas influências, conquistas..."
                maxLength={500}
                minLength={50}
                autoResize
                helpText="Descreva a trajetória musical, estilo e principais sucessos do artista"
                required
                disabled={isSubmitting || loading}
              />
            </div>
          </div>

          {/* Informações Musicais */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Musicais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Gênero Musical"
                value={formData.genre}
                onChange={(value) => handleFieldChange('genre')(String(value))}
                options={genreOptions}
                error={errors.genre}
                required
                searchable
                disabled={isSubmitting || loading}
              />
              
              <Select
                label="Plano de Monetização"
                value={formData.monetizationPlan}
                onChange={(value) => handleFieldChange('monetizationPlan')(String(value))}
                options={monetizationPlanOptions}
                required
                disabled={isSubmitting || loading}
              />
            </div>
          </div>

          {/* Informações de Pagamento */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações de Pagamento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Método de Pagamento"
                value={formData.paymentMethod}
                onChange={(value) => handleFieldChange('paymentMethod')(String(value))}
                options={paymentMethodOptions}
                required
                disabled={isSubmitting || loading}
              />
              
              {formData.paymentMethod === 'mpesa' && (
                <Input
                  label="Número M-Pesa"
                  value={formData.phoneNumber || ''}
                  onChange={handleFieldChange('phoneNumber')}
                  error={errors.phoneNumber}
                  placeholder="+258 84 XXX XXXX"
                  required
                  disabled={isSubmitting || loading}
                  helpText="Formato: +258 84/85/86/87 XXX XXXX"
                />
              )}
            </div>
          </div>

          {/* Configurações de Status */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status e Configurações</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Checkbox
                  label="Artista Verificado"
                  checked={formData.verified}
                  onChange={handleFieldChange('verified')}
                  helpText="Badge de verificação no perfil público"
                  disabled={isSubmitting || loading}
                />
              </div>
              
              <div className="space-y-4">
                <Switch
                  label="Perfil Ativo"
                  checked={formData.isActive}
                  onChange={handleFieldChange('isActive')}
                  helpText="Permitir acesso e atividade na plataforma"
                  disabled={isSubmitting || loading}
                />
                
                <Switch
                  label="Receber Notificações"
                  checked={formData.receiveNotifications}
                  onChange={handleFieldChange('receiveNotifications')}
                  helpText="Emails sobre atividade da conta e atualizações"
                  disabled={isSubmitting || loading}
                />
                
                <Switch
                  label="Perfil Público Visível"
                  checked={formData.allowPublicProfile}
                  onChange={handleFieldChange('allowPublicProfile')}
                  helpText="Permitir que usuários vejam o perfil"
                  disabled={isSubmitting || loading}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}