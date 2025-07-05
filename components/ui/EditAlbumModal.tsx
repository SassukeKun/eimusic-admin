'use client';

import { useState, useEffect } from 'react';
import { Album, Artist } from '@/types/admin';
import { AlbumFormData } from '@/types/modal';
import Modal from './Modal';
import FormField from './FormField';
import Input from './Input';
import Select from './Select';
import Button from '@/components/admin/Button';
import Image from 'next/image';

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
        releaseDate: typeof album.releaseDate === 'string' && album.releaseDate.includes('T')
          ? album.releaseDate.split('T')[0]
          : album.releaseDate || '',
        status: album.status,
        coverFile: undefined
      });
      
      setPreviewUrl(album.coverArt);
    }
  }, [album]);

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
      isOpen={true}
      title={album ? 'Editar Álbum' : 'Adicionar Álbum'}
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Título" required>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
            placeholder="Digite o título do álbum"
            required
          />
        </FormField>
        <FormField label="Artista" required>
          <Select
            id="artistId"
            name="artistId"
            value={formData.artistId}
            options={artists.map(artist => ({ value: artist.id, label: artist.name }))}
            onChange={(value) => setFormData(prev => ({ ...prev, artistId: String(value) }))}
            required
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Número de Faixas">
            <Input
              id="trackCount"
              name="trackCount"
              type="text"
              value={formData.trackCount?.toString() || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, trackCount: Number(value) }))}
              placeholder="0"
            />
          </FormField>
          <FormField label="Duração Total (segundos)">
            <Input
              id="totalDuration"
              name="totalDuration"
              type="text"
              value={formData.totalDuration?.toString() || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, totalDuration: Number(value) }))}
              placeholder="0"
            />
          </FormField>
        </div>
        <FormField label="Data de Lançamento">
          <Input
            id="releaseDate"
            name="releaseDate"
            type="text"
            value={formData.releaseDate}
            onChange={(value) => setFormData(prev => ({ ...prev, releaseDate: value }))}
          />
        </FormField>
        <FormField label="Status" required>
          <Select
            id="status"
            name="status"
            value={formData.status}
            options={[
              { value: 'draft', label: 'Rascunho' },
              { value: 'published', label: 'Publicado' },
              { value: 'removed', label: 'Removido' }
            ]}
            onChange={(value) => setFormData(prev => ({ ...prev, status: value as 'draft' | 'published' | 'removed' }))}
            required
          />
        </FormField>
        <FormField label="Capa do Álbum">
          <div className="space-y-2">
            <Input
              id="coverFile"
              name="coverFile"
              type="text"
              onChange={() => {}}
              className="w-full"
            />
            {/* File input handled separately below */}
            <input
              id="coverFileHidden"
              name="coverFile"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button type="button" onClick={() => document.getElementById('coverFileHidden')?.click()} variant="outline" size="sm">
              Selecionar Capa
            </Button>
            {previewUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Pré-visualização:</p>
                <Image 
                  src={previewUrl} 
                  alt="Pré-visualização da capa" 
                  className="w-32 h-32 object-cover rounded border"
                  width={128}
                  height={128}
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