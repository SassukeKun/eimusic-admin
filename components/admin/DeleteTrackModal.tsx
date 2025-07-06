'use client';

import { useState } from 'react';
import { AlertTriangle, X, Music, Trash2 } from 'lucide-react';
import type { Track } from '@/types/tracks';

interface DeleteTrackModalProps {
  isOpen: boolean;
  track: Track | null;
  onClose: () => void;
  onConfirm: (trackId: string) => Promise<void>;
}

export default function DeleteTrackModal({
  isOpen,
  track,
  onClose,
  onConfirm
}: DeleteTrackModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!track) return;
    
    setIsDeleting(true);
    try {
      await onConfirm(track.id);
      onClose();
    } catch (error) {
      console.error('Erro ao deletar:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !track) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-semibold">Excluir Faixa</h2>
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
                  Todos os dados da faixa serão permanentemente removidos do sistema.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-4">
              {track.coverUrl ? (
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Music className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{track.title}</h3>
                <p className="text-sm text-gray-600">{track.artistName}</p>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-gray-500">
                    {track.streams.toLocaleString()} streams
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDuration(track.duration)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <h4 className="font-medium text-yellow-800 mb-2">
              O que será perdido:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Arquivo de áudio e capa da faixa</li>
              <li>• Histórico de {track.streams.toLocaleString()} reproduções</li>
              <li>• Dados de análise e métricas</li>
              {track.revenue && (
                <li>• Receita acumulada: {track.revenue.toLocaleString()} MT</li>
              )}
              <li>• Relação com playlists e favoritos dos usuários</li>
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