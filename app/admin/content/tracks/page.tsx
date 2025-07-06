'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Play, Pause, Edit, Trash2, Music, Users, Disc, TrendingUp } from 'lucide-react';
import EditTrackModal from '@/components/admin/EditTrackModal';
import DeleteTrackModal from '@/components/admin/DeleteTrackModal';
import type { Track, TracksResponse, TrackFormData, TrackFilters } from '@/types/tracks';

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TrackFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTracks, setTotalTracks] = useState(0);
  
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [deletingTrack, setDeletingTrack] = useState<Track | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [artists, setArtists] = useState<Array<{ id: string; name: string }>>([]);
  const [albums, setAlbums] = useState<Array<{ id: string; title: string; artistId: string }>>([]);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  const pageSize = 20;

  useEffect(() => {
    fetchTracks();
    fetchArtists();
    fetchAlbums();
  }, [currentPage, searchQuery, filters]);

  const fetchTracks = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (filters.artistId) params.append('artistId', filters.artistId);
      if (filters.albumId) params.append('albumId', filters.albumId);

      const response = await fetch(`/api/tracks?${params}`);
      if (!response.ok) throw new Error('Falha ao carregar faixas');

      const data: TracksResponse = await response.json();
      setTracks(data.data);
      setFilteredTracks(data.data);
      setTotalPages(data.totalPages);
      setTotalTracks(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await fetch('/api/artists');
      if (response.ok) {
        const data = await response.json();
        setArtists(data);
      }
    } catch (err) {
      console.error('Erro ao carregar artistas:', err);
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await fetch('/api/albums');
      if (response.ok) {
        const data = await response.json();
        setAlbums(data);
      }
    } catch (err) {
      console.error('Erro ao carregar álbuns:', err);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof TrackFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({});
    setCurrentPage(1);
  };

  const handleCreateTrack = () => {
    setEditingTrack(null);
    setIsEditModalOpen(true);
  };

  const handleEditTrack = (track: Track) => {
    setEditingTrack(track);
    setIsEditModalOpen(true);
  };

  const handleDeleteTrack = (track: Track) => {
    setDeletingTrack(track);
    setIsDeleteModalOpen(true);
  };

  const handleSaveTrack = async (formData: TrackFormData) => {
    try {
      const url = editingTrack ? `/api/tracks/${editingTrack.id}` : '/api/tracks';
      const method = editingTrack ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Falha ao salvar faixa');

      await fetchTracks();
      setIsEditModalOpen(false);
    } catch (err) {
      throw err;
    }
  };

  const handleConfirmDelete = async (trackId: string) => {
    try {
      const response = await fetch(`/api/tracks/${trackId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Falha ao excluir faixa');

      await fetchTracks();
      setIsDeleteModalOpen(false);
    } catch (err) {
      throw err;
    }
  };

  const togglePlay = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getFilteredAlbums = () => {
    if (!filters.artistId) return albums;
    return albums.filter(album => album.artistId === filters.artistId);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Erro ao carregar faixas</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchTracks}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciamento de Faixas</h1>
            <p className="text-blue-100">
              Gerencie todas as faixas musicais da plataforma EiMusic
            </p>
          </div>
          <button
            onClick={handleCreateTrack}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Faixa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total de Faixas</p>
              <p className="text-2xl font-bold text-blue-900">{totalTracks.toLocaleString()}</p>
            </div>
            <Music className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total de Streams</p>
              <p className="text-2xl font-bold text-green-900">
                {tracks.reduce((sum, track) => sum + track.streams, 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Artistas Únicos</p>
              <p className="text-2xl font-bold text-purple-900">
                {new Set(tracks.map(t => t.artistId)).size}
              </p>
            </div>
            <Users className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Com Álbuns</p>
              <p className="text-2xl font-bold text-orange-900">
                {tracks.filter(t => t.albumId).length}
              </p>
            </div>
            <Disc className="w-10 h-10 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por título da faixa..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={filters.artistId || ''}
              onChange={(e) => handleFilterChange('artistId', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os Artistas</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>

            <select
              value={filters.albumId || ''}
              onChange={(e) => handleFilterChange('albumId', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              disabled={!filters.artistId}
            >
              <option value="">Todos os Álbuns</option>
              {getFilteredAlbums().map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>

            {(searchQuery || filters.artistId || filters.albumId) && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Carregando faixas...</div>
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma faixa encontrada</h3>
            <p className="text-gray-500">
              {searchQuery || Object.keys(filters).length > 0
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando sua primeira faixa'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Faixa</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Artista</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Álbum</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Duração</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Streams</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTracks.map((track) => (
                    <tr key={track.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => togglePlay(track.id)}
                            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                          >
                            {playingTrack === track.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4 ml-0.5" />
                            )}
                          </button>
                          <div>
                            <p className="font-medium text-gray-900">{track.title}</p>
                            {track.coverUrl && (
                              <img
                                src={track.coverUrl}
                                alt={track.title}
                                className="w-8 h-8 rounded object-cover mt-1"
                              />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{track.artistName}</td>
                      <td className="py-4 px-4 text-gray-700">{track.albumTitle || '-'}</td>
                      <td className="py-4 px-4 text-gray-700">{formatDuration(track.duration)}</td>
                      <td className="py-4 px-4 text-gray-700">{track.streams.toLocaleString()}</td>
                      <td className="py-4 px-4 text-gray-700">{formatDate(track.createdAt)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditTrack(track)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Editar faixa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTrack(track)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Excluir faixa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-700">
                  Mostrando {(currentPage - 1) * pageSize + 1} a{' '}
                  {Math.min(currentPage * pageSize, totalTracks)} de {totalTracks} faixas
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <EditTrackModal
        isOpen={isEditModalOpen}
        track={editingTrack}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTrack}
        artists={artists}
        albums={albums}
      />

      <DeleteTrackModal
        isOpen={isDeleteModalOpen}
        track={deletingTrack}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}