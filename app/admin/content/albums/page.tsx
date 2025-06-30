// app/admin/content/albums/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Disc3 } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import DataTable from '@/components/admin/DataTable';
import FilterBar from '@/components/admin/FilterBar';
import { 
  mockAlbumsData, 
  filterAlbums,
  formatAlbumDuration,
  type AlbumRecord 
} from '@/data/albumsData';
import type { FilterConfig } from '@/types/admin';

export default function AlbumsPage() {
  const [filteredAlbums, setFilteredAlbums] = useState<AlbumRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Inicializar os álbuns filtrados com todos os álbuns
  useEffect(() => {
    setFilteredAlbums(mockAlbumsData);
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
      key: 'releaseDate',
      label: 'Data de Lançamento',
      type: 'date',
    },
  ];

  // Configuração das colunas da tabela
  const columns = [
    {
      key: 'title' as keyof AlbumRecord,
      label: 'Álbum',
      sortable: true,
      render: (value: unknown, album: AlbumRecord) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 relative">
            <Image
              className="h-10 w-10 rounded"
              src={album.coverArt?.toString() || 'https://via.placeholder.com/40'}
              alt={album.title?.toString() || 'Álbum'}
              width={40}
              height={40}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded">
              <Disc3 className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{album.title}</div>
            <div className="text-sm text-gray-500">{album.artistName}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'trackCount' as keyof AlbumRecord,
      label: 'Faixas',
      sortable: true,
      render: (value: unknown) => Number(value).toLocaleString('pt-MZ'),
    },
    {
      key: 'totalDuration' as keyof AlbumRecord,
      label: 'Duração',
      sortable: true,
      render: (value: unknown) => formatAlbumDuration(Number(value)),
    },
    {
      key: 'plays' as keyof AlbumRecord,
      label: 'Reproduções',
      sortable: true,
      render: (value: unknown) => Number(value).toLocaleString('pt-MZ'),
    },
    {
      key: 'revenue' as keyof AlbumRecord,
      label: 'Receita',
      sortable: true,
      render: (value: unknown) => (
        <span>MT {Number(value).toLocaleString('pt-MZ')}</span>
      ),
    },
    {
      key: 'releaseDate' as keyof AlbumRecord,
      label: 'Data de Lançamento',
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
      key: 'status' as keyof AlbumRecord,
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
      key: 'id' as keyof AlbumRecord,
      label: 'Ações',
      render: () => (
        <div className="flex space-x-2">
          <button 
            className="text-indigo-600 hover:text-indigo-900"
            aria-label="Editar álbum"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button 
            className="text-red-600 hover:text-red-900"
            aria-label="Excluir álbum"
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
    const filtered = filterAlbums(mockAlbumsData, newFilters, searchQuery);
    setFilteredAlbums(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // Aplicar a nova pesquisa junto com os filtros existentes
    const filtered = filterAlbums(mockAlbumsData, activeFilters, query);
    setFilteredAlbums(filtered);
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
    setFilteredAlbums(mockAlbumsData);
  };

  const handleRowClick = (album: AlbumRecord) => {
    console.log('Album clicked:', album);
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
      <h1 className="text-2xl font-bold text-gray-900">Álbuns</h1>
      <p className="text-gray-600 mt-1">
        Gerencie os álbuns de música na plataforma EiMusic.
      </p>
    </div>

      {/* Barra de filtros */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onReset={handleResetFilters}
      />

      {/* Tabela de álbuns */}
      <DataTable
        data={filteredAlbums}
        columns={columns}
        onRowClick={handleRowClick}
      />
    </div>
  );
}