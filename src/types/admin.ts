/**
 * Types específicos para o painel administrativo EiMusic
 * Tipagem forte obrigatória - ZERO any permitido
 */

import type { 
  MozambicanCity, 
  MozambicanGenre, 
  UserStatus, 
  ArtistStatus, 
  ContentStatus, 
  UserPlan, 
  PaymentMethod 
} from '@/data/constants';

// Re-exportar types de constants para uso em outros arquivos
export type { UserStatus, ArtistStatus, ContentStatus, UserPlan, PaymentMethod, MozambicanCity, MozambicanGenre };

// Usuário do sistema (consumidor de conteúdo)
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: UserPlan;
  status: UserStatus;
  registeredAt: string;
  lastActivity: string;
  totalSpent: number; // em MT (Meticais)
  location: MozambicanCity;
  preferredPayment: PaymentMethod;
  profileImage?: string;
  isSubscriptionActive: boolean;
  subscriptionEndDate?: string;
}

// Artista no sistema
export interface AdminArtist {
  id: string;
  name: string;
  email: string;
  phone: string;
  artisticName: string;
  status: ArtistStatus;
  genres: MozambicanGenre[];
  totalTracks: number;
  followers: number;
  revenue: number; // em MT (Meticais)
  location: MozambicanCity;
  verificationBadge: boolean;
  featuredArtist: boolean;
  joinedAt: string;
  lastUpload: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  profileImage?: string;
  biography?: string;
}

// Conteúdo audiovisual
export interface AdminContent {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  genre: MozambicanGenre;
  duration: number; // em segundos
  status: ContentStatus;
  uploadedAt: string;
  approvedAt?: string;
  plays: number;
  likes: number;
  downloads: number;
  revenue: number; // em MT
  coverImage?: string;
  audioUrl?: string;
  videoUrl?: string;
  isExplicit: boolean;
  tags: string[];
}

// Estatísticas do dashboard
export interface DashboardStats {
  totalUsers: number;
  totalArtists: number;
  totalContent: number;
  monthlyRevenue: number; // em MT
  pendingApprovals: number;
  newUsersThisMonth: number;
  newArtistsThisMonth: number;
  activeUsersToday: number;
  topGenre: MozambicanGenre;
  topCity: MozambicanCity;
}

// Atividade recente no sistema
export interface RecentActivity {
  id: string;
  type: 'user_registered' | 'artist_approved' | 'content_uploaded' | 'subscription_purchased' | 'content_approved';
  description: string;
  userName: string;
  userImage?: string;
  timestamp: string;
  amount?: number; // em MT, se aplicável
  status: 'success' | 'pending' | 'warning';
}

// Filtros para listagens
export interface UserFilters {
  status?: UserStatus;
  plan?: UserPlan;
  location?: MozambicanCity;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ArtistFilters {
  status?: ArtistStatus;
  genre?: MozambicanGenre;
  location?: MozambicanCity;
  verified?: boolean;
  featured?: boolean;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ContentFilters {
  status?: ContentStatus;
  genre?: MozambicanGenre;
  artistId?: string;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Dados para gráficos
export interface ChartData {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface TimeSeriesData {
  date: string;
  users: number;
  artists: number;
  revenue: number;
  content: number;
}

// Analytics por localização
export interface LocationAnalytics {
  city: MozambicanCity;
  users: number;
  artists: number;
  revenue: number;
  percentage: number;
  growth: number; // percentual de crescimento
}

// Analytics por gênero musical
export interface GenreAnalytics {
  genre: MozambicanGenre;
  tracks: number;
  plays: number;
  revenue: number;
  percentage: number;
  trending: boolean;
}

// Ação administrativa
export interface AdminAction {
  id: string;
  type: 'approve' | 'block' | 'verify' | 'feature' | 'delete' | 'edit';
  targetType: 'user' | 'artist' | 'content';
  targetId: string;
  adminId: string;
  adminName: string;
  reason?: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

// Notificação do admin
export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  actionLabel?: string;
}

// Estado global do admin
export interface AdminState {
  currentAdmin: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'super_admin';
    avatar?: string;
  } | null;
  stats: DashboardStats;
  notifications: AdminNotification[];
  isLoading: boolean;
  error: string | null;
}