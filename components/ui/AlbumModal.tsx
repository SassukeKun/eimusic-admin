// components/ui/AlbumModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Save, Loader } from 'lucide-react';
import { Album } from '@/types/admin';

interface AlbumModalProps {
  isOpen: boolean;
  album?: Album | null;
  onClose: () => void;
  onSave: (albumData: AlbumFormData) => Promise<void>;
}

interface AlbumFormData {
  title: string;
  description: string;
  artistName: string;
  trackCount: number;
  releaseDate: string;
  visibility: 'public' | 'private';
  isExplicit: boolean;
  tags: string[];
  coverFile?: File | null;
  coverUrl?: string;
}

export type { AlbumFormData };

export default function AlbumModal({ isOpen, album, onClose, onSave }: AlbumModalProps) {
  const [formData, setFormData] = useState<AlbumFormData>({
    title: '',
    description: '',
    artistName: '',
    trackCount: 0,
    releaseDate: '',
    visibility: 'public',
    isExplicit: false,
    tags: [],
    coverFile: null,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Preencher formulário quando editar
  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title || '',
        description: album.description || '',
        artistName: album.artistName || '',
        trackCount: album.trackCount || 0,
        releaseDate: album.releaseDate ? album.releaseDate.split('T')[0] : '',
        visibility: album.visibility as 'public' | 'private' || 'public',
        isExplicit: album.isExplicit || false,
        tags: album.tags || [],
        coverFile: null,
        coverUrl: album.coverArt || '',
      });
      setPreviewUrl(album.coverArt || '');
    } else {
      // Reset para novo álbum
      setFormData({
        title: '',
        description: '',
        artistName: '',
        trackCount: 0,
        releaseDate: '',
        visibility: 'public',
        isExplicit: false,
        tags: [],
        coverFile: null,
      });
      setPreviewUrl('');
    }
  }, [album]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverFile: file }));
      
      // Preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar álbum:', error);
      alert('Erro ao salvar álbum');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {album ? 'Editar Álbum' : 'Novo Álbum'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white px-6 py-4 space-y-6">
            {/* Capa do álbum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capa do Álbum
              </label>
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload size={32} className="text-gray-400" />
                  )}
                </div>
                
                {/* Upload */}
                <div className="flex-1">
                  <input
                    id="album-cover-file"
                    name="coverFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-2 text-xs text-gray-500">PNG, JPG até 10MB</p>
                </div>
              </div>
            </div>

            {/* Título */}
            <div>
              <label htmlFor="album-title" className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                id="album-title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nome do álbum"
              />
            </div>

            {/* Artista */}
            <div>
              <label htmlFor="album-artist" className="block text-sm font-medium text-gray-700 mb-2">
                Artista *
              </label>
              <input
                id="album-artist"
                name="artistName"
                type="text"
                required
                value={formData.artistName}
                onChange={(e) => setFormData(prev => ({ ...prev, artistName: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nome do artista"
              />
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="album-description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                id="album-description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descrição do álbum"
              />
            </div>

            {/* Linha com Faixas e Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="album-track-count" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Faixas
                </label>
                <input
                  id="album-track-count"
                  name="trackCount"
                  type="number"
                  min="0"
                  value={formData.trackCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, trackCount: Number(e.target.value) }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="album-release-date" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Lançamento
                </label>
                <input
                  id="album-release-date"
                  name="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="album-tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (separadas por vírgula)
              </label>
              <input
                id="album-tags"
                name="tags"
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Hip Hop, Nacional, Popular"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="album-public"
                  name="visibility"
                  type="checkbox"
                  checked={formData.visibility === 'public'}
                  onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.checked ? 'public' : 'private' }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="album-public" className="ml-2 block text-sm text-gray-700">
                  Tornar público
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="album-explicit"
                  name="isExplicit"
                  type="checkbox"
                  checked={formData.isExplicit}
                  onChange={(e) => setFormData(prev => ({ ...prev, isExplicit: e.target.checked }))}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="album-explicit" className="ml-2 block text-sm text-gray-700">
                  Conteúdo explícito
                </label>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {album ? 'Atualizar' : 'Criar'} Álbum
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}