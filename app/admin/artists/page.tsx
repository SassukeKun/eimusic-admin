// app/admin/artists/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import DataTable from '@/components/admin/DataTable';
import FilterBar from '@/components/admin/FilterBar';
import EditArtistModal from '@/components/ui/EditArtistModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useArtists } from '@/hooks/useArtists';
import { useToast } from '@/components/hooks/useToast';
import type { FilterConfig } from '@/types/admin';
import type { ArtistFormData } from '@/types/modal';
import type { Artist } from '@/types/admin';

export default function ArtistsPage() {
  const toast = useToast();
  const {
    artists,
    isLoading,
    filters,
    searchQuery,
    updateFilters,
    updateSearch,
    resetFilters,
    createArtist,
    updateArtist,
    deleteArtist,
  } = useArtists();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 8; // Número de itens por página

  // Configuração dos filtros
  const filterConfigs: FilterConfig[] = [
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
  ];

  // Configuração das colunas
  const columns = [
    {
      key: 'name' as keyof Artist,
      label: 'Artista',
      sortable: true,
      render: (value: unknown, artist: Artist) => (
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
      key: 'genre' as keyof Artist,
      label: 'Gênero',
      sortable: true,
    },
    {
      key: 'verified' as keyof Artist,
      label: 'Verificado',
      sortable: true,
      render: (value: unknown) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {value ? 'Verificado' : 'Não Verificado'}
        </span>
      ),
    },
    {
      key: 'monetizationPlan' as keyof Artist,
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
      key: 'paymentMethod' as keyof Artist,
      label: 'Pagamento',
      sortable: true,
      render: (value: unknown, artist: Artist) => {
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
      key: 'totalRevenue' as keyof Artist,
      label: 'Receita',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-green-600 font-medium">
          MT {Number(value).toLocaleString('pt-MZ')}
        </span>
      ),
    },
    {
      key: 'lastPaymentDate' as keyof Artist,
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
      key: 'status' as keyof Artist,
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
      key: 'id' as keyof Artist,
      label: 'Ações',
      render: (_: unknown, artist: Artist) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(artist);
            }}
            className="text-blue-600 hover:text-blue-900"
            aria-label="Editar artista"
          >
            <Edit className="size-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(artist);
            }}
            className="text-red-600 hover:text-red-900"
            aria-label="Excluir artista"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleFilterChange = (filterKey: string, value: string) => {
    updateFilters({ [filterKey]: value });
  };

  const handleSearchChange = (query: string) => {
    updateSearch(query);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleRowClick = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (artist: Artist) => {
    setSelectedArtist(artist);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (artist: Artist) => {
    setArtistToDelete(artist);
    setIsDeleteModalOpen(true);
  };

  const handleSaveArtist = async (formData: ArtistFormData) => {
    setIsSubmitting(true);
    
    try {
      if (selectedArtist?.id) {
        // Atualizar artista existente
        const updated = await updateArtist(selectedArtist.id, formData);
        if (updated) {
          setIsEditModalOpen(false);
        }
      } else {
        // Criar novo artista
        const created = await createArtist(formData);
        if (created) {
          setIsEditModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar artista:', error);
      toast.error('Ocorreu um erro ao salvar o artista');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!artistToDelete) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await deleteArtist(artistToDelete.id);
      if (success) {
        setIsDeleteModalOpen(false);
        setArtistToDelete(null);
      }
    } catch (error) {
      console.error('Erro ao excluir artista:', error);
      toast.error('Ocorreu um erro ao excluir o artista');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Artistas</h1>
        <button
          onClick={() => {
            setSelectedArtist(null);
            setIsEditModalOpen(true);
          }}
          className="btn-primary"
        >
          Novo Artista
        </button>
      </div>
      
      <FilterBar
        filters={filterConfigs}
        activeFilters={filters}
        searchQuery={searchQuery}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onResetFilters={handleResetFilters}
      />
      
      <DataTable
        data={artists}
        columns={columns}
        onRowClick={handleRowClick}
        itemsPerPage={itemsPerPage}
      />
      
      {isEditModalOpen && (
        <EditArtistModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveArtist}
          artist={selectedArtist ? {
            id: selectedArtist.id,
            name: selectedArtist.name,
            email: selectedArtist.email,
            bio: '',
            genre: selectedArtist.genre,
            monetizationPlan: selectedArtist.monetizationPlan,
            paymentMethod: selectedArtist.paymentMethod || 'mpesa',
            phoneNumber: selectedArtist.phoneNumber,
            verified: selectedArtist.verified,
            isActive: selectedArtist.status === 'active',
            receiveNotifications: true,
            allowPublicProfile: true,
          } : undefined}
          loading={isSubmitting}
          mode={selectedArtist ? 'edit' : 'create'}
        />
      )}
      
      {isDeleteModalOpen && artistToDelete && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Excluir Artista"
          message={`Tem certeza que deseja excluir o artista ${artistToDelete.name}? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="danger"
          loading={isSubmitting}
        />
      )}
    </div>
  );
}