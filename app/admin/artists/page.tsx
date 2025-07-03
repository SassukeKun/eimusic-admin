// app/admin/artists/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import DataTable from '@/components/admin/DataTable';
import FilterBar from '@/components/admin/FilterBar';
import EditArtistModal from '@/components/ui/EditArtistModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/hooks/useToast';
import { 
  mockArtistsData, 
  filterArtists,
  type ArtistRecord 
} from '@/data/artistsData';
import type { FilterConfig } from '@/types/admin';
import type { ArtistFormData } from '@/types/modal';

export default function ArtistsPage() {
  const toast = useToast();
  const [filteredArtists, setFilteredArtists] = useState<ArtistRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<ArtistRecord | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<ArtistRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8; // Número de itens por página

  // Inicializar os artistas filtrados
  useEffect(() => {
    setFilteredArtists(mockArtistsData);
  }, []);

  // Configuração dos filtros
  const filters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Ativo' },
        { value: 'inactive', label: 'Inativo' },
        { value: 'suspended', label: 'Suspenso' },
      ],
    },
    {
      key: 'verified',
      label: 'Verificação',
      type: 'select',
      options: [
        { value: 'verified', label: 'Verificado' },
        { value: 'unverified', label: 'Não Verificado' },
      ],
    },
    {
      key: 'monetizationPlan',
      label: 'Plano',
      type: 'select',
      options: [
        { value: 'basic', label: 'Básico' },
        { value: 'premium', label: 'Premium' },
        { value: 'enterprise', label: 'Enterprise' },
      ],
    },
    {
      key: 'paymentMethod',
      label: 'Método de Pagamento',
      type: 'select',
      options: [
        { value: 'mpesa', label: 'M-Pesa' },
        { value: 'visa', label: 'Visa/Mastercard' },
        { value: 'paypal', label: 'PayPal' },
      ],
    },
    {
      key: 'joinedDate',
      label: 'Data de Ingresso',
      type: 'date',
    },
  ];

  // Configuração das colunas
  const columns = [
    {
      key: 'name' as keyof ArtistRecord,
      label: 'Artista',
      sortable: true,
      render: (value: unknown, artist: ArtistRecord) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <Image
              className="h-10 w-10 rounded-full"
              src={artist.profileImage || 'https://ui-avatars.com/api/?name=Unknown&background=6366f1&color=fff'}
              alt={artist.name}
              width={40}
              height={40}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {artist.name}
            </div>
            <div className="text-sm text-gray-500">
              {artist.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'genre' as keyof ArtistRecord,
      label: 'Gênero',
      sortable: true,
    },
    {
      key: 'verified' as keyof ArtistRecord,
      label: 'Verificado',
      sortable: true,
      render: (value: unknown) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {value ? 'Verificado' : 'Não Verificado'}
        </span>
      ),
    },
    {
      key: 'monetizationPlan' as keyof ArtistRecord,
      label: 'Plano',
      sortable: true,
      render: (value: unknown) => {
        const plan = String(value);
        const planConfig = {
          basic: { class: 'bg-gray-100 text-gray-800', text: 'Básico' },
          premium: { class: 'bg-blue-100 text-blue-800', text: 'Premium' },
          enterprise: { class: 'bg-purple-100 text-purple-800', text: 'Enterprise' },
        };
        const config = planConfig[plan as keyof typeof planConfig] || planConfig.basic;
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
            {config.text}
          </span>
        );
      },
    },
    {
      key: 'paymentMethod' as keyof ArtistRecord,
      label: 'Pagamento',
      sortable: true,
      render: (value: unknown, artist: ArtistRecord) => {
        if (!value) return <span className="text-gray-400">-</span>;
        
        const method = String(value);
        const colors = {
          mpesa: 'bg-green-100 text-green-800',
          visa: 'bg-blue-100 text-blue-800',
          paypal: 'bg-yellow-100 text-yellow-800'
        };
        const labels = {
          mpesa: 'M-Pesa',
          visa: 'Visa/MC',
          paypal: 'PayPal'
        };
        
        return (
          <div>
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
              {labels[method as keyof typeof labels] || method}
            </span>
            {artist.phoneNumber && method === 'mpesa' && (
              <div className="text-xs text-gray-500 mt-1">
                {artist.phoneNumber}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'totalRevenue' as keyof ArtistRecord,
      label: 'Receita',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-green-600 font-medium">
          MT {Number(value).toLocaleString('pt-MZ')}
        </span>
      ),
    },
    {
      key: 'lastPaymentDate' as keyof ArtistRecord,
      label: 'Último Pagamento',
      sortable: true,
      render: (value: unknown) => {
        if (!value) return <span className="text-gray-400">-</span>;
        
        const date = new Date(String(value));
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let timeAgo = '';
        if (diffDays === 1) {
          timeAgo = 'ontem';
        } else if (diffDays < 7) {
          timeAgo = `${diffDays} dias atrás`;
        } else if (diffDays < 30) {
          timeAgo = `${Math.floor(diffDays / 7)} semanas atrás`;
        } else {
          timeAgo = date.toLocaleDateString('pt-MZ');
        }
        
        return (
          <div>
            <div className="text-sm text-gray-900">
              {date.toLocaleDateString('pt-MZ')}
            </div>
            <div className="text-xs text-gray-500">
              {timeAgo}
            </div>
          </div>
        );
      },
    },
    {
      key: 'status' as keyof ArtistRecord,
      label: 'Status',
      sortable: true,
      render: (value: unknown) => {
        const status = String(value);
        const statusConfig = {
          active: { class: 'bg-green-100 text-green-800', text: 'Ativo' },
          inactive: { class: 'bg-yellow-100 text-yellow-800', text: 'Inativo' },
          suspended: { class: 'bg-red-100 text-red-800', text: 'Suspenso' },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
            {config.text}
          </span>
        );
      },
    },
    {
      key: 'id' as keyof ArtistRecord,
      label: 'Ações',
      render: (_: unknown, artist: ArtistRecord) => (
        <div className="flex space-x-2">
          <button 
            className="text-indigo-600 hover:text-indigo-900"
            aria-label="Editar artista"
            onClick={() => handleEditClick(artist)}
          >
            <Edit className="h-5 w-5" />
          </button>
          <button 
            className="text-red-600 hover:text-red-900"
            aria-label="Excluir artista"
            onClick={() => handleDeleteClick(artist)}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  // Handlers
  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  const handleRowClick = (artist: ArtistRecord) => {
    // Pode ser usado para selecionar o artista e mostrar mais detalhes ou editar
    handleEditClick(artist);
  };

  const handleEditClick = (artist: ArtistRecord) => {
    setSelectedArtist(artist);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (artist: ArtistRecord) => {
    setArtistToDelete(artist);
    setIsDeleteModalOpen(true);
  };

  const handleSaveArtist = async (formData: ArtistFormData) => {
    setIsLoading(true);
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar lista local
      setFilteredArtists(prev => 
        prev.map(artist => 
          artist.id === selectedArtist?.id 
            ? { 
                ...artist,
                name: formData.name,
                email: formData.email,
                genre: formData.genre,
                monetizationPlan: formData.monetizationPlan as 'basic' | 'premium' | 'enterprise',
                paymentMethod: formData.paymentMethod as 'mpesa' | 'visa' | 'paypal',
                phoneNumber: formData.phoneNumber,
                verified: formData.verified,
                status: formData.isActive ? 'active' : 'inactive',
              } 
            : artist
        )
      );
      
      toast.success('Artista atualizado!', 'Dados salvos com sucesso');
    } catch (err) {
      toast.error('Erro ao salvar', 'Tente novamente mais tarde');
      console.error('Erro ao salvar artista:', err);
    } finally {
      setIsLoading(false);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!artistToDelete) return;
    
    setIsLoading(true);
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remover da lista local
      setFilteredArtists(prev => 
        prev.filter(artist => artist.id !== artistToDelete.id)
      );
      
      toast.success('Artista excluído!', 'Operação realizada com sucesso');
    } catch (err) {
      toast.error('Erro ao excluir', 'Tente novamente mais tarde');
      console.error('Erro ao excluir artista:', err);
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setArtistToDelete(null);
    }
  };

  // Atualizar lista filtrada
  useEffect(() => {
    const filtered = filterArtists(mockArtistsData, activeFilters, searchQuery);
    setFilteredArtists(filtered);
  }, [activeFilters, searchQuery]);

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onReset={handleResetFilters}
      />

      <DataTable
        data={filteredArtists}
        columns={columns}
        onRowClick={handleRowClick}
        itemsPerPage={itemsPerPage}
      />

      {/* Modal de Edição */}
      <EditArtistModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveArtist}
        artist={selectedArtist ? {
          id: selectedArtist.id,
          name: selectedArtist.name,
          email: selectedArtist.email,
          bio: '', // Valor padrão, já que não existe no ArtistRecord
          genre: selectedArtist.genre,
          monetizationPlan: selectedArtist.monetizationPlan,
          paymentMethod: selectedArtist.paymentMethod || 'mpesa', // Definir M-Pesa como padrão se não houver método
          phoneNumber: selectedArtist.phoneNumber,
          verified: selectedArtist.verified,
          isActive: selectedArtist.status === 'active',
          receiveNotifications: true, // Valor padrão
          allowPublicProfile: true, // Valor padrão
        } : undefined}
        loading={isLoading}
        mode="edit"
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Artista"
        message={`Tem certeza que deseja excluir o artista ${artistToDelete?.name}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        loading={isLoading}
      />
    </div>
  );
}