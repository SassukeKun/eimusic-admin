'use client';

import { useState, useEffect } from 'react';
import { Album, Artist } from '@/types/admin';
import { AlbumFormData } from '@/types/modal';
import Modal from './Modal';
import FormField from './FormField';
import Input from './Input';
import Select from './Select';
import Button from '@/components/admin/Button';

interface EditAlbumModalProps {
  album: Album | null;
  artists: Artist[];
  onSave: (formData: AlbumFormData) => void;
  onCancel: () => void;
}

export default function EditAlbumModal({
  album,
  artists,
  onSave,
  onCancel
}: EditAlbumModalProps) {
  const [formData, setFormData] = useState<AlbumFormData>({
    title: '',
    artistId: '',
    trackCount: 0,
    totalDuration: 0,
    releaseDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    coverFile: undefined
  });

  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preencher o formulário quando um álbum é fornecido para edição
  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title,
        artistId: album.artistId,
        trackCount: album.trackCount,
        totalDuration: album.totalDuration,
        releaseDate: album.releaseDate.split('T')[0],
        status: album.status,
        coverFile: undefined
      });
      
      setPreviewUrl(album.coverArt);
    }
  }, [album]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverFile: file }));
      
      // Criar URL de pré-visualização
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Limpar URL quando o componente for desmontado
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erro ao salvar álbum:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={album ? 'Editar Álbum' : 'Adicionar Álbum'}
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
            placeholder="Digite o título do álbum"
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Número de Faixas"
            htmlFor="trackCount"
          >
            <Input
              id="trackCount"
              name="trackCount"
              type="number"
              min="0"
              value={formData.trackCount}
              onChange={handleNumberChange}
              placeholder="0"
            />
          </FormField>

          <FormField
            label="Duração Total (segundos)"
            htmlFor="totalDuration"
          >
            <Input
              id="totalDuration"
              name="totalDuration"
              type="number"
              min="0"
              value={formData.totalDuration}
              onChange={handleNumberChange}
              placeholder="0"
            />
          </FormField>
        </div>

        <FormField
          label="Data de Lançamento"
          htmlFor="releaseDate"
        >
          <Input
            id="releaseDate"
            name="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={handleInputChange}
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
          label="Capa do Álbum"
          htmlFor="coverFile"
        >
          <div className="space-y-2">
            <Input
              id="coverFile"
              name="coverFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
            
            {previewUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Pré-visualização:</p>
                <img 
                  src={previewUrl} 
                  alt="Pré-visualização da capa" 
                  className="w-32 h-32 object-cover rounded border"
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
            {isSubmitting ? 'Salvando...' : album ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
} 