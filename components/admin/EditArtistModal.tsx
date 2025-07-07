'use client';

import { useState, useEffect } from 'react';
import { X, Upload, User as UserIcon, Mail, Phone, MapPin, Shield, Crown, ExternalLink } from 'lucide-react';
import type { Artist, ArtistFormData, MonetizationPlan, MozambiqueProvince } from '@/types/artists';
import { MOZAMBIQUE_PROVINCES, SOCIAL_PLATFORMS, validateSocialLink } from '@/types/artists';

interface EditArtistModalProps {
  isOpen: boolean;
  artist?: Artist | null;
  onClose: () => void;
  onSave: (data: ArtistFormData) => Promise<void>;
  monetizationPlans: MonetizationPlan[];
}

export default function EditArtistModal({
  isOpen,
  artist,
  onClose,
  onSave,
  monetizationPlans
}: EditArtistModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'social' | 'monetization'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ArtistFormData>({
    name: '',
    email: '',
    bio: '',
    phone: '',
    province: undefined,
    verified: false,
    monetizationPlanId: '',
    socialLinks: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = Boolean(artist);

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name,
        email: artist.email,
        bio: artist.bio || '',
        phone: artist.phone || '',
        province: artist.province,
        verified: artist.verified,
        monetizationPlanId: artist.monetizationPlanId || '',
        socialLinks: artist.socialLinks || {},
        existingProfileImageUrl: artist.profileImageUrl,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        bio: '',
        phone: '',
        province: undefined,
        verified: false,
        monetizationPlanId: '',
        socialLinks: {},
      });
    }
    setErrors({});
  }, [artist]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }

    // Validar links sociais
    Object.entries(formData.socialLinks).forEach(([platform, url]) => {
      if (url && !validateSocialLink(platform, url)) {
        newErrors[`social_${platform}`] = `Link do ${platform} inválido`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSocialLink = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserIcon className="w-6 h-6 mr-3" />
              <h2 className="text-xl font-semibold">
                {isEditMode ? 'Editar Artista' : 'Novo Artista'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isEditMode && artist && (
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex items-center space-x-4">
              {artist.profileImageUrl ? (
                <img
                  src={artist.profileImageUrl}
                  alt={artist.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900 flex items-center">
                  {artist.name}
                  {artist.verified && (
                    <Shield className="w-4 h-4 ml-2 text-blue-500" />
                  )}
                </h3>
                <p className="text-sm text-gray-600">{artist.email}</p>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-gray-500">
                    {artist.subscribers.toLocaleString()} seguidores
                  </span>
                  {artist.province && (
                    <span className="text-xs text-gray-500">
                      <MapPin className="inline w-3 h-3 mr-1" />
                      {artist.province}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    Desde {formatDate(artist.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'basic'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Dados Básicos
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'contact'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Contato
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'social'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Redes Sociais
          </button>
          <button
            onClick={() => setActiveTab('monetization')}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === 'monetization'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Monetização
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Artista
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Nome artístico"
                    required
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="email@exemplo.com"
                    required
                  />
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biografia (Opcional)
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Conte sobre o artista..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.bio?.length || 0} caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Upload className="inline w-4 h-4 mr-1" />
                    Foto de Perfil (Opcional)
                  </label>
                  {formData.existingProfileImageUrl && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                      <p className="text-sm text-gray-600 mb-2">Foto atual:</p>
                      <img
                        src={formData.existingProfileImageUrl}
                        alt="Foto atual"
                        className="w-24 h-24 object-cover rounded-full"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.files?.[0] })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Telefone (Opcional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+258 84 123 4567"
                  />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Província (Opcional)
                  </label>
                  <select
                    value={formData.province || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      province: e.target.value as MozambiqueProvince | undefined 
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Selecione uma província</option>
                    {MOZAMBIQUE_PROVINCES.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="verified" className="text-sm font-medium text-gray-700">
                    <Shield className="inline w-4 h-4 mr-1" />
                    Artista verificado
                  </label>
                </div>
                
                {formData.verified && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      <Shield className="inline w-4 h-4 mr-1" />
                      Este artista terá o selo de verificação e maior visibilidade na plataforma.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Links das Redes Sociais</h4>
                  <p className="text-sm text-gray-600">
                    Adicione os links para as redes sociais do artista. Todos os campos são opcionais.
                  </p>
                </div>

                {SOCIAL_PLATFORMS.map((platform) => (
                  <div key={platform.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ExternalLink className="inline w-4 h-4 mr-1" />
                      {platform.label}
                    </label>
                    <input
                      type="text"
                      value={formData.socialLinks[platform.key] || ''}
                      onChange={(e) => updateSocialLink(platform.key, e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 ${
                        errors[`social_${platform.key}`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={platform.placeholder}
                    />
                    {errors[`social_${platform.key}`] && (
                      <p className="text-sm text-red-600 mt-1">{errors[`social_${platform.key}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'monetization' && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-medium text-green-800 mb-2">
                    <Crown className="inline w-4 h-4 mr-1" />
                    Plano de Monetização
                  </h4>
                  <p className="text-sm text-green-700">
                    Escolha um plano de monetização para que o artista possa receber pagamentos pelos streams.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plano de Monetização
                  </label>
                  <select
                    value={formData.monetizationPlanId}
                    onChange={(e) => setFormData({ ...formData, monetizationPlanId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Nenhum plano</option>
                    {monetizationPlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - {(plan.artist_share * 100).toFixed(0)}% para artista
                      </option>
                    ))}
                  </select>
                </div>

                {formData.monetizationPlanId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    {(() => {
                      const selectedPlan = monetizationPlans.find(p => p.id === formData.monetizationPlanId);
                      return selectedPlan ? (
                        <div>
                          <h5 className="font-medium text-blue-800 mb-2">Detalhes do Plano</h5>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Taxa da plataforma: {(selectedPlan.platform_fee * 100).toFixed(0)}%</li>
                            <li>• Receita do artista: {(selectedPlan.artist_share * 100).toFixed(0)}%</li>
                            <li>• Tipo: {selectedPlan.monetization_type}</li>
                            {selectedPlan.features && selectedPlan.features.length > 0 && (
                              <li>• Recursos: {selectedPlan.features.join(', ')}</li>
                            )}
                          </ul>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.name || !formData.email}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Salvando...' : isEditMode ? 'Salvar Alterações' : 'Criar Artista'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}