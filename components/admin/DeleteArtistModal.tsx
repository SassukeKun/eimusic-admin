'use client';

import { useState } from 'react';
import { AlertTriangle, X, User as UserIcon, Trash2, Shield, MapPin, Music, Disc, ExternalLink } from 'lucide-react';
import type { Artist } from '@/types/artists';
import { formatSubscribers } from '@/types/artists';

interface DeleteArtistModalProps {
  isOpen: boolean;
  artist: Artist | null;
  onClose: () => void;
  onConfirm: (artistId: string) => Promise<void>;
}

export default function DeleteArtistModal({
  isOpen,
  artist,
  onClose,
  onConfirm
}: DeleteArtistModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!artist) return;
    
    setIsDeleting(true);
    try {
      await onConfirm(artist.id);
      onClose();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const hasContent = (artist?.totalTracks || 0) > 0 || (artist?.totalAlbums || 0) > 0;
  const hasSocialLinks = artist?.socialLinks && Object.values(artist.socialLinks).some(link => link);

  if (!isOpen || !artist) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-semibold">Excluir Artista</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800 mb-1">
                  Esta ação não pode ser desfeita
                </h3>
                <p className="text-sm text-red-700">
                  Todos os dados do artista serão permanentemente removidos do sistema.
                </p>
              </div>
            </div>
          </div>

          {hasContent && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-orange-800 mb-1">
                    Atenção: Artista com Conteúdo
                  </h4>
                  <p className="text-sm text-orange-700">
                    Este artista possui {artist.totalTracks || 0} faixas e {artist.totalAlbums || 0} álbuns. 
                    A exclusão pode não ser permitida pelo sistema.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-4">
              {artist.profileImageUrl ? (
                <img
                  src={artist.profileImageUrl}
                  alt={artist.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 flex items-center">
                  {artist.name}
                  {artist.verified && (
                    <Shield className="w-4 h-4 ml-2 text-blue-500" />
                  )}
                </h3>
                <p className="text-sm text-gray-600">{artist.email}</p>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-gray-500">
                    {formatSubscribers(artist.subscribers)} seguidores
                  </span>
                  {artist.province && (
                    <span className="text-xs text-gray-500">
                      <MapPin className="inline w-3 h-3 mr-1" />
                      {artist.province}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    Desde {formatDate(artist.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas do Artista */}
          {(artist.totalTracks || artist.totalAlbums || artist.totalStreams) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-3">Estatísticas do Artista:</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Music className="w-4 h-4 text-blue-600 mr-1" />
                  </div>
                  <p className="text-lg font-semibold text-blue-900">{artist.totalTracks || 0}</p>
                  <p className="text-xs text-blue-700">Faixas</p>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Disc className="w-4 h-4 text-blue-600 mr-1" />
                  </div>
                  <p className="text-lg font-semibold text-blue-900">{artist.totalAlbums || 0}</p>
                  <p className="text-xs text-blue-700">Álbuns</p>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <span className="w-4 h-4 text-blue-600 mr-1">▶</span>
                  </div>
                  <p className="text-lg font-semibold text-blue-900">
                    {(artist.totalStreams || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-700">Streams</p>
                </div>
              </div>
            </div>
          )}

          {/* Links Sociais */}
          {hasSocialLinks && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
              <h4 className="font-medium text-purple-800 mb-2">
                <ExternalLink className="inline w-4 h-4 mr-1" />
                Links conectados:
              </h4>
              <div className="text-sm text-purple-700 space-y-1">
                {Object.entries(artist.socialLinks || {}).map(([platform, link]) => 
                  link ? (
                    <div key={platform} className="flex items-center">
                      <span className="capitalize font-medium w-20">{platform}:</span>
                      <span className="truncate">{link}</span>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-yellow-800 mb-2">
              O que será perdido:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Perfil e dados pessoais do artista</li>
              <li>• Foto de perfil e biografia</li>
              <li>• Lista de {formatSubscribers(artist.subscribers)} seguidores</li>
              {artist.verified && (
                <li>• Status de verificação oficial</li>
              )}
              {artist.monetizationPlanName && (
                <li>• Plano de monetização: {artist.monetizationPlanName}</li>
              )}
              {hasSocialLinks && (
                <li>• Todos os links das redes sociais</li>
              )}
              {artist.totalStreams && (
                <li>• Histórico de {(artist.totalStreams).toLocaleString()} reproduções</li>
              )}
              <li>• Possíveis receitas pendentes</li>
              <li>• Conexões com fãs e outros artistas</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {isDeleting ? (
                'Excluindo...'
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Definitivamente
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}