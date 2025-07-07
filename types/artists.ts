// types/artists.ts

// Províncias de Moçambique
export type MozambiqueProvince = 
  | 'Maputo'
  | 'Gaza' 
  | 'Inhambane'
  | 'Sofala'
  | 'Manica'
  | 'Tete'
  | 'Zambézia'
  | 'Nampula'
  | 'Cabo Delgado'
  | 'Niassa'
  | 'Maputo Cidade';

// Links sociais do artista
export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  website?: string;
  facebook?: string;
  youtube?: string;
  spotify?: string;
  soundcloud?: string;
}

export interface ArtistDB {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  phone: string | null;
  monetization_plan_id: string | null;
  profile_image_url: string | null;
  social_links: SocialLinks | null;
  created_at: string;
  verified: boolean;
  subscribers: number;
  province: MozambiqueProvince | null;
}

export interface Artist {
  id: string;
  name: string;
  email: string;
  bio?: string;
  phone?: string;
  monetizationPlanId?: string;
  profileImageUrl?: string;
  socialLinks?: SocialLinks;
  createdAt: string;
  verified: boolean;
  subscribers: number;
  province?: MozambiqueProvince;
  
  // Campos computados
  monetizationPlanName?: string;
  totalTracks?: number;
  totalAlbums?: number;
  totalStreams?: number;
  monthlyRevenue?: number;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  followersGrowth?: number;
}

export interface ArtistFormData {
  name: string;
  email: string;
  bio?: string;
  phone?: string;
  monetizationPlanId?: string;
  province?: MozambiqueProvince;
  verified: boolean;
  
  // Links sociais
  socialLinks: {
    instagram?: string;
    twitter?: string;
    website?: string;
    facebook?: string;
    youtube?: string;
    spotify?: string;
    soundcloud?: string;
  };
  
  // Arquivos para upload
  profileImage?: File;
  existingProfileImageUrl?: string;
}

export interface ArtistCreateData {
  name: string;
  email: string;
  bio?: string | null;
  phone?: string | null;
  monetization_plan_id?: string | null;
  profile_image_url?: string | null;
  social_links?: SocialLinks | null;
  verified?: boolean;
  subscribers?: number;
  province?: MozambiqueProvince | null;
}

export interface ArtistUpdateData {
  name?: string;
  email?: string;
  bio?: string | null;
  phone?: string | null;
  monetization_plan_id?: string | null;
  profile_image_url?: string | null;
  social_links?: SocialLinks | null;
  verified?: boolean;
  subscribers?: number;
  province?: MozambiqueProvince | null;
}

export interface ArtistFilters {
  verified?: boolean;
  hasMonetization?: boolean;
  province?: MozambiqueProvince;
  minSubscribers?: number;
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ArtistsResponse {
  data: Artist[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ArtistStats {
  totalArtists: number;
  verifiedArtists: number;
  artistsWithMonetization: number;
  newArtistsThisMonth: number;
  totalSubscribers: number;
  verificationRate: number;
  topProvince: {
    name: MozambiqueProvince;
    count: number;
  };
}

export interface MonetizationPlan {
  id: string;
  name: string;
  monetization_type: string;
  platform_fee: number;
  artist_share: number;
  description?: string;
  features: string[];
}

export type ArtistSortBy = 'name' | 'email' | 'created_at' | 'subscribers' | 'verified';
export type SortDirection = 'asc' | 'desc';

export function isValidArtist(obj: unknown): obj is Artist {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj &&
    'verified' in obj &&
    'subscribers' in obj &&
    typeof (obj as Record<string, unknown>).id === 'string' &&
    typeof (obj as Record<string, unknown>).name === 'string' &&
    typeof (obj as Record<string, unknown>).email === 'string' &&
    typeof (obj as Record<string, unknown>).verified === 'boolean' &&
    typeof (obj as Record<string, unknown>).subscribers === 'number'
  );
}

export function mapArtistFromDB(artistDB: ArtistDB): Artist {
  return {
    id: artistDB.id,
    name: artistDB.name,
    email: artistDB.email,
    bio: artistDB.bio || undefined,
    phone: artistDB.phone || undefined,
    monetizationPlanId: artistDB.monetization_plan_id || undefined,
    profileImageUrl: artistDB.profile_image_url || undefined,
    socialLinks: artistDB.social_links || undefined,
    createdAt: artistDB.created_at,
    verified: artistDB.verified,
    subscribers: artistDB.subscribers,
    province: artistDB.province || undefined,
  };
}

export function mapArtistToCreateData(formData: ArtistFormData): ArtistCreateData {
  return {
    name: formData.name,
    email: formData.email,
    bio: formData.bio || null,
    phone: formData.phone || null,
    monetization_plan_id: formData.monetizationPlanId || null,
    profile_image_url: formData.existingProfileImageUrl || null,
    social_links: Object.keys(formData.socialLinks).length > 0 ? formData.socialLinks : null,
    verified: formData.verified,
    subscribers: 0,
    province: formData.province || null,
  };
}

// Constantes úteis
export const MOZAMBIQUE_PROVINCES: MozambiqueProvince[] = [
  'Maputo Cidade',
  'Maputo',
  'Gaza',
  'Inhambane', 
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa'
];

export const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', placeholder: '@usuario' },
  { key: 'twitter', label: 'Twitter/X', placeholder: '@usuario' },
  { key: 'facebook', label: 'Facebook', placeholder: 'facebook.com/usuario' },
  { key: 'youtube', label: 'YouTube', placeholder: 'youtube.com/c/usuario' },
  { key: 'spotify', label: 'Spotify', placeholder: 'spotify.com/artist/...' },
  { key: 'soundcloud', label: 'SoundCloud', placeholder: 'soundcloud.com/usuario' },
  { key: 'website', label: 'Website', placeholder: 'https://seusite.com' },
] as const;

// Funções utilitárias
export function formatSubscribers(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export function validateSocialLink(platform: string, url: string): boolean {
  if (!url) return true; // Links opcionais
  
  const patterns: Record<string, RegExp> = {
    instagram: /^@?\w+$/,
    twitter: /^@?\w+$/,
    facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/,
    youtube: /^(https?:\/\/)?(www\.)?youtube\.com\/.+$/,
    spotify: /^(https?:\/\/)?(open\.)?spotify\.com\/.+$/,
    soundcloud: /^(https?:\/\/)?(www\.)?soundcloud\.com\/.+$/,
    website: /^https?:\/\/.+$/,
  };
  
  return patterns[platform]?.test(url) ?? true;
}