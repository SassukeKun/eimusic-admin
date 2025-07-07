'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Music, Calendar, Clock, User, Disc } from 'lucide-react';
import type { Track, TrackFormData } from '@/types/tracks';

interface EditTrackModalProps {
  isOpen: boolean;
  track?: Track | null;
  onClose: () => void;
  onSave: (data: TrackFormData) => Promise<void>;
  artists: Array<{ id: string; name: string }>;
  albums: Array<{ id: string; title: string; artistId: string }>;
}

export default function EditTrackModal({
  isOpen,
  track,
  onClose,
  onSave,
  artists,
  albums
}: EditTrackModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'details'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TrackFormData>({
    title: '',
    artistId: '',
    duration: 0,
    albumId: '',
    releaseDate: '',
  });

  const isEditMode = Boolean(track);
  const filteredAlbums = albums.filter(album => album.artistId === formData.artistId);

  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title,
        artistId: track.artistId,
        duration: track.duration,
        albumId: track.albumId || '',
        releaseDate: track.releaseDate || '',
        existingFileUrl: track.fileUrl,
        existingCoverUrl: track.coverUrl,
      });
    } else {
      setFormData({
        title: '',
        artistId: '',
        duration: 0,
        albumId: '',
        releaseDate: '',
      });
    }
  }, [track]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Music className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-semibold">
                {isEditMode ? 'Editar Faixa' : 'Nova Faixa'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isEditMode && track && (
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex items-center space-x-4">
              {track.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="font-medium text-gray-900">{track.title}</h3>
                <p className="text-sm text-gray-600">{track.artistName}</p>
                <p className="text-xs text-gray-500">
                  {track.streams.toLocaleString()} streams • {formatDuration(track.duration)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'basic'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Informações Básicas
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Detalhes e Arquivos
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título da Faixa
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome da faixa"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Artista
                  </label>
                  <select
                    value={formData.artistId}
                    onChange={(e) => setFormData({ ...formData, artistId: e.target.value, albumId: '' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um artista</option>
                    {artists.map((artist) => (
                      <option key={artist.id} value={artist.id}>
                        {artist.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Disc className="inline w-4 h-4 mr-1" />
                    Álbum (Opcional)
                  </label>
                  <select
                    value={formData.albumId}
                    onChange={(e) => setFormData({ ...formData, albumId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.artistId || filteredAlbums.length === 0}
                  >
                    <option value="">Nenhum álbum</option>
                    {filteredAlbums.map((album) => (
                      <option key={album.id} value={album.id}>
                        {album.title}
                      </option>
                    ))}
                  </select>
                  {formData.artistId && filteredAlbums.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Este artista não possui álbuns cadastrados
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline w-4 h-4 mr-1" />
                      Duração (segundos)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="180"
                      min="0"
                    />
                    {formData.duration && formData.duration > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDuration(formData.duration)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Data de Lançamento
                    </label>
                    <input
                      type="date"
                      value={formData.releaseDate}
                      onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Upload className="inline w-4 h-4 mr-1" />
                    Arquivo de Áudio
                  </label>
                  {formData.existingFileUrl ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-2">Arquivo atual:</p>
                      <audio controls className="w-full">
                        <source src={formData.existingFileUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setFormData({ ...formData, audioFile: e.target.files?.[0] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capa da Faixa (Opcional)
                  </label>
                  {formData.existingCoverUrl ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-2">Capa atual:</p>
                      <img
                        src={formData.existingCoverUrl}
                        alt="Capa atual"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, coverFile: e.target.files?.[0] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title || !formData.artistId}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Salvando...' : isEditMode ? 'Salvar Alterações' : 'Criar Faixa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}