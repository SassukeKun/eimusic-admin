// app/admin/content/tracks/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Play, Pause } from 'lucide-react';
// import PageHeader from '@/components/admin/PageHeader';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import DataTable from '@/components/admin/DataTable';
import FilterBar from '@/components/admin/FilterBar';
import EditTrackModal from '@/components/ui/EditTrackModal';
import type { TrackFormData } from '@/components/ui/EditTrackModal';
import { 
  mockTracksData, 
  filterTracks,
  formatDuration,
  type TrackRecord 
} from '@/data/tracksData';
import type { FilterConfig } from '@/types/admin';

export default function TracksPage() {
  const [filteredTracks, setFilteredTracks] = useState<TrackRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackFormData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5; // Número de itens por página

  // Inicializar as faixas filtradas com todas as faixas
  useEffect(() => {
    setFilteredTracks(mockTracksData);
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
  const togglePlay = (trackId: string) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(trackId);
    }
  };

  // Função para abrir o modal de edição
  const handleEditTrack = (track: TrackRecord) => {
    // Converter o TrackRecord para TrackFormData
    const trackData: TrackFormData = {
      id: track.id.toString(),
      title: track.title.toString(),
      artistId: track.artistId.toString(),
      duration: Number(track.duration),
      status: track.status as 'published' | 'draft' | 'removed',
      coverArt: track.coverArt?.toString(),
    };
    
    setSelectedTrack(trackData);
    setIsEditModalOpen(true);
  };

  // Função para salvar alterações da faixa
  const handleSaveTrack = async (data: TrackFormData) => {
    setIsLoading(true);
    
    // Simular um atraso de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Em um ambiente real, aqui seria feito o upload do arquivo
    // e a URL seria obtida do servidor após o upload
    const coverArtUrl = data.coverArt;
    
    // Se houver um arquivo de imagem, em um ambiente real faríamos o upload
    // e obteríamos a URL do servidor. Aqui apenas simulamos isso.
    if (data.coverFile) {
      console.log('Arquivo de imagem recebido:', data.coverFile.name);
      // Em um ambiente real, aqui seria feito o upload do arquivo
      // const uploadedUrl = await uploadImageToServer(data.coverFile);
      // coverArtUrl = uploadedUrl;
    }
    
    // Atualizar os dados mockados (em produção, isso seria uma chamada API)
    const updatedTracks = mockTracksData.map(track => {
      if (track.id === data.id) {
        return {
          ...track,
          title: data.title,
          artistId: data.artistId,
          duration: data.duration,
          status: data.status,
          coverArt: coverArtUrl,
        };
      }
      return track;
    });
    
    // Atualizar os dados filtrados também
    const updatedFilteredTracks = filterTracks(updatedTracks, activeFilters, searchQuery);
    setFilteredTracks(updatedFilteredTracks);
    
    setIsLoading(false);
    setIsEditModalOpen(false);
  };

  // Configuração das colunas da tabela
  const columns = [
    {
      key: 'title' as keyof TrackRecord,
      label: 'Faixa',
      sortable: true,
      render: (value: unknown, track: TrackRecord) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 relative">
            <Image
              className="h-10 w-10 rounded"
              src={track.coverArt?.toString() || 'https://via.placeholder.com/40'}
              alt={track.title?.toString() || 'Faixa'}
              width={40}
              height={40}
            />
            <button 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded hover:bg-opacity-60"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay(track.id.toString());
              }}
              aria-label={currentlyPlaying === track.id ? "Pausar" : "Reproduzir"}
            >
              {currentlyPlaying === track.id ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{track.title}</div>
            <div className="text-sm text-gray-500">{track.artistName}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'duration' as keyof TrackRecord,
      label: 'Duração',
      sortable: true,
      render: (value: unknown) => formatDuration(Number(value)),
    },
    {
      key: 'plays' as keyof TrackRecord,
      label: 'Reproduções',
      sortable: true,
      render: (value: unknown) => Number(value).toLocaleString('pt-MZ'),
    },
    {
      key: 'revenue' as keyof TrackRecord,
      label: 'Receita',
      sortable: true,
      render: (value: unknown) => (
        <span>MT {Number(value).toLocaleString('pt-MZ')}</span>
      ),
    },
    {
      key: 'uploadDate' as keyof TrackRecord,
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
      key: 'status' as keyof TrackRecord,
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
      key: 'id' as keyof TrackRecord,
      label: 'Ações',
      render: (value: unknown, track: TrackRecord) => (
        <div className="flex space-x-2">
          <button 
            className="text-indigo-600 hover:text-indigo-900"
            aria-label="Editar faixa"
            onClick={(e) => {
              e.stopPropagation();
              handleEditTrack(track);
            }}
          >
            <Edit className="h-5 w-5" />
          </button>
          <button 
            className="text-red-600 hover:text-red-900"
            aria-label="Excluir faixa"
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
    const filtered = filterTracks(mockTracksData, newFilters, searchQuery);
    setFilteredTracks(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // Aplicar a nova pesquisa junto com os filtros existentes
    const filtered = filterTracks(mockTracksData, activeFilters, query);
    setFilteredTracks(filtered);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setFilteredTracks(mockTracksData);
  };

  const handleRowClick = (track: TrackRecord) => {
    console.log('Track clicked:', track);
    // Implementar a lógica de navegação ou exibição de detalhes aqui
  };

  return (
   <div>
    {/* Cabeçalho da página com botão de volta */}
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <Link 
          href="/admin/content" 
          className="inline-flex items-center mr-4 text-sm text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para Conteúdo
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Faixas</h1>
      <p className="text-gray-600 mt-1">
        Gerencie as faixas de música na plataforma EiMusic.
      </p>
    </div>

      {/* Barra de filtros */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onReset={handleResetFilters}
      />

      {/* Tabela de faixas */}
      <div className="mt-6">
        <DataTable
          data={filteredTracks}
          columns={columns}
          onRowClick={handleRowClick}
          itemsPerPage={itemsPerPage}
        />
      </div>

      {/* Modal de edição */}
      <EditTrackModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTrack}
        track={selectedTrack}
        loading={isLoading}
        mode="edit"
      />
    </div>
  );
}