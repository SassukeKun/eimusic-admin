'use client';

import { useState, useCallback, useRef } from 'react';
import { Input, Select } from './index';
import { useToast } from '@/components/hooks/useToast';
import { artistOptions, contentStatusOptions } from '../../data/selectOptions';
import Modal from './Modal';
import { Upload, Video } from 'lucide-react';
import Image from 'next/image';
import { EditVideoModalProps, VideoFormData, ContentStatus } from '@/types/modal';

/**
 * Valores padrão para novo vídeo
 */
const defaultVideoData: VideoFormData = {
  title: '',
  artistId: '',
  duration: 0,
  status: 'draft',
  uploadDate: new Date().toISOString().split('T')[0], // Data atual formatada como YYYY-MM-DD
  thumbnailUrl: '',
  videoUrl: '',
};

/**
 * Validação do formulário
 */
function validateVideoForm(data: VideoFormData, mode: 'create' | 'edit' = 'create'): Record<string, string> {
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

  if (!data.uploadDate) {
    errors.uploadDate = 'Data de upload é obrigatória';
  }

  if (!data.videoUrl && mode === 'create') {
    errors.videoUrl = 'URL do vídeo é obrigatória';
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
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Componente EditVideoModal - Modal para criar/editar vídeos
 */
export default function EditVideoModal({
  isOpen,
  onClose,
  onSave,
  video,
  loading = false,
  mode = 'edit',
}: EditVideoModalProps) {
  
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estado do formulário
  const [formData, setFormData] = useState<VideoFormData>(
    video || defaultVideoData
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [durationStr, setDurationStr] = useState(
    video ? secondsToTime(video.duration) : '0:00'
  );
  const [previewImage, setPreviewImage] = useState<string | undefined>(video?.thumbnailUrl);

  // Handler para mudanças nos campos
  const handleFieldChange = useCallback((field: keyof VideoFormData) => 
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

  // Handler para upload de imagem de thumbnail
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
    handleFieldChange('thumbnailFile')(file);
    handleFieldChange('thumbnailUrl')(imageUrl);
  }, [error, handleFieldChange]);

  // Trigger para o input de arquivo
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handler específico para o campo de duração
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
    setFormData(video || defaultVideoData);
    setDurationStr(video ? secondsToTime(video.duration) : '0:00');
    setPreviewImage(video?.thumbnailUrl);
    setErrors({});
  }, [video]);

  // Handler para submit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    const validationErrors = validateVideoForm(formData, mode);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      error('Formulário inválido', 'Corrija os erros e tente novamente');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      
      success(
        mode === 'create' ? 'Vídeo criado!' : 'Vídeo atualizado!',
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
          form="video-form"
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
            mode === 'create' ? 'Criar Vídeo' : 'Salvar Alterações'
          )}
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Criar Novo Vídeo' : 'Editar Vídeo'}
      description={mode === 'create' 
        ? 'Preencha os dados para adicionar um novo vídeo à plataforma'
        : 'Atualize as informações do vídeo'
      }
      size="lg"
      footer={footer}
      closeOnBackdrop={!isSubmitting && !loading}
      closeOnEscape={!isSubmitting && !loading}
    >
      <div className="px-6 py-4">
        <form id="video-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Título do Vídeo"
                value={formData.title}
                onChange={handleFieldChange('title')}
                error={errors.title}
                required
                placeholder="Digite o título do vídeo"
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
              
              <Input
                label="Data de Upload"
                type="text"
                value={formData.uploadDate}
                onChange={handleFieldChange('uploadDate')}
                error={errors.uploadDate}
                required
                disabled={isSubmitting || loading}
              />
              
              <Select
                label="Status"
                value={formData.status}
                onChange={(value) => handleFieldChange('status')(String(value) as ContentStatus)}
                options={contentStatusOptions}
                required
                disabled={isSubmitting || loading}
              />
              
              <Input
                label="URL do Vídeo"
                value={formData.videoUrl || ''}
                onChange={handleFieldChange('videoUrl')}
                error={errors.videoUrl}
                placeholder="https://youtube.com/watch?v=..."
                helpText="YouTube, Vimeo ou outro serviço de vídeo"
                disabled={isSubmitting || loading}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem de Thumbnail
              </label>
              
              <div className="flex items-start space-x-4">
                {/* Preview da imagem */}
                <div className="flex-shrink-0">
                  <div className="h-32 w-48 rounded-md overflow-hidden bg-gray-100 border border-gray-200 relative">
                    {previewImage ? (
                      <>
                        <Image
                          src={previewImage}
                          alt="Thumbnail do vídeo"
                          width={192}
                          height={128}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <Video className="h-8 w-8 text-white opacity-80" />
                        </div>
                      </>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <span className="text-xs text-center px-2">Sem thumbnail</span>
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
                    {previewImage ? 'Trocar thumbnail' : 'Carregar thumbnail'}
                  </button>
                  
                  {previewImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(undefined);
                        handleFieldChange('thumbnailUrl')('');
                        handleFieldChange('thumbnailFile')(undefined as unknown as File);
                      }}
                      disabled={isSubmitting || loading}
                      className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remover
                    </button>
                  )}
                  
                  <p className="mt-2 text-sm text-gray-500">
                    Formatos: JPG, PNG. Resolução recomendada: 1280x720
                  </p>
                </div>
              </div>
              
              {errors.thumbnailUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.thumbnailUrl}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}