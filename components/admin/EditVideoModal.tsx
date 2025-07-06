/* eslint-disable jsx-a11y/alt-text */
import { useState } from 'react';
import { X, Save, Loader, Play, Image, Clock, Tag, Type, FileText, Calendar } from 'lucide-react';

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

interface EditVideoModalProps {
  video: VideoData;
  onClose: () => void;
  onSave: () => void;
}

export default function EditVideoModal({ video, onClose, onSave }: EditVideoModalProps) {
  const [formData, setFormData] = useState({
    title: video.title,
    description: video.description || '',
    genre: video.genre || '',
    is_video_clip: video.is_video_clip,
    duration: video.duration
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'stats'>('basic');

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await fetch(`/api/videos/${video.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar vídeo');
      }

      onSave();
      onClose();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDurationForDisplay = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const parseDurationToSeconds = (duration: string): number => {
    const parts = duration.split(':');
    if (parts.length !== 2) return 0;
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    return minutes * 60 + seconds;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <h2 className="text-xl font-bold">Editar Vídeo</h2>
              <p className="text-blue-100 text-sm">ID: {video.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-start space-x-6">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              {video.thumbnail_url ? (
                <div className="relative group">
                  <img
                    src={video.thumbnail_url}
                    alt={`Thumbnail de ${video.title}`}
                    className="h-32 w-48 rounded-xl object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              ) : (
                <div className="h-32 w-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="text-center text-gray-500">
                    <Image className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-sm">Sem thumbnail</span>
                  </div>
                </div>
              )}
            </div>

            {/* Info Cards */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="text-2xl font-bold text-blue-600">{video.views.toLocaleString()}</div>
                <div className="text-sm text-gray-600 flex items-center">
                  <Play className="h-4 w-4 mr-1" />
                  Visualizações
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="text-2xl font-bold text-green-600">{video.likes}</div>
                <div className="text-sm text-gray-600">Likes</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="text-2xl font-bold text-red-600">{video.dislikes}</div>
                <div className="text-sm text-gray-600">Dislikes</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="text-2xl font-bold text-purple-600">
                  {formatDurationForDisplay(video.duration)}
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Duração
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b bg-white">
          <div className="flex space-x-0">
            {[
              { id: 'basic', label: 'Informações Básicas', icon: FileText },
              { id: 'details', label: 'Detalhes', icon: Tag },
              { id: 'stats', label: 'Estatísticas', icon: Calendar }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'basic' | 'details' | 'stats')}
                  className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full">
                <X className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-red-800 text-sm">{error}</div>
            </div>
          )}

          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Type className="h-4 w-4 mr-2" />
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Digite o título do vídeo"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Descrição do vídeo (opcional)"
                />
              </div>

              {/* Gênero e Tipo em Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Gênero
                  </label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ex: Marrabenta, Kizomba"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Play className="h-4 w-4 mr-2" />
                    Tipo
                  </label>
                  <select
                    value={formData.is_video_clip.toString()}
                    onChange={(e) => handleInputChange('is_video_clip', e.target.value === 'true')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="true">Videoclipe</option>
                    <option value="false">Vídeo</option>
                  </select>
                </div>
              </div>

              {/* Duração */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Duração (MM:SS)
                </label>
                <input
                  type="text"
                  value={formatDurationForDisplay(formData.duration)}
                  onChange={(e) => {
                    const seconds = parseDurationToSeconds(e.target.value);
                    handleInputChange('duration', seconds);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ex: 3:45"
                  pattern="[0-9]+:[0-9]{2}"
                />
                <div className="text-xs text-gray-500 mt-2 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Formato: minutos:segundos (ex: 3:45)
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes Técnicos</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Formato</label>
                    <div className="text-lg font-mono bg-white px-3 py-2 rounded-lg border">
                      {video.format || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">ID do Artista</label>
                    <div className="text-lg font-mono bg-white px-3 py-2 rounded-lg border">
                      {video.artist_id}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">URLs do Conteúdo</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">URL do Vídeo</label>
                    <div className="bg-white p-3 rounded-lg border font-mono text-sm break-all">
                      {video.video_url || 'Não disponível'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">URL da Thumbnail</label>
                    <div className="bg-white p-3 rounded-lg border font-mono text-sm break-all">
                      {video.thumbnail_url || 'Não disponível'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{video.views.toLocaleString()}</div>
                  <div className="text-blue-800 font-medium">Total de Visualizações</div>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{video.likes}</div>
                  <div className="text-green-800 font-medium">Likes Recebidos</div>
                </div>
                
                <div className="bg-red-50 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">{video.dislikes}</div>
                  <div className="text-red-800 font-medium">Dislikes</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações de Criação</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Data de Criação:</span>
                    <span className="font-medium">{formatDate(video.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Tipo de Conteúdo:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      video.is_video_clip 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {video.is_video_clip ? 'Videoclipe' : 'Vídeo'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Duração:</span>
                    <span className="font-medium">{formatDurationForDisplay(video.duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer com gradiente */}
        <div className="flex justify-end space-x-3 p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !formData.title.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center transition-all shadow-lg"
          >
            {isSaving ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}