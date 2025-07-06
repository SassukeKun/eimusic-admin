/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { Video, Play, Eye, ThumbsUp, ThumbsDown, Clock, Edit, Trash2, Search, Filter } from 'lucide-react';
import EditVideoModal from '@/components/admin/EditVideoModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

// Tipos baseados na estrutura real da tabela
interface VideoData {
  id: string;
  artist_id: string;
  title: string;
  video_url: string | null;
  thumbnail_url: string | null;
  duration: number;
  format: string | null;
  is_video_clip: boolean;
  created_at: string;
  description: string | null;
  genre: string | null;
  views: number;
  likes: number;
  dislikes: number;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<VideoData | null>(null);
  
  // Estados dos filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Função para buscar vídeos da API
  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/videos');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar vídeos');
      }
      
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar vídeos quando componente montar
  useEffect(() => {
    fetchVideos();
  }, []);

  // Aplicar filtros sempre que videos ou filtros mudarem
  useEffect(() => {
    applyFilters();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos, searchQuery, selectedGenre, selectedType, dateFrom, dateTo]);

  // Função para aplicar filtros
  const applyFilters = () => {
    let filtered = [...videos];

    // Filtro por pesquisa (título)
    if (searchQuery.trim()) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por gênero
    if (selectedGenre) {
      filtered = filtered.filter(video => video.genre === selectedGenre);
    }

    // Filtro por tipo
    if (selectedType) {
      const isVideoClip = selectedType === 'videoclipe';
      filtered = filtered.filter(video => video.is_video_clip === isVideoClip);
    }

    // Filtro por data de criação
    if (dateFrom) {
      filtered = filtered.filter(video => 
        new Date(video.created_at) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filtered = filtered.filter(video => 
        new Date(video.created_at) <= new Date(dateTo + 'T23:59:59')
      );
    }

    setFilteredVideos(filtered);
  };

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedType('');
    setDateFrom('');
    setDateTo('');
  };

  // Obter lista única de gêneros para o filtro
  const availableGenres = [...new Set(videos.map(v => v.genre).filter(Boolean))];

  // Função para formatar duração de segundos para MM:SS
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Função para formatar data
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-MZ');
  };

  // Função para abrir modal de edição
  const handleEditVideo = (video: VideoData) => {
    setEditingVideo(video);
  };

  // Função para fechar modal de edição
  const handleCloseEdit = () => {
    setEditingVideo(null);
  };

  // Funções para deletar vídeo
  const handleDeleteVideo = (video: VideoData) => {
    setDeletingVideo(video);
  };

  const handleCloseDelete = () => {
    setDeletingVideo(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingVideo) return;
    
    try {
      const response = await fetch(`/api/videos/${deletingVideo.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar vídeo');
      }

      // Recarregar lista
      await fetchVideos();
      setDeletingVideo(null);
      
    } catch (err) {
      console.error('Erro ao deletar:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar vídeo');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Video className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">Carregando vídeos...</h1>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Video className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">Erro ao carregar vídeos</h1>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="text-red-800">
            <strong>Erro:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
{/* Cabeçalho moderno */}
     <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
       <div className="flex items-center justify-between">
         <div>
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-3 bg-white/20 rounded-xl">
               <Video className="h-8 w-8" />
             </div>
             <h1 className="text-3xl font-bold">Gestão de Vídeos</h1>
           </div>
           <p className="text-blue-100 text-lg">
             Gerencie e modere vídeos da plataforma EiMusic
           </p>
         </div>
         <div className="text-right">
           <div className="text-2xl font-bold">{videos.length}</div>
           <div className="text-blue-100">Total de vídeos</div>
         </div>
       </div>
     </div>

     {/* Estatísticas modernas */}
     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
       <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 shadow-lg">
         <div className="flex items-center justify-between">
           <div>
             <div className="text-3xl font-bold text-blue-700">{filteredVideos.length}</div>
             <div className="text-blue-600 font-medium">Vídeos Filtrados</div>
           </div>
           <div className="p-3 bg-blue-200 rounded-xl">
             <Video className="h-6 w-6 text-blue-700" />
           </div>
         </div>
       </div>

       <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-lg">
         <div className="flex items-center justify-between">
           <div>
             <div className="text-3xl font-bold text-green-700">
               {filteredVideos.filter(v => v.is_video_clip).length}
             </div>
             <div className="text-green-600 font-medium">Videoclipes</div>
           </div>
           <div className="p-3 bg-green-200 rounded-xl">
             <Play className="h-6 w-6 text-green-700" />
           </div>
         </div>
       </div>

       <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200 shadow-lg">
         <div className="flex items-center justify-between">
           <div>
             <div className="text-3xl font-bold text-purple-700">
               {filteredVideos.reduce((sum, v) => sum + v.views, 0).toLocaleString()}
             </div>
             <div className="text-purple-600 font-medium">Total Views</div>
           </div>
           <div className="p-3 bg-purple-200 rounded-xl">
             <Eye className="h-6 w-6 text-purple-700" />
           </div>
         </div>
       </div>

       <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200 shadow-lg">
         <div className="flex items-center justify-between">
           <div>
             <div className="text-3xl font-bold text-red-700">
               {filteredVideos.reduce((sum, v) => sum + v.likes, 0).toLocaleString()}
             </div>
             <div className="text-red-600 font-medium">Total Likes</div>
           </div>
           <div className="p-3 bg-red-200 rounded-xl">
             <ThumbsUp className="h-6 w-6 text-red-700" />
           </div>
         </div>
       </div>
     </div>

     {/* Filtros modernos */}
     <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
       <div className="flex items-center justify-between mb-6">
         <div className="flex items-center space-x-3">
           <div className="p-2 bg-blue-100 rounded-lg">
             <Filter className="h-5 w-5 text-blue-600" />
           </div>
           <h3 className="text-lg font-semibold text-gray-900">Filtros e Pesquisa</h3>
         </div>
         <button
           onClick={clearFilters}
           className="text-sm text-blue-600 hover:text-blue-800 font-medium px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
         >
           Limpar filtros
         </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
         {/* Pesquisa com ícone */}
         <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">
             Pesquisar
           </label>
           <div className="relative">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
             <input
               type="text"
               placeholder="Buscar por título..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
             />
           </div>
         </div>

         {/* Filtro por Gênero */}
         <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">
             Gênero
           </label>
           <select
             value={selectedGenre}
             onChange={(e) => setSelectedGenre(e.target.value)}
             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
           >
             <option value="">Todos os gêneros</option>
             {availableGenres.map(genre => (
               <option key={genre} value={genre || ''}>
                 {genre}
               </option>
             ))}
           </select>
         </div>

         {/* Filtro por Tipo */}
         <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">
             Tipo
           </label>
           <select
             value={selectedType}
             onChange={(e) => setSelectedType(e.target.value)}
             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
           >
             <option value="">Todos os tipos</option>
             <option value="videoclipe">Videoclipe</option>
             <option value="video">Vídeo</option>
           </select>
         </div>

         {/* Data De */}
         <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">
             Data de
           </label>
           <input
             type="date"
             value={dateFrom}
             onChange={(e) => setDateFrom(e.target.value)}
             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
           />
         </div>

         {/* Data Até */}
         <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">
             Data até
           </label>
           <input
             type="date"
             value={dateTo}
             onChange={(e) => setDateTo(e.target.value)}
             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
           />
         </div>
       </div>

       {/* Informações dos filtros */}
       <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
         <div className="text-sm text-gray-600 flex items-center space-x-4">
           <span>Mostrando {filteredVideos.length} de {videos.length} vídeos</span>
           {(searchQuery || selectedGenre || selectedType || dateFrom || dateTo) && (
             <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
               Filtros ativos
             </span>
           )}
         </div>
       </div>
     </div>
{/* Tabela moderna */}
     <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
       <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
         <h2 className="text-xl font-bold text-gray-900">
           Lista de Vídeos ({filteredVideos.length})
         </h2>
       </div>

       {filteredVideos.length === 0 ? (
         <div className="text-center py-16">
           <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
             <Video className="mx-auto h-12 w-12 text-gray-400" />
           </div>
           <h3 className="text-lg font-semibold text-gray-900 mb-2">
             {videos.length === 0 ? 'Nenhum vídeo encontrado' : 'Nenhum resultado'}
           </h3>
           <p className="text-gray-500 max-w-md mx-auto">
             {videos.length === 0 
               ? 'Os vídeos enviados pelos artistas aparecerão aqui para moderação.' 
               : 'Tente ajustar os filtros de pesquisa para encontrar o que procura.'
             }
           </p>
         </div>
       ) : (
         <div className="overflow-x-auto">
           <table className="min-w-full">
             <thead className="bg-gray-50 border-b border-gray-200">
               <tr>
                 <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                   Preview
                 </th>
                 <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                   Informações
                 </th>
                 <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                   Tipo
                 </th>
                 <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                   Duração
                 </th>
                 <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                   Engajamento
                 </th>
                 <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                   Data
                 </th>
                 <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                   Ações
                 </th>
               </tr>
             </thead>
             <tbody className="bg-white divide-y divide-gray-100">
               {filteredVideos.map((video, index) => (
                 <tr key={video.id} className={`hover:bg-gray-50 transition-colors ${
                   index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                 }`}>
                   <td className="px-6 py-4">
                     <div className="relative group">
                       {video.thumbnail_url ? (
                         <div className="relative">
                           <img
                             src={video.thumbnail_url}
                             alt={`Thumbnail de ${video.title}`}
                             className="h-16 w-24 rounded-xl object-cover shadow-md"
                           />
                           <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Play className="h-6 w-6 text-white" />
                           </div>
                         </div>
                       ) : (
                         <div className="h-16 w-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-md">
                           <Play className="h-6 w-6 text-gray-400" />
                         </div>
                       )}
                     </div>
                   </td>

                   <td className="px-6 py-4">
                     <div className="space-y-1">
                       <div className="text-sm font-semibold text-gray-900 line-clamp-2">
                         {video.title}
                       </div>
                       {video.description && (
                         <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">
                           {video.description}
                         </div>
                       )}
                       {video.genre && (
                         <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                           {video.genre}
                         </span>
                       )}
                     </div>
                   </td>

                   <td className="px-6 py-4">
                     <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                       video.is_video_clip 
                         ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                         : 'bg-gray-100 text-gray-800 border border-gray-200'
                     }`}>
                       {video.is_video_clip ? '🎵 Videoclipe' : '📹 Vídeo'}
                     </span>
                   </td>

                   <td className="px-6 py-4">
                     <div className="flex items-center text-sm text-gray-700">
                       <Clock className="h-4 w-4 mr-2 text-gray-400" />
                       <span className="font-medium">{formatDuration(video.duration)}</span>
                     </div>
                   </td>

                   <td className="px-6 py-4">
                     <div className="space-y-2">
                       <div className="flex items-center text-sm text-gray-600">
                         <Eye className="h-4 w-4 mr-2 text-blue-500" />
                         <span className="font-medium">{video.views.toLocaleString()}</span>
                       </div>
                       <div className="flex items-center space-x-4">
                         <div className="flex items-center text-xs text-green-600">
                           <ThumbsUp className="h-3 w-3 mr-1" />
                           {video.likes}
                         </div>
                         <div className="flex items-center text-xs text-red-500">
                           <ThumbsDown className="h-3 w-3 mr-1" />
                           {video.dislikes}
                         </div>
                       </div>
                     </div>
                   </td>

                   <td className="px-6 py-4 text-sm text-gray-500">
                     <div className="font-medium">{formatDate(video.created_at)}</div>
                   </td>

                   <td className="px-6 py-4">
                     <div className="flex space-x-2">
                       <button
                         onClick={() => handleEditVideo(video)}
                         className="flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all"
                       >
                         <Edit className="h-4 w-4 mr-1" />
                         Editar
                       </button>
                       <button
                         onClick={() => handleDeleteVideo(video)}
                         className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all"
                       >
                         <Trash2 className="h-4 w-4 mr-1" />
                         Deletar
                       </button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       )}
     </div>

     {/* Modais */}
     {editingVideo && (
       <EditVideoModal 
         video={editingVideo} 
         onClose={handleCloseEdit}
         onSave={fetchVideos}
       />
     )}

     {deletingVideo && (
       <DeleteConfirmationModal
         video={deletingVideo}
         onClose={handleCloseDelete}
         onConfirm={handleConfirmDelete}
       />
     )}
   </div>
 );
}