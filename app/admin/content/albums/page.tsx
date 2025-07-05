// app/admin/content/albums/page.tsx
'use client';

import { useEffect, useCallback, useState } from 'react';
import { getAllAlbums, deleteAlbum, createAlbum} from '@/services/albumsCrud';
import { Album } from '@/types/admin';
import { Plus, Edit, Trash2, Music, Calendar, User, X, Save, Upload } from 'lucide-react';

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
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
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

  // Função para carregar álbuns do banco
  const fetchAlbums = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllAlbums();
      console.log('✅ Álbuns carregados:', data);
      setAlbums(data);
    } catch (err) {
      console.error('❌ Erro ao carregar álbuns:', err);
      setError('Erro ao carregar álbuns');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função para upload de imagem
  const handleImageUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    
    try {
      console.log('📤 Iniciando upload da imagem...', file.name);
      
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'eimusic/albums');
      
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formDataUpload,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro no upload');
      }
      
      const result = await response.json();
      console.log('✅ Upload concluído:', result.url);
      return result.url;
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Função para lidar com seleção de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem');
        return;
      }
      
      // Validar tamanho (10MB máximo)
      if (file.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 10MB.');
        return;
      }
      
      setFormData(prev => ({ ...prev, coverFile: file }));
      
      // Preview local
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (albumId: string) => {
    if (confirm('Tem certeza que deseja excluir este álbum?')) {
      try {
        await deleteAlbum(albumId);
        setAlbums(prev => prev.filter(album => album.id !== albumId));
        alert('Álbum excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir álbum:', error);
        alert('Erro ao excluir álbum');
      }
    }
  };

  const handleCreateAlbum = () => {
    setSelectedAlbum(null);
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
    setIsModalOpen(true);
  };

  const handleEditAlbum = (album: Album) => {
    setSelectedAlbum(album);
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
    });
    setPreviewUrl(''); // Não mostrar preview da imagem existente
    setIsModalOpen(true);
  };

  // ✅ NOVA: Função de salvamento com upload integrado
  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('🚀 Iniciando salvamento...', formData);
      
      let coverUrl = '';
      
      // Se há um arquivo para upload, fazer upload primeiro
      if (formData.coverFile) {
        console.log('📤 Fazendo upload da imagem...');
        coverUrl = await handleImageUpload(formData.coverFile);
      }
      
      const albumData = {
        title: formData.title,
        description: formData.description,
        artistName: formData.artistName,
        trackCount: formData.trackCount,
        releaseDate: formData.releaseDate ? new Date(formData.releaseDate).toISOString() : '',
        visibility: formData.visibility,
        isExplicit: formData.isExplicit,
        tags: formData.tags,
        ...(coverUrl && { coverArt: coverUrl }), // Só adicionar se houver nova imagem
      };
      
      if (selectedAlbum) {
        // Atualizar álbum existente
        console.log('📝 Atualizando álbum...', albumData);
        
        const response = await fetch(`/api/albums/${selectedAlbum.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(albumData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Erro da API:', errorText);
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const updatedAlbum = await response.json();
        
        // Atualizar na lista
        setAlbums(prev => prev.map(album => 
          album.id === selectedAlbum.id ? updatedAlbum : album
        ));
        
        alert('Álbum atualizado com sucesso!');
      } else {
        // Criar novo álbum
        console.log('➕ Criando novo álbum...', albumData);
        
        const newAlbum = await createAlbum({
          title: formData.title,
          description: formData.description,
          artistId: '1', // TODO: Implementar seleção de artista
          artistName: formData.artistName,
          trackCount: formData.trackCount,
          totalDuration: 0,
          plays: 0,
          revenue: 0,
          releaseDate: formData.releaseDate ? new Date(formData.releaseDate).toISOString() : '',
          status: 'published',
          visibility: formData.visibility,
          isExplicit: formData.isExplicit,
          tags: formData.tags,
          coverArt: coverUrl,
        });
        
        setAlbums(prev => [...prev, newAlbum]);
        alert('Álbum criado com sucesso!');
      }
      
      setIsModalOpen(false);
      setPreviewUrl('');
    } catch (error) {
      console.error('❌ Erro ao salvar álbum:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Erro ao salvar álbum: ${errorMessage}`);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-200 h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-medium mb-2">Erro ao carregar álbuns</div>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchAlbums}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Álbuns</h1>
          <p className="text-gray-600">Gerencie os álbuns da plataforma ({albums.length})</p>
        </div>
        <button 
          onClick={handleCreateAlbum}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-colors"
        >
          <Plus size={20} />
          Novo Álbum
        </button>
      </div>

      {/* Content */}
      {albums.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <Music size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum álbum encontrado</h3>
          <p className="text-gray-500 mb-6">Comece criando seu primeiro álbum</p>
          <button 
            onClick={handleCreateAlbum}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
          >
            <Plus size={20} />
            Criar Primeiro Álbum
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map((album) => (
            <div key={album.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden group">
              {/* Imagem da capa */}
              <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {album.coverArt ? (
                  <img 
                    src={album.coverArt} 
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gray-200">
                          <div class="text-gray-400 text-center">
                            <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                            </svg>
                            <span class="text-sm">Sem capa</span>
                          </div>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <Music size={48} className="mx-auto mb-2" />
                      <span className="text-sm">Sem capa</span>
                    </div>
                  </div>
                )}
                
                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditAlbum(album)}
                      className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      title="Editar álbum"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(album.id)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      title="Excluir álbum"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Informações do álbum */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1" title={album.title}>
                  {album.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    <span className="truncate">{album.artistName || 'Artista não informado'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Music size={14} />
                    <span>{album.trackCount || 0} faixas</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>
                      {album.releaseDate 
                        ? new Date(album.releaseDate).toLocaleDateString('pt-BR') 
                        : 'Data não informada'
                      }
                    </span>
                  </div>
                </div>

                {/* Tags/Status */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-1">
                    {album.isExplicit && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Explícito
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      album.visibility === 'public' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {album.visibility === 'public' ? 'Público' : 'Privado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ MODAL COM UPLOAD INTEGRADO - CLOUDINARY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedAlbum ? 'Editar Álbum' : 'Novo Álbum'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isUploading}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAlbum} className="p-6 space-y-6">
              {/* ✅ SEÇÃO DE UPLOAD COM CLOUDINARY */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Capa do Álbum
                </label>
                <div className="flex items-start gap-6">
                  {/* Preview da Imagem */}
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 relative">
                    {previewUrl || (selectedAlbum && !formData.coverFile && selectedAlbum.coverArt) ? (
                      <img 
                        src={previewUrl || selectedAlbum?.coverArt} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <Upload size={32} className="mx-auto mb-2" />
                        <span className="text-xs">Clique para enviar</span>
                      </div>
                    )}
                    
                    {/* Overlay de loading */}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Controles de Upload */}
                  <div className="flex-1 space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />
                    <p className="text-xs text-gray-500">
                      📷 PNG, JPG até 10MB • Recomendado: 800x800px
                    </p>
                    
                    {/* Status do Upload */}
                    {isUploading && (
                      <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-2 rounded">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm font-medium">Enviando para Cloudinary...</span>
                      </div>
                    )}
                    
                    {/* Botão para remover imagem */}
                    {(previewUrl || (selectedAlbum?.coverArt && !formData.coverFile)) && !isUploading && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl('');
                          setFormData(prev => ({ ...prev, coverFile: null }));
                          const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        🗑️ Remover imagem
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Campos do Formulário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome do álbum"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artista *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.artistName}
                    onChange={(e) => setFormData(prev => ({ ...prev, artistName: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome do artista"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descrição do álbum"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Faixas
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.trackCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, trackCount: Number(e.target.value) }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Lançamento
                  </label>
                  <input
                    type="date"
                    value={formData.releaseDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Hip Hop, Nacional, Popular"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.visibility === 'public'}
                    onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.checked ? 'public' : 'private' }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700 font-medium">
                    🌍 Tornar público
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.isExplicit}
                    onChange={(e) => setFormData(prev => ({ ...prev, isExplicit: e.target.checked }))}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700 font-medium">
                    🔞 Conteúdo explícito
                  </label>
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isUploading}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-md text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 flex items-center gap-2 shadow-lg transition-all"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {selectedAlbum ? '✨ Atualizar' : '🚀 Criar'} Álbum
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

