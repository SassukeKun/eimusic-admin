// app/admin/content/albums/page.tsx
'use client';

import { useEffect, useCallback, useState } from 'react';
import { getAllAlbums, createAlbum, updateAlbum, deleteAlbum } from '@/services/albumsCrud';
import { useArtists } from '@/hooks/useArtists';
import { Album } from '@/types/admin';
import { AlbumFormData } from '@/types/modal';
import { albumsToRecords } from '@/utils/albumRecordAdapter';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import Button from '@/components/admin/Button';
import EmptyState from '@/components/admin/EmptyState';
import { Skeleton } from '@/components/admin/Skeleton';
import Image from 'next/image';
import EditAlbumModal from '@/components/ui/EditAlbumModal';
import ConfirmationModal from '@/components/admin/ConfirmationModal';

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const { artists } = useArtists();

  // Carregar álbuns do banco
  const fetchAlbums = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllAlbums();
      setAlbums(data);
    } catch {
      setError('Erro ao carregar álbuns');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

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
      await fetchAlbums();
      setIsDeleteModalOpen(false);
    }
  };

  // Adapta AlbumFormData para o formato esperado pelo createAlbum
  const adaptFormDataToAlbum = (formData: AlbumFormData, artistName: string): Omit<Album, 'id'> => ({
    title: formData.title,
    artistId: formData.artistId,
    artistName: artistName,
    trackCount: formData.trackCount ?? 0,
    totalDuration: formData.totalDuration ?? 0,
    plays: 0,
    revenue: 0,
    releaseDate: formData.releaseDate ?? '',
    status: formData.status,
    coverArt: undefined,
  });

  const handleSaveAlbum = async (formData: AlbumFormData) => {
    const artist = artists.find(a => a.id === formData.artistId);
    const artistName = artist ? artist.name : '';
    if (selectedAlbum) {
      await updateAlbum(selectedAlbum.id, { ...formData, artistName });
    } else {
      await createAlbum(adaptFormDataToAlbum(formData, artistName));
    }
    await fetchAlbums();
    setIsEditModalOpen(false);
  };

  // Ajuste das colunas para DataTable tipado
  const columns = [
    {
      key: 'coverArt',
      label: 'Capa',
      render: (value: unknown, album: Album) => {
        const src = typeof value === 'string' && value ? value : undefined;
        return (
          <div className="w-12 h-12 rounded overflow-hidden">
            {src ? (
              <Image
                src={src}
                alt={`Capa do álbum ${album.title}`}
                className="w-full h-full object-cover"
                width={48}
                height={48}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                <span className="text-xs">Sem capa</span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'title',
      label: 'Título',
      sortable: true,
      render: (value: unknown) => value ? String(value) : '—',
    },
    {
      key: 'artistName',
      label: 'Artista',
      sortable: true,
      render: (value: unknown) => value ? String(value) : '—',
    },
    {
      key: 'trackCount',
      label: 'Faixas',
      sortable: true,
      render: (value: unknown) => typeof value === 'number' && !isNaN(value) ? value : '0',
    },
    {
      key: 'releaseDate',
      label: 'Lançamento',
      sortable: true,
      render: (value: unknown) => {
        if (typeof value === 'string' && value) {
          const date = new Date(value);
          return isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
        }
        return '—';
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: unknown) => {
        const statusMap: Record<string, { label: string, className: string }> = {
          published: { label: 'Publicado', className: 'bg-green-100 text-green-800' },
          draft: { label: 'Rascunho', className: 'bg-gray-100 text-gray-800' },
          removed: { label: 'Removido', className: 'bg-red-100 text-red-800' }
        };
        const statusKey = typeof value === 'string' ? value : '';
        const status = statusMap[statusKey] || { label: statusKey || '—', className: 'bg-gray-100 text-gray-800' };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
        );
      }
    },
    {
      key: 'description',
      label: 'Descrição',
      render: (value: unknown) => value ? String(value) : '—',
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (value: unknown) => Array.isArray(value) ? value.join(', ') : '—',
    },
    {
      key: 'visibility',
      label: 'Visibilidade',
      render: (value: unknown) => value ? String(value) : '—',
    },
    {
      key: 'isExplicit',
      label: 'Explícito',
      render: (value: unknown) => value ? 'Sim' : 'Não',
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (value: unknown) => {
        if (typeof value === 'string' && value) {
          const date = new Date(value);
          return isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
        }
        return '—';
      }
    },
    {
      key: 'updatedAt',
      label: 'Atualizado em',
      render: (value: unknown) => {
        if (typeof value === 'string' && value) {
          const date = new Date(value);
          return isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
        }
        return '—';
      }
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: unknown, album: Album) => (
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

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Álbuns" 
        description="Gerencie os álbuns disponíveis na plataforma."
        actions={
          <Button onClick={handleCreateAlbum} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:from-indigo-600 hover:to-purple-700">
            <span className="mr-2">+</span> Adicionar Álbum
          </Button>
        }
      />

      <div className="rounded-xl bg-white/80 shadow-lg p-6 border border-gray-100">
        {isLoading ? (
          <Skeleton />
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700">
            Erro ao carregar álbuns. Por favor, tente novamente.
          </div>
        ) : albums.length === 0 ? (
          <EmptyState 
            title="Nenhum álbum encontrado" 
            description="Comece adicionando um novo álbum à plataforma."
            action={{
              label: 'Adicionar Álbum',
              onClick: handleCreateAlbum
            }}
          />
        ) : (
          <DataTable 
            data={albumsToRecords(albums)}
            columns={columns as { key: string; label: string; sortable?: boolean; render?: ((value: unknown, item: Record<string, unknown>) => React.ReactNode); }[]}
            onRowClick={(item: Record<string, unknown>) => handleEditAlbum(item as unknown as Album)}
          />
        )}
      </div>

      {isEditModalOpen && (
        <EditAlbumModal
          album={selectedAlbum as Album | null}
          artists={artists.map(a => ({
            id: a.id,
            name: a.name,
            email: a.email,
            // Provide fallbacks for required Album Artist fields
            status: 'active',
            joinDate: a.created_at || '',
            joinedDate: a.created_at || '',
            monetizationPlan: 'basic',
            verified: a.verified,
            // Optionals
            profileImage: a.profile_image_url || undefined,
            genre: '',
            phone: a.phone || undefined,
            bio: a.bio || undefined,
          }))}
          onSave={handleSaveAlbum}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && selectedAlbum && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Excluir Álbum"
          message={`Tem certeza que deseja excluir o álbum "${selectedAlbum.title}"? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}