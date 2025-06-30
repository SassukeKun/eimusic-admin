// app/admin/content/videos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import DataTable from '@/components/admin/DataTable';
import FilterBar from '@/components/admin/FilterBar';
import { 
  mockVideosData, 
  filterVideos,
  formatDuration,
  type VideoRecord 
} from '@/data/videosData';
import type { FilterConfig } from '@/types/admin';

export default function VideosPage() {
  const [filteredVideos, setFilteredVideos] = useState<VideoRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Inicializar os vídeos filtrados com todos os vídeos
  useEffect(() => {
    setFilteredVideos(mockVideosData);
  }, []);

  // Configuração dos filtros
  const filters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'published', label: 'Publicado' },
        { value: 'draft', label: 'Rascunho' },
        { value: 'removed', label: 'Removido' },
      ],
    },
    {
      key: 'artistId',
      label: 'Artista',
      type: 'select',
      options: [
        { value: '1', label: 'Lizha James' },
        { value: '2', label: 'MC Roger' },
        { value: '3', label: 'Valter Artístico' },
        { value: '4', label: 'Marllen' },
        { value: '5', label: 'Ziqo' },
      ],
    },
    {
      key: 'uploadDate',
      label: 'Data de Upload',
      type: 'date',
    },
  ];

  // Função para alternar a reprodução
  const togglePlay = (videoId: string) => {
    if (currentlyPlaying === videoId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(videoId);
    }
  };

  // Configuração das colunas da tabela
  const columns = [
    {
      key: 'title' as keyof VideoRecord,
      label: 'Vídeo',
      sortable: true,
      render: (value: unknown, video: VideoRecord) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-16 relative">
            <Image
              className="h-10 w-16 rounded object-cover"
              src={video.thumbnailUrl?.toString() || 'https://via.placeholder.com/160x90'}
              alt={video.title?.toString() || 'Vídeo'}
              width={64}
              height={40}
            />
            <button 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded hover:bg-opacity-60"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay(video.id.toString());
              }}
              aria-label={currentlyPlaying === video.id ? "Pausar" : "Reproduzir"}
            >
              <PlayCircle className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{video.title}</div>
            <div className="text-sm text-gray-500">{video.artistName}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'duration' as keyof VideoRecord,
      label: 'Duração',
      sortable: true,
      render: (value: unknown) => formatDuration(Number(value)),
    },
    {
      key: 'views' as keyof VideoRecord,
      label: 'Visualizações',
      sortable: true,
      render: (value: unknown) => Number(value).toLocaleString('pt-MZ'),
    },
    {
      key: 'revenue' as keyof VideoRecord,
      label: 'Receita',
      sortable: true,
      render: (value: unknown) => (
        <span>MT {Number(value).toLocaleString('pt-MZ')}</span>
      ),
    },
    {
      key: 'uploadDate' as keyof VideoRecord,
      label: 'Data de Upload',
      sortable: true,
      render: (value: unknown) => {
        const date = new Date(String(value));
        return new Intl.DateTimeFormat('pt-MZ', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date);
      },
    },
    {
      key: 'status' as keyof VideoRecord,
      label: 'Status',
      sortable: true,
      render: (value: unknown) => {
        const status = String(value);
        let statusClass = '';
        let statusText = '';
        
        switch (status) {
          case 'published':
            statusClass = 'bg-green-100 text-green-800';
            statusText = 'Publicado';
            break;
          case 'draft':
            statusClass = 'bg-yellow-100 text-yellow-800';
            statusText = 'Rascunho';
            break;
          case 'removed':
            statusClass = 'bg-red-100 text-red-800';
            statusText = 'Removido';
            break;
          default:
            statusClass = 'bg-gray-100 text-gray-800';
            statusText = status;
        }
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
            {statusText}
          </span>
        );
      },
    },
    {
      key: 'id' as keyof VideoRecord,
      label: 'Ações',
      render: () => (
        <div className="flex space-x-2">
          <button 
            className="text-indigo-600 hover:text-indigo-900"
            aria-label="Editar vídeo"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button 
            className="text-red-600 hover:text-red-900"
            aria-label="Excluir vídeo"
          >
            <Trash2 className="h-5 w-5" />
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
    const filtered = filterVideos(mockVideosData, newFilters, searchQuery);
    setFilteredVideos(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // Aplicar a nova pesquisa junto com os filtros existentes
    const filtered = filterVideos(mockVideosData, activeFilters, query);
    setFilteredVideos(filtered);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setFilteredVideos(mockVideosData);
  };

  const handleRowClick = (video: VideoRecord) => {
    console.log('Video clicked:', video);
    // Implementar a lógica de navegação ou exibição de detalhes aqui
  };

  return (
    <div>
      {/* Cabeçalho da página */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Vídeos</h1>
        <p className="text-gray-600 mt-1">
          Gerencie os vídeos de música na plataforma EiMusic.
        </p>
      </div>

      {/* Barra de filtros */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onReset={handleResetFilters}
      />

      {/* Tabela de vídeos */}
      <DataTable
        data={filteredVideos}
        columns={columns}
        onRowClick={handleRowClick}
      />
    </div>
  );
}