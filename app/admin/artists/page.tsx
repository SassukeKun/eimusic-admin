// app/admin/artists/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, CheckCircle, XCircle, Plus, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import DataTable from '@/components/admin/DataTable';
import FilterBar from '@/components/admin/FilterBar';
import PageHeader from '@/components/admin/PageHeader';
import Button from '@/components/admin/Button';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { 
  mockArtistsData, 
  filterArtists,
  type ArtistRecord 
} from '@/data/artistsData';
import type { FilterConfig } from '@/types/admin';

export default function ArtistsPage() {
  const [filteredArtists, setFilteredArtists] = useState<ArtistRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [selectedArtist, setSelectedArtist] = useState<ArtistRecord | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Inicializar os artistas filtrados com todos os artistas
  useEffect(() => {
    // Simular carregamento assíncrono
    const timer = setTimeout(() => {
      setFilteredArtists(mockArtistsData);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
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
        { value: 'vip', label: 'VIP' },
      ],
    },
    {
      key: 'joinDate',
      label: 'Data de Ingresso',
      type: 'date',
    },
  ];

  // Configuração das colunas da tabela
  const columns = [
    {
      key: 'name' as keyof ArtistRecord,
      label: 'Artista',
      sortable: true,
      render: (value: unknown, artist: ArtistRecord) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 size-10">
            <Image
              className="size-10 rounded-full object-cover"
              src={artist.profileImage?.toString() || 'https://ui-avatars.com/api/?name=Unknown&background=6366f1&color=fff'}
              alt={artist.name?.toString() || 'Artista'}
              width={40}
              height={40}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-foreground">{artist.name}</div>
            <div className="text-sm text-muted">{artist.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'genre' as keyof ArtistRecord,
      label: 'Género',
      sortable: true,
    },
    {
      key: 'verified' as keyof ArtistRecord,
      label: 'Verificado',
      sortable: true,
      render: (value: unknown) => {
        const isVerified = Boolean(value);
        return (
          <span className={`badge ${isVerified ? 'badge-success' : 'badge-warning'}`}>
            {isVerified ? (
              <>
                <CheckCircle className="size-3 mr-1" />
                Sim
              </>
            ) : (
              <>
                <XCircle className="size-3 mr-1" />
                Não
              </>
            )}
          </span>
        );
      },
    },
    {
      key: 'totalTracks' as keyof ArtistRecord,
      label: 'Faixas',
      sortable: true,
    },
    {
      key: 'totalRevenue' as keyof ArtistRecord,
      label: 'Receita Total',
      sortable: true,
      render: (value: unknown) => (
        <span>MT {Number(value).toLocaleString('pt-MZ')}</span>
      ),
    },
    {
      key: 'status' as keyof ArtistRecord,
      label: 'Status',
      sortable: true,
      render: (value: unknown) => {
        const status = String(value);
        let badgeClass = '';
        let statusText = '';
        
        switch (status) {
          case 'active':
            badgeClass = 'badge-success';
            statusText = 'Ativo';
            break;
          case 'inactive':
            badgeClass = 'badge-warning';
            statusText = 'Inativo';
            break;
          case 'suspended':
            badgeClass = 'badge-danger';
            statusText = 'Suspenso';
            break;
          default:
            badgeClass = '';
            statusText = status;
        }
        
        return (
          <span className={`badge ${badgeClass}`}>
            {statusText}
          </span>
        );
      },
    },
    {
      key: 'monetizationPlan' as keyof ArtistRecord,
      label: 'Plano',
      sortable: true,
      render: (value: unknown) => {
        const plan = String(value);
        let badgeClass = '';
        let planText = '';
        
        switch (plan) {
          case 'basic':
            badgeClass = 'badge-info';
            planText = 'Básico';
            break;
          case 'premium':
            badgeClass = 'badge-success';
            planText = 'Premium';
            break;
          case 'vip':
            badgeClass = 'badge-warning';
            planText = 'VIP';
            break;
          default:
            badgeClass = '';
            planText = plan;
        }
        
        return (
          <span className={`badge ${badgeClass}`}>
            {planText}
          </span>
        );
      },
    },
    {
      key: 'id' as keyof ArtistRecord,
      label: 'Ações',
      render: (value: unknown, artist: ArtistRecord) => (
        <div className="flex items-center gap-2">
          <button 
            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
            aria-label="Editar artista"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit artist:', artist);
            }}
          >
            <Edit className="size-4" />
          </button>
          <button 
            className="text-danger hover:text-danger/90 p-1 rounded-full hover:bg-danger/10"
            aria-label="Excluir artista"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedArtist(artist);
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2 className="size-4" />
          </button>
          <button 
            className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
            aria-label="Ver detalhes"
            onClick={(e) => {
              e.stopPropagation();
              console.log('View artist details:', artist);
            }}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  // Manipuladores de eventos
  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    
    // Aplicar filtros aos dados usando a função do arquivo de dados
    const filtered = filterArtists(mockArtistsData, newFilters, searchQuery);
    setFilteredArtists(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // Aplicar a nova pesquisa junto com os filtros existentes
    const filtered = filterArtists(mockArtistsData, activeFilters, query);
    setFilteredArtists(filtered);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setFilteredArtists(mockArtistsData);
  };

  const handleRowClick = (artist: ArtistRecord) => {
    console.log('Artist clicked:', artist);
    // Implementar a lógica de navegação ou exibição de detalhes aqui
  };

  const handleDeleteConfirm = () => {
    if (selectedArtist) {
      console.log('Deleting artist:', selectedArtist);
      // Simulação de exclusão
      setFilteredArtists(prevArtists => 
        prevArtists.filter(artist => artist.id !== selectedArtist.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedArtist(null);
    }
  };

  return (
    <div>
      {/* Cabeçalho da página */}
      <PageHeader
        title="Artistas"
        description="Gerencie os artistas da plataforma EiMusic."
      >
        <Button
          variant="primary"
          leftIcon={<Plus className="size-4" />}
        >
          Adicionar Artista
        </Button>
      </PageHeader>

      {/* Barra de filtros */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onReset={handleResetFilters}
      />

      {/* Tabela de artistas */}
      {isLoading ? (
        <div className="card p-6 text-center animate-fade-in">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full size-10 border-t-2 border-b-2 border-primary"></div>
          </div>
          <p className="mt-4 text-muted">Carregando artistas...</p>
        </div>
      ) : (
        <DataTable
          data={filteredArtists}
          columns={columns}
          onRowClick={handleRowClick}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Excluir Artista"
        message={`Tem certeza que deseja excluir o artista ${selectedArtist?.name}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}