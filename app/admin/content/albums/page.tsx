// app/admin/content/albums/page.tsx
'use client';

import { useState } from 'react';
import { useAlbums } from '@/hooks/useAlbums';
import { useArtists } from '@/hooks/useArtists';
import { Album } from '@/types/admin';
import { AlbumFormData } from '@/types/modal';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import FilterBar from '@/components/admin/FilterBar';
import SearchBar from '@/components/admin/SearchBar';
import Button from '@/components/admin/Button';
import EmptyState from '@/components/admin/EmptyState';
import Skeleton from '@/components/admin/Skeleton';
import EditAlbumModal from '@/components/ui/EditAlbumModal';
import ConfirmationModal from '@/components/admin/ConfirmationModal';

export default function AlbumsPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const { artists } = useArtists();
  
  const { 
    albums, 
    isLoading, 
    error, 
    filters,
    searchQuery,
    loadAlbums,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    updateFilters,
    resetFilters,
    updateSearch
  } = useAlbums();

  const handleCreateAlbum = () => {
    setSelectedAlbum(null);
    setIsEditModalOpen(true);
  };

  const handleEditAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (album: Album) => {
    setSelectedAlbum(album);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAlbum) {
      await deleteAlbum(selectedAlbum.id);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveAlbum = async (formData: AlbumFormData) => {
    if (selectedAlbum) {
      await updateAlbum(selectedAlbum.id, formData);
    } else {
      await createAlbum(formData);
    }
    setIsEditModalOpen(false);
  };

  const columns = [
    {
      key: 'coverArt',
      label: 'Capa',
      render: (value: string | undefined, album: Album) => (
        <div className="w-12 h-12 rounded overflow-hidden">
          {value ? (
            <img 
              src={value} 
              alt={`Capa do álbum ${album.title}`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              <span className="text-xs">Sem capa</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'title',
      label: 'Título',
      sortable: true
    },
    {
      key: 'artistName',
      label: 'Artista',
      sortable: true
    },
    {
      key: 'trackCount',
      label: 'Faixas',
      sortable: true
    },
    {
      key: 'releaseDate',
      label: 'Lançamento',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => {
        const statusMap: Record<string, { label: string, className: string }> = {
          published: { label: 'Publicado', className: 'bg-green-100 text-green-800' },
          draft: { label: 'Rascunho', className: 'bg-gray-100 text-gray-800' },
          removed: { label: 'Removido', className: 'bg-red-100 text-red-800' }
        };
        
        const status = statusMap[value] || { label: value, className: 'bg-gray-100 text-gray-800' };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, album: Album) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleEditAlbum(album)}
          >
            Editar
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDeleteClick(album)}
          >
            Excluir
          </Button>
        </div>
      )
    }
  ];

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: '', label: 'Todos' },
        { value: 'published', label: 'Publicado' },
        { value: 'draft', label: 'Rascunho' },
        { value: 'removed', label: 'Removido' }
      ]
    },
    {
      key: 'artist_id',
      label: 'Artista',
      options: [
        { value: '', label: 'Todos' },
        ...(artists || []).map(artist => ({
          value: artist.id,
          label: artist.name
        }))
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Álbuns" 
        description="Gerencie os álbuns disponíveis na plataforma."
        actions={
          <Button onClick={handleCreateAlbum}>
            Adicionar Álbum
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <SearchBar 
          placeholder="Buscar por título ou artista" 
          value={searchQuery}
          onChange={updateSearch}
        />
        <FilterBar 
          filters={filterOptions} 
          activeFilters={filters}
          onFilterChange={updateFilters}
          onReset={resetFilters}
        />
      </div>

      {isLoading ? (
        <Skeleton rows={5} />
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          Erro ao carregar álbuns. Por favor, tente novamente.
        </div>
      ) : albums.length === 0 ? (
        <EmptyState 
          title="Nenhum álbum encontrado" 
          description="Comece adicionando um novo álbum à plataforma."
          action={
            <Button onClick={handleCreateAlbum}>
              Adicionar Álbum
            </Button>
          }
        />
      ) : (
        <DataTable 
          data={albums}
          columns={columns}
          onRowClick={handleEditAlbum}
        />
      )}

      {isEditModalOpen && (
        <EditAlbumModal
          album={selectedAlbum}
          artists={artists || []}
          onSave={handleSaveAlbum}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && selectedAlbum && (
        <ConfirmationModal
          title="Excluir Álbum"
          message={`Tem certeza que deseja excluir o álbum "${selectedAlbum.title}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}