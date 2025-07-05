// app/admin/artists/page.tsx
'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';
import DataTable from '@/components/admin/DataTable';
import FilterBar from '@/components/admin/FilterBar';
import PageHeader from '@/components/admin/PageHeader';
import Button from '@/components/admin/Button';
import EditArtistModal from '@/components/ui/EditArtistModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useArtists } from '@/hooks/useArtists';
import type { FilterConfig } from '@/types/admin';
import type { ArtistFormData } from '@/types/modal';
import type { Artist } from '@/types/admin';

export default function ArtistsPage() {
  const {
    artists,
    isLoading,
    filters,
    searchQuery,
    setSearchQuery,
    fetchArtists,
    updateFilters,
    clearFilters,
    createArtist,
    updateArtist,
    deleteArtist,
  } = useArtists();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create');

  // Configuração dos filtros
  const filterConfigs: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Ativo' },
        { value: 'inactive', label: 'Inativo' },
        { value: 'pending', label: 'Pendente' },
      ],
    },
    {
      key: 'verified',
      label: 'Verificação',
      type: 'select',
      options: [
        { value: 'true', label: 'Verificado' },
        { value: 'false', label: 'Não Verificado' },
      ],
    },
    {
      key: 'monetization_plan',
      label: 'Plano',
      type: 'select',
      options: [
        { value: 'free', label: 'Gratuito' },
        { value: 'basic', label: 'Básico' },
        { value: 'premium', label: 'Premium' },
        { value: 'pro', label: 'Profissional' },
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
              className="h-10 w-10 rounded-full object-cover"
              src={artist.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=6366f1&color=fff`}
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
          free: { class: 'bg-gray-100 text-gray-800', text: 'Gratuito' },
          basic: { class: 'bg-blue-100 text-blue-800', text: 'Básico' },
          premium: { class: 'bg-purple-100 text-purple-800', text: 'Premium' },
          pro: { class: 'bg-indigo-100 text-indigo-800', text: 'Profissional' },
        };
        const config = planConfig[plan as keyof typeof planConfig] || planConfig.free;
        
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
          bank_transfer: 'bg-blue-100 text-blue-800',
          card: 'bg-purple-100 text-purple-800',
          cash: 'bg-yellow-100 text-yellow-800'
        };
        const labels = {
          mpesa: 'M-Pesa',
          bank_transfer: 'Transferência',
          card: 'Cartão',
          cash: 'Dinheiro'
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
          MT {Number(value || 0).toLocaleString('pt-MZ')}
        </span>
      ),
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
          pending: { class: 'bg-blue-100 text-blue-800', text: 'Pendente' },
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
            className="text-indigo-600 hover:text-indigo-900"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(artist);
            }}
            className="text-red-600 hover:text-red-900"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleFilterChange = (filterKey: string, value: string) => {
    updateFilters({ [filterKey]: value });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleResetFilters = () => {
    clearFilters();
  };

  const handleAddNewClick = () => {
    setSelectedArtist(null);
    setEditMode('create');
    setIsEditModalOpen(true);
  };

  const handleEditClick = (artist: Artist) => {
    setSelectedArtist(artist);
    setEditMode('edit');
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (artist: Artist) => {
    setArtistToDelete(artist);
    setIsDeleteModalOpen(true);
  };

  const handleSaveArtist = async (formData: ArtistFormData) => {
    setIsSubmitting(true);
    
    try {
      if (editMode === 'create') {
        await createArtist(formData);
      } else if (selectedArtist) {
        await updateArtist(selectedArtist.id, formData);
      }
      
      setIsEditModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!artistToDelete) return;
    
    setIsSubmitting(true);
    
    try {
      await deleteArtist(artistToDelete.id);
      setIsDeleteModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Converter o artista selecionado para o formato do formulário
  const selectedArtistFormData: ArtistFormData | undefined = selectedArtist
    ? {
        name: selectedArtist.name,
        email: selectedArtist.email,
        phone: selectedArtist.phoneNumber || '',
        bio: selectedArtist.bio || '',
        genre: selectedArtist.genre || '',
        status: selectedArtist.status,
        isActive: selectedArtist.status === 'active',
        verified: selectedArtist.verified,
        monetizationPlan: selectedArtist.monetizationPlan,
        paymentMethod: selectedArtist.paymentMethod,
      }
    : undefined;

  return (
    <div>
      <PageHeader
        title="Artistas"
        description="Gerencie os artistas da plataforma EiMusic."
      />
      
      <div className="mb-6 flex justify-between items-center">
        <FilterBar
          filters={filterConfigs}
          activeFilters={filters}
          searchQuery={searchQuery}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          onResetFilters={handleResetFilters}
        />
        
        <Button
          onClick={handleAddNewClick}
          variant="primary"
          className="ml-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Artista
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={artists}
        isLoading={isLoading}
        onRowClick={() => {}}
      />
      
      {/* Modal de edição */}
      <EditArtistModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveArtist}
        artist={selectedArtistFormData}
        loading={isSubmitting}
        mode={editMode}
      />
      
      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Artista"
        message={`Tem certeza que deseja excluir o artista "${artistToDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        loading={isSubmitting}
      />
    </div>
  );
}