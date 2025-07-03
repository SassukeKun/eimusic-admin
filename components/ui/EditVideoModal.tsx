import { useState, useEffect } from 'react';
import { Video, Artist } from '@/types/admin';
import { VideoFormData } from '@/types/modal';
import Modal from './Modal';
import FormField from './FormField';
import Input from './Input';
import Select from './Select';
import Button from '@/components/admin/Button';

interface EditVideoModalProps {
  video: Video | null;
  artists: Artist[];
  onSave: (formData: VideoFormData) => void;
  onCancel: () => void;
}

export default function EditVideoModal({
  video,
  artists,
  onSave,
  onCancel
}: EditVideoModalProps) {
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    artistId: '',
    duration: 0,
    status: 'draft',
    videoFile: undefined,
    thumbnailFile: undefined
  });

  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preencher o formulário quando um vídeo é fornecido para edição
  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title,
        artistId: video.artistId,
        duration: video.duration,
        status: video.status,
        videoFile: undefined,
        thumbnailFile: undefined
      });
      
      setPreviewUrl(video.thumbnailUrl);
    }
  }, [video]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, videoFile: file }));
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnailFile: file }));
      
      // Criar URL de pré-visualização
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Limpar URL quando o componente for desmontado
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const parseDuration = (timeStr: string): number => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return (minutes * 60) + (seconds || 0);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeStr = e.target.value;
    try {
      const durationInSeconds = parseDuration(timeStr);
      setFormData(prev => ({ ...prev, duration: durationInSeconds }));
    } catch (error) {
      // Manter o valor anterior se a conversão falhar
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={video ? 'Editar Vídeo' : 'Adicionar Vídeo'}
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Título"
          htmlFor="title"
          required
        >
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Digite o título do vídeo"
            required
          />
        </FormField>

        <FormField
          label="Artista"
          htmlFor="artistId"
          required
        >
          <Select
            id="artistId"
            name="artistId"
            value={formData.artistId}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione um artista</option>
            {artists.map(artist => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Duração (minutos:segundos)"
          htmlFor="duration"
          required
        >
          <Input
            id="duration"
            name="duration"
            value={formatDuration(formData.duration)}
            onChange={handleDurationChange}
            placeholder="3:45"
            required
          />
        </FormField>

        <FormField
          label="Status"
          htmlFor="status"
          required
        >
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="removed">Removido</option>
          </Select>
        </FormField>

        <FormField
          label="Arquivo de Vídeo"
          htmlFor="videoFile"
        >
          <Input
            id="videoFile"
            name="videoFile"
            type="file"
            accept="video/*"
            onChange={handleVideoFileChange}
            className="w-full"
          />
          <p className="mt-1 text-sm text-gray-500">
            Formatos suportados: MP4, MOV, AVI, etc. (Máx: 100MB)
          </p>
        </FormField>

        <FormField
          label="Thumbnail Personalizado"
          htmlFor="thumbnailFile"
        >
          <div className="space-y-2">
            <Input
              id="thumbnailFile"
              name="thumbnailFile"
              type="file"
              accept="image/*"
              onChange={handleThumbnailFileChange}
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Se não for fornecido, um thumbnail será gerado automaticamente do vídeo
            </p>
            
            {previewUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Pré-visualização:</p>
                <img 
                  src={previewUrl} 
                  alt="Pré-visualização do thumbnail" 
                  className="w-32 h-20 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </FormField>

        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : video ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 