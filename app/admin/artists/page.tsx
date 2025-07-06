// app/admin/artists/page.tsx - VERSÃO SIMPLES SEM DEPENDÊNCIAS EXTERNAS
'use client';

import { useEffect, useCallback, useState } from 'react';
import { 
  fetchAllArtists, 
  deleteArtist,
  type Artist,
} from '@/services/artists';
import { Edit, Trash2, User, Plus } from 'lucide-react';
import Image from 'next/image';

/**
 * PÁGINA DE ARTISTAS - VERSÃO STANDALONE
 * Sem dependências de componentes externos
 */
export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  /**
   * FETCH DOS ARTISTAS
   */
  const fetchArtists = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🎤 [ArtistsPage] Carregando artistas...');
      const data = await fetchAllArtists();
      console.log('✅ [ArtistsPage] Artistas carregados:', data.length);
      setArtists(data);
    } catch (err) {
      console.error('❌ [ArtistsPage] Erro ao carregar:', err);
      setError('Erro ao carregar artistas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  /**
   * HANDLERS
   */
  const handleCreateArtist = () => {
    alert('Funcionalidade de criar artista será implementada em breve!');
  };

  const handleEditArtist = (artist: Artist) => {
    alert(`Editar artista: ${artist.name}\nFuncionalidade será implementada em breve!`);
  };

  const handleDeleteClick = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedArtist) {
      try {
        console.log('🗑️ [ArtistsPage] Deletando artista:', selectedArtist.id);
        await deleteArtist(selectedArtist.id);
        console.log('✅ [ArtistsPage] Artista deletado com sucesso');
        await fetchArtists();
        setIsDeleteModalOpen(false);
        setSelectedArtist(null);
      } catch (err) {
        console.error('❌ [ArtistsPage] Erro ao deletar:', err);
        setError('Erro ao deletar artista');
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedArtist(null);
  };

  /**
   * COMPONENTE DE LOADING
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Artistas</h1>
            <p className="text-gray-600 mt-1">Carregando artistas...</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * COMPONENTE DE ERRO
   */
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Artistas</h1>
            <p className="text-gray-600 mt-1">Gerencie os artistas da plataforma.</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={fetchArtists}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Artistas</h1>
              <p className="text-gray-600 mt-1">Gerencie os artistas da plataforma.</p>
            </div>
            <button
              onClick={handleCreateArtist}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Artista
            </button>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto p-6">
        {artists.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum artista encontrado</h3>
            <p className="text-gray-500 mb-6">Comece adicionando o primeiro artista à plataforma.</p>
            <button
              onClick={handleCreateArtist}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Artista
            </button>
          </div>
        ) : (
          /* TABELA DE ARTISTAS */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Lista de Artistas 
                <span className="text-gray-500 text-sm ml-2">({artists.length})</span>
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Foto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Biografia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plano
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Cadastro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {artists.map((artist) => (
                    <tr key={artist.id} className="hover:bg-gray-50">
                      {/* FOTO */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          {artist.profile_image_url ? (
                            <Image
                              src={artist.profile_image_url}
                              alt={artist.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </td>
                      
                      {/* NOME */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{artist.name}</div>
                          <div className="text-sm text-gray-500">ID: {artist.id.slice(0, 8)}...</div>
                        </div>
                      </td>
                      
                      {/* EMAIL */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{artist.email}</div>
                      </td>
                      
                      {/* BIOGRAFIA */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {artist.bio || 'Sem biografia'}
                        </div>
                      </td>
                      
                      {/* PLANO */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {artist.monetization_plan_id || 'Não definido'}
                        </span>
                      </td>
                      
                      {/* DATA */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(artist.created_at).toLocaleDateString('pt-MZ')}
                        </div>
                      </td>
                      
                      {/* AÇÕES */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditArtist(artist)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(artist)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Excluir Artista
              </h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir o artista &quot;{selectedArtist?.name}&quot;? 
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}