'use client';

import { useState, useCallback, useRef } from 'react';
import { Input, Select } from './index';
import { useToast } from '@/components/hooks/useToast';
import { artistOptions, contentStatusOptions } from '../../data/selectOptions';
import Modal from './Modal';
import { Upload } from 'lucide-react';
import Image from 'next/image';

/**
 * Interface para props do modal de edição de faixa
 */
export interface EditTrackModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (data: TrackFormData) => void;
  readonly track?: TrackFormData;
  readonly loading?: boolean;
  readonly mode?: 'create' | 'edit';
}

/**
 * Interface para dados do formulário de faixa
 */
export interface TrackFormData {
  readonly id?: string;
  readonly title: string;
  readonly artistId: string;
  readonly duration: number;
  readonly status: 'published' | 'draft' | 'removed';
  readonly coverArt?: string;
  readonly coverFile?: File;
}

/**
 * Valores padrão para nova faixa
 */
const defaultTrackData: TrackFormData = {
  title: '',
  artistId: '',
  duration: 0,
  status: 'draft',
  coverArt: '',
};

/**
 * Validação do formulário
 */
function validateTrackForm(data: TrackFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = 'Título é obrigatório';
  }

  if (!data.artistId) {
    errors.artistId = 'Artista é obrigatório';
  }

  if (!data.duration || data.duration <= 0) {
    errors.duration = 'Duração deve ser maior que zero';
  }

  return errors;
}

/**
 * Função para converter string de tempo (mm:ss) para segundos
 */
function timeToSeconds(timeStr: string): number {
  const [minutes, seconds] = timeStr.split(':').map(Number);
  return (minutes * 60) + seconds;
}

/**
 * Função para converter segundos para string de tempo (mm:ss)
 */
function secondsToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Componente EditTrackModal - Modal para criar/editar faixas
 */
export default function EditTrackModal({
  isOpen,
  onClose,
  onSave,
  track,
  loading = false,
  mode = 'edit',
}: EditTrackModalProps) {
  
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estado do formulário
  const [formData, setFormData] = useState<TrackFormData>(
    track || defaultTrackData
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [durationStr, setDurationStr] = useState(
    track ? secondsToTime(track.duration) : '0:00'
  );
  const [previewImage, setPreviewImage] = useState<string | undefined>(track?.coverArt);

  // Handler para mudanças nos campos
  const handleFieldChange = useCallback((field: keyof TrackFormData) => 
    (value: string | number | File) => {
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

  // Handler para upload de imagem
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      error('Tipo de arquivo inválido', 'Por favor, selecione uma imagem');
      return;
    }

    // Verificar tamanho do arquivo (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      error('Arquivo muito grande', 'O tamanho máximo permitido é 2MB');
      return;
    }

    // Criar URL para preview
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    
    // Atualizar formData
    handleFieldChange('coverFile')(file);
    handleFieldChange('coverArt')(imageUrl);
  }, [error, handleFieldChange]);

  // Trigger para o input de arquivo
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handler para mudanças no campo de duração
  const handleDurationChange = useCallback((value: string) => {
    setDurationStr(value);
    
    // Converter para segundos e atualizar no formData
    try {
      const durationInSeconds = timeToSeconds(value);
      handleFieldChange('duration')(durationInSeconds);
    } catch {
      // Se não for possível converter, mantém o valor anterior
      setErrors(prev => ({
        ...prev,
        duration: 'Formato inválido. Use mm:ss'
      }));
    }
  }, [handleFieldChange]);

  // Handler para reset do formulário
  const handleReset = useCallback(() => {
    setFormData(track || defaultTrackData);
    setDurationStr(track ? secondsToTime(track.duration) : '0:00');
    setPreviewImage(track?.coverArt);
    setErrors({});
  }, [track]);

  // Handler para submit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    const validationErrors = validateTrackForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      error('Formulário inválido', 'Corrija os erros e tente novamente');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      
      success(
        mode === 'create' ? 'Faixa criada!' : 'Faixa atualizada!',
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
          form="track-form"
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
            mode === 'create' ? 'Criar Faixa' : 'Salvar Alterações'
          )}
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Criar Nova Faixa' : 'Editar Faixa'}
      description={mode === 'create' 
        ? 'Preencha os dados para adicionar uma nova faixa à plataforma'
        : 'Atualize as informações da faixa'
      }
      size="lg"
      footer={footer}
      closeOnBackdrop={!isSubmitting && !loading}
      closeOnEscape={!isSubmitting && !loading}
    >
      <div className="px-6 py-4">
        <form id="track-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Título da Faixa"
                value={formData.title}
                onChange={handleFieldChange('title')}
                error={errors.title}
                required
                placeholder="Digite o título da faixa"
                disabled={isSubmitting || loading}
              />
              
              <Select
                label="Artista"
                value={formData.artistId}
                onChange={(value) => handleFieldChange('artistId')(String(value))}
                options={artistOptions}
                error={errors.artistId}
                required
                searchable
                disabled={isSubmitting || loading}
              />
            </div>
          </div>

          {/* Informações Técnicas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Técnicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Duração (mm:ss)"
                value={durationStr}
                onChange={handleDurationChange}
                error={errors.duration}
                placeholder="3:30"
                required
                helpText="Formato: minutos:segundos"
                disabled={isSubmitting || loading}
              />
              
              <Select
                label="Status"
                value={formData.status}
                onChange={(value) => handleFieldChange('status')(String(value))}
                options={contentStatusOptions}
                required
                disabled={isSubmitting || loading}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem de Capa
              </label>
              
              <div className="flex items-start space-x-4">
                {/* Preview da imagem */}
                <div className="flex-shrink-0">
                  <div className="h-32 w-32 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt="Capa da faixa"
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <span className="text-xs text-center px-2">Sem imagem</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Controles de upload */}
                <div className="flex-grow">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    disabled={isSubmitting || loading}
                  />
                  
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={isSubmitting || loading}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {previewImage ? 'Trocar imagem' : 'Carregar imagem'}
                  </button>
                  
                  {previewImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(undefined);
                        handleFieldChange('coverArt')('');
                        handleFieldChange('coverFile')(undefined as unknown as File);
                      }}
                      disabled={isSubmitting || loading}
                      className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remover
                    </button>
                  )}
                  
                  <p className="mt-2 text-sm text-gray-500">
                    Formatos: JPG, PNG, GIF. Tamanho máximo: 2MB
                  </p>
                </div>
              </div>
              
              {errors.coverArt && (
                <p className="mt-1 text-sm text-red-600">{errors.coverArt}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
