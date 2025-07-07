'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Users, Shield, MapPin, Crown, Music, Disc, ExternalLink, Star } from 'lucide-react';
import EditArtistModal from '@/components/admin/EditArtistModal';
import DeleteArtistModal from '@/components/admin/DeleteArtistModal';
import type { Artist, ArtistsResponse, ArtistFormData, ArtistFilters, MonetizationPlan, MozambiqueProvince } from '@/types/artists';
import { MOZAMBIQUE_PROVINCES, formatSubscribers } from '@/types/artists';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ArtistFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArtists, setTotalArtists] = useState(0);
  
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [deletingArtist, setDeletingArtist] = useState<Artist | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [monetizationPlans, setMonetizationPlans] = useState<MonetizationPlan[]>([]);

  const pageSize = 20;

  useEffect(() => {
    fetchArtists();
    fetchMonetizationPlans();
  }, [currentPage, searchQuery, filters]);

  const fetchArtists = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (filters.verified !== undefined) params.append('verified', filters.verified.toString());
      if (filters.province) params.append('province', filters.province);
      if (filters.hasMonetization !== undefined) params.append('hasMonetization', filters.hasMonetization.toString());

      const response = await fetch(`/api/artists?${params}`);
      if (!response.ok) throw new Error('Falha ao carregar artistas');

      const data: ArtistsResponse = await response.json();
      setArtists(data.data);
      setTotalPages(data.totalPages);
      setTotalArtists(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMonetizationPlans = async () => {
    try {
      const response = await fetch('/api/monetization-plans');
      if (response.ok) {
        const data = await response.json();
        setMonetizationPlans(data);
      }
    } catch (err) {
      console.error('Erro ao carregar planos:', err);
      setMonetizationPlans([
        { 
          id: '1', 
          name: 'Free', 
          monetization_type: 'subscription',
          platform_fee: 0.70, 
          artist_share: 0.30,
          features: ['Acesso limitado', 'Anúncios', '30% para artista'] 
        },
        { 
          id: '2', 
          name: 'Premium', 
          monetization_type: 'subscription',
          platform_fee: 0.60, 
          artist_share: 0.40,
          features: ['Catálogo completo', 'Sem anúncios', '40% para artista'] 
        },
        { 
          id: '3', 
          name: 'VIP', 
          monetization_type: 'subscription',
          platform_fee: 0.50, 
          artist_share: 0.50,
          features: ['Qualidade lossless', 'Suporte VIP', '50% para artista'] 
        }
      ]);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof ArtistFilters, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({});
    setCurrentPage(1);
  };

  const handleCreateArtist = () => {
    setEditingArtist(null);
    setIsEditModalOpen(true);
  };

  const handleEditArtist = (artist: Artist) => {
    setEditingArtist(artist);
    setIsEditModalOpen(true);
  };

  const handleDeleteArtist = (artist: Artist) => {
    setDeletingArtist(artist);
    setIsDeleteModalOpen(true);
  };

  const handleSaveArtist = async (formData: ArtistFormData) => {
    try {
      const url = editingArtist ? `/api/artists/${editingArtist.id}` : '/api/artists';
      const method = editingArtist ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Falha ao salvar artista');

      await fetchArtists();
      setIsEditModalOpen(false);
    } catch (err) {
      throw err;
    }
  };

  const handleConfirmDelete = async (artistId: string) => {
    try {
      const response = await fetch(`/api/artists/${artistId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Falha ao excluir artista');
      }

      await fetchArtists();
      setIsDeleteModalOpen(false);
    } catch (err) {
      throw err;
    }
  };

  // Estatísticas calculadas
  const verifiedArtists = artists.filter(artist => artist.verified).length;
  const artistsWithMonetization = artists.filter(artist => artist.monetizationPlanId).length;
  const newArtistsThisMonth = artists.filter(artist => {
    const artistDate = new Date(artist.createdAt);
    const thisMonth = new Date();
    return artistDate.getMonth() === thisMonth.getMonth() && 
           artistDate.getFullYear() === thisMonth.getFullYear();
  }).length;

  // Província mais popular
  const provinceCount = artists.reduce((acc, artist) => {
    if (artist.province) {
      acc[artist.province] = (acc[artist.province] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topProvince = Object.entries(provinceCount).reduce((max, [province, count]) => 
    count > max.count ? { name: province as MozambiqueProvince, count } : max,
    { name: 'Maputo' as MozambiqueProvince, count: 0 }
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">Erro ao carregar artistas</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchArtists}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerenciamento de Artistas</h1>
            <p className="text-purple-100">
              Gerencie todos os artistas cadastrados na plataforma EiMusic
            </p>
          </div>
          <button
            onClick={handleCreateArtist}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Artista
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total de Artistas</p>
              <p className="text-2xl font-bold text-purple-900">{totalArtists.toLocaleString()}</p>
            </div>
            <Users className="w-10 h-10 text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Verificados</p>
              <p className="text-2xl font-bold text-blue-900">{verifiedArtists}</p>
              <p className="text-xs text-blue-600">
                {totalArtists > 0 ? ((verifiedArtists / totalArtists) * 100).toFixed(1) : 0}% do total
              </p>
            </div>
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Com Monetização</p>
              <p className="text-2xl font-bold text-green-900">{artistsWithMonetization}</p>
              <p className="text-xs text-green-600">
                {totalArtists > 0 ? ((artistsWithMonetization / totalArtists) * 100).toFixed(1) : 0}% do total
              </p>
            </div>
            <Crown className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Novos Este Mês</p>
              <p className="text-2xl font-bold text-orange-900">{newArtistsThisMonth}</p>
              {topProvince.count > 0 && (
                <p className="text-xs text-orange-600">
                  Top: {topProvince.name} ({topProvince.count})
                </p>
              )}
            </div>
            <Star className="w-10 h-10 text-orange-600" />
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
                placeholder="Buscar por nome ou email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <select
              value={filters.verified?.toString() || ''}
              onChange={(e) => handleFilterChange('verified', 
                e.target.value === '' ? undefined : e.target.value === 'true'
              )}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todos os Status</option>
              <option value="true">Apenas Verificados</option>
              <option value="false">Não Verificados</option>
            </select>

            <select
              value={filters.province || ''}
              onChange={(e) => handleFilterChange('province', 
                e.target.value as MozambiqueProvince || undefined
              )}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todas as Províncias</option>
              {MOZAMBIQUE_PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>

            <select
              value={filters.hasMonetization?.toString() || ''}
              onChange={(e) => handleFilterChange('hasMonetization', 
                e.target.value === '' ? undefined : e.target.value === 'true'
              )}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todos os Planos</option>
              <option value="true">Com Monetização</option>
              <option value="false">Sem Monetização</option>
            </select>

            {(searchQuery || Object.keys(filters).some(key => filters[key as keyof ArtistFilters] !== undefined)) && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                title="Limpar filtros"
              >
                <Filter className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Carregando artistas...</div>
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum artista encontrado</h3>
            <p className="text-gray-500">
              {searchQuery || Object.keys(filters).length > 0
                ? 'Tente ajustar os filtros de busca'
                : 'Comece cadastrando o primeiro artista'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Artista</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Localização</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Seguidores</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Conteúdo</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {artists.map((artist) => (
                    <tr key={artist.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          {artist.profileImageUrl ? (
                            <img
                              src={artist.profileImageUrl}
                              alt={artist.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 flex items-center">
                              {artist.name}
                              {artist.verified && (
                                <Shield className="w-4 h-4 ml-2 text-blue-500" />
                              )}
                            </p>
                            <p className="text-sm text-gray-500">ID: {artist.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{artist.email}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            artist.verified 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {artist.verified ? (
                              <>
                                <Shield className="w-3 h-3 mr-1" />
                                Verificado
                              </>
                            ) : (
                              'Não Verificado'
                            )}
                          </span>
                          {artist.monetizationPlanName && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Crown className="w-3 h-3 mr-1" />
                              {artist.monetizationPlanName}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {artist.province ? (
                          <div className="flex items-center text-gray-700">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {artist.province}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {formatSubscribers(artist.subscribers)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          {artist.totalTracks !== undefined && (
                            <span className="flex items-center">
                              <Music className="w-3 h-3 mr-1" />
                              {artist.totalTracks}
                            </span>
                          )}
                          {artist.totalAlbums !== undefined && (
                            <span className="flex items-center">
                              <Disc className="w-3 h-3 mr-1" />
                              {artist.totalAlbums}
                            </span>
                          )}
                          {artist.socialLinks && Object.values(artist.socialLinks).some(link => link) && (
                            <ExternalLink className="w-3 h-3 text-purple-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditArtist(artist)}
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                            title="Editar artista"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArtist(artist)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Excluir artista"
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
                  {Math.min(currentPage * pageSize, totalArtists)} de {totalArtists} artistas
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 bg-purple-600 text-white rounded-lg">
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

      <EditArtistModal
        isOpen={isEditModalOpen}
        artist={editingArtist}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveArtist}
        monetizationPlans={monetizationPlans}
      />

      <DeleteArtistModal
        isOpen={isDeleteModalOpen}
        artist={deletingArtist}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}