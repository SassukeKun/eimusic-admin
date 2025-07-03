// app/admin/content/videos/page.tsx
'use client';

import { useState } from 'react';
import { useVideos } from '@/hooks/useVideos';
import { useArtists } from '@/hooks/useArtists';
import { Video } from '@/types/admin';
import { VideoFormData } from '@/types/modal';

import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
import FilterBar from '@/components/admin/FilterBar';
import SearchBar from '@/components/admin/SearchBar';
import Button from '@/components/admin/Button';
import EmptyState from '@/components/admin/EmptyState';
import Skeleton from '@/components/admin/Skeleton';
import EditVideoModal from '@/components/ui/EditVideoModal';
import ConfirmationModal from '@/components/admin/ConfirmationModal';

export default function VideosPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const { artists } = useArtists();
  
  const { 
    videos, 
    isLoading, 
    error, 
    filters,
    searchQuery,
    loadVideos,
    createVideo,
    updateVideo,
    deleteVideo,
    updateFilters,
    resetFilters,
    updateSearch
  } = useVideos();

  const handleCreateVideo = () => {
    setSelectedVideo(null);
    setIsEditModalOpen(true);
  };

  const handleEditVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (video: Video) => {
    setSelectedVideo(video);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedVideo) {
      await deleteVideo(selectedVideo.id);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveVideo = async (formData: VideoFormData) => {
    if (selectedVideo) {
      await updateVideo(selectedVideo.id, formData);
    } else {
      await createVideo(formData);
    }
    setIsEditModalOpen(false);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const columns = [
    {
      key: 'thumbnailUrl',
      label: 'Thumbnail',
      render: (value: string | undefined, video: Video) => (
        <div className="w-24 h-14 rounded overflow-hidden">
          {value ? (
            <img 
              src={value} 
              alt={`Thumbnail do vídeo ${video.title}`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              <span className="text-xs">Sem thumbnail</span>
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
      key: 'duration',
      label: 'Duração',
      sortable: true,
      render: (value: number) => formatDuration(value)
    },
    {
      key: 'uploadDate',
      label: 'Data de Upload',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'views',
      label: 'Visualizações',
      sortable: true,
      render: (value: number) => value.toLocaleString()
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
      render: (_: any, video: Video) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleEditVideo(video)}
          >
            Editar
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDeleteClick(video)}
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
        title="Vídeos" 
        description="Gerencie os vídeos disponíveis na plataforma."
        actions={
          <Button onClick={handleCreateVideo}>
            Adicionar Vídeo
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
          Erro ao carregar vídeos. Por favor, tente novamente.
        </div>
      ) : videos.length === 0 ? (
        <EmptyState 
          title="Nenhum vídeo encontrado" 
          description="Comece adicionando um novo vídeo à plataforma."
          action={
            <Button onClick={handleCreateVideo}>
              Adicionar Vídeo
            </Button>
          }
        />
      ) : (
        <DataTable 
          data={videos}
          columns={columns}
          onRowClick={handleEditVideo}
        />
      )}

      {isEditModalOpen && (
        <EditVideoModal
          video={selectedVideo}
          artists={artists || []}
          onSave={handleSaveVideo}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && selectedVideo && (
        <ConfirmationModal
          title="Excluir Vídeo"
          message={`Tem certeza que deseja excluir o vídeo "${selectedVideo.title}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}