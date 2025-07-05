// src/app/admin/artists/page.tsx

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search, Plus, RefreshCw, Edit, Trash2, AlertTriangle, Users } from 'lucide-react';
import { useArtists, type Artist } from '@/hooks/useArtists';

// Interface para o modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Componente de Modal
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  {title}
                </h3>
                <div className="mt-4">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


// Página principal
export default function ArtistsPage() {
  // Usar hook de artistas
  const { 
    artists, 
    isLoading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    refreshArtists,
    createArtist,
    updateArtist,
    deleteArtist
  } = useArtists();
  
  // Estados para modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArtist, setCurrentArtist] = useState<Artist | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Estados do formulário
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formVerified, setFormVerified] = useState(false);
  const [formBio, setFormBio] = useState('');
  const [formPhone, setFormPhone] = useState('');
  
  
  
  // Abrir modal de edição
  const handleEdit = (artist: Artist) => {
    setCurrentArtist(artist);
    setFormName(artist.name);
    setFormEmail(artist.email);
    setFormVerified(artist.verified);
    setFormBio(artist.bio || '');
    setFormPhone(artist.phone || '');
    setIsModalOpen(true);
  };
  
  // Abrir modal de criação
  const handleCreate = () => {
    setCurrentArtist(null);
    setFormName('');
    setFormEmail('');
    setFormVerified(false);
    setFormBio('');
    setFormPhone('');
    setIsModalOpen(true);
  };
  
  // Abrir modal de exclusão
  const handleDeleteClick = (artist: Artist) => {
    setArtistToDelete(artist);
    setIsDeleteModalOpen(true);
  };
  
  // Confirmar exclusão
  const confirmDelete = async () => {
    if (!artistToDelete) return;
    
    setFormSubmitting(true);
    
    try {
      await deleteArtist(artistToDelete.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      alert(`Erro ao excluir artista: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Salvar artista (novo ou edição)
  const handleSave = async () => {
    // Validação básica
    if (!formName.trim() || !formEmail.trim()) {
      alert('Nome e email são obrigatórios');
      return;
    }
    
    setFormSubmitting(true);
    
    try {
      if (currentArtist) {
        // Atualizar artista existente
        await updateArtist({
          ...currentArtist,
          name: formName,
          email: formEmail,
          verified: formVerified,
          bio: formBio || null,
          phone: formPhone || null
        });
      } else {
        // Criar novo artista
        await createArtist({
          name: formName,
          email: formEmail,
          verified: formVerified,
          bio: formBio || null,
          phone: formPhone || null
        });
      }
      
      setIsModalOpen(false);
    } catch (error) {
      alert(`Erro ao salvar artista: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artistas</h1>
          <p className="mt-1 text-gray-500">
            Gerencie os artistas da plataforma EiMusic.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Artista
          </button>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Buscar artistas por nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={refreshArtists}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>
      </div>
      
      
      
      
      {/* Mensagem de erro */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erro ao carregar artistas
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de artistas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Artistas <span className="text-gray-500 text-sm">({artists.length})</span>
          </h3>
          <button
            onClick={refreshArtists}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Atualizar"
            disabled={isLoading}
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
        
        
        
        {/* Estado de carregamento */}
        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-500">Carregando artistas...</p>
          </div>
        ) : artists.length === 0 ? (
          // Lista vazia
          <div className="p-8 flex flex-col items-center justify-center">
            <Users size={48} className="text-gray-300 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum artista encontrado</h4>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? 'Não há artistas que correspondam à sua busca.' 
                : 'Não há artistas cadastrados no sistema.'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Limpar busca
              </button>
            ) : (
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Adicionar artista
              </button>
            )}
          </div>
        ) : (
        
        
        // Tabela de artistas
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verificado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Criação
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {artists.map((artist) => (
                  <motion.tr 
                    key={artist.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {artist.profile_image_url ? (
                            <Image
                              src={artist.profile_image_url}
                              alt={artist.name}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {artist.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{artist.name}</div>
                          <div className="text-sm text-gray-500">ID: {artist.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{artist.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        artist.verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {artist.verified ? 'Verificado' : 'Não verificado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(artist.created_at).toLocaleDateString('pt-MZ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(artist)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(artist)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modal de Edição/Criação */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !formSubmitting && setIsModalOpen(false)}
        title={currentArtist ? 'Editar Artista' : 'Novo Artista'}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nome do artista"
              disabled={formSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="email@exemplo.com"
              disabled={formSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="+258 84 123 4567"
              disabled={formSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Biografia
            </label>
            <textarea
              id="bio"
              value={formBio}
              onChange={(e) => setFormBio(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Breve biografia do artista"
              disabled={formSubmitting}
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="verified"
              type="checkbox"
              checked={formVerified}
              onChange={(e) => setFormVerified(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              disabled={formSubmitting}
            />
            <label htmlFor="verified" className="ml-2 block text-sm text-gray-900">
              Artista verificado
            </label>
          </div>
          
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleSave}
              disabled={formSubmitting}
            >
              {formSubmitting ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => setIsModalOpen(false)}
              disabled={formSubmitting}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !formSubmitting && setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <div>
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir o artista <strong>{artistToDelete?.name}</strong>? Esta ação não pode ser desfeita.
          </p>
          
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={confirmDelete}
              disabled={formSubmitting}
            >
              {formSubmitting ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={formSubmitting}
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

