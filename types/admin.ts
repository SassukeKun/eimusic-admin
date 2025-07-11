// types/admin.ts
import type { 
  MonetizationPlan, 
  PaymentMethod, 
  UserStatus, 
  TransactionStatus 
} from './modal';

// Navigation types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  subItems?: NavItem[];
}

// User types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  avatar?: string;
  lastLogin: string;
}


export interface Artist {
  id: string;
  name: string;
  email: string;
  bio?: string;                     // Campo opcional na tabela
  phone?: string;                   // Campo opcional (mantido para histórico)
  monetizationPlanId?: string;      // monetization_plan_id
  profileImageUrl?: string;         // profile_image_url
  socialLinks?: {                   // social_links (JSON field)
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    spotify?: string;
    website?: string;
  };
  createdAt: string;               // created_at
  
  // Campos calculados/derivados (não existem na tabela real)
  // Podem vir de JOINs ou cálculos agregados futuros
  totalTracks?: number;
  totalRevenue?: number;
  status?: 'active' | 'pending' | 'inactive';
}


export interface ArtistFormData {
  name: string;                     // Campo obrigatório
  email: string;                    // Campo obrigatório
  bio?: string;                     // Campo opcional
  phone?: string;                   // Campo opcional (para histórico)
  monetizationPlanId?: string;      // monetization_plan_id
  profileImageUrl?: string;         // profile_image_url atual
  socialLinks?: {                   // social_links (JSON)
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    spotify?: string;
    website?: string;
  };
  
  // Campo para upload de nova imagem
  profileImageFile?: File;
}

// types/database.ts - SEÇÃO ARTISTS CORRIGIDA COMPLETAMENTE
export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string;
          name: string;
          email: string;
          bio: string | null;
          phone: string | null;
          monetization_plan_id: string | null;
          profile_image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          bio?: string | null;
          phone?: string | null;
          monetization_plan_id?: string | null;
          profile_image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          bio?: string | null;
          phone?: string | null;
          monetization_plan_id?: string | null;
          profile_image_url?: string | null;
          created_at?: string;
        };
      };
      // ... outras tabelas permanecem iguais
    };
  };
}

// User types - ATUALIZADO com campos de pagamento  
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'artist' | 'user';
  status: 'active' | 'pending' | 'banned';
  createdAt: string;
  lastLogin?: string;
  avatarUrl?: string;
  country?: string;
  city?: string;
  phone?: string;
  avatar?: string;
  plan: MonetizationPlan;
  joinedDate: string;
  lastActive: string;
  totalSpent: number;
  subscriptionStatus?: UserStatus;
  // NOVOS CAMPOS DE PAGAMENTO
  paymentMethod?: PaymentMethod;
  phoneNumber?: string; // Para M-Pesa
  lastPaymentDate?: string;
}

// Content types
export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId?: string;
  albumTitle?: string;
  duration: number;
  plays: number;
  revenue: number;
  releaseDate: string;
  status: 'published' | 'draft' | 'removed';
  coverArt?: string;
  audioUrl?: string;
  genre?: string;
  isrc?: string;
  lyrics?: string;
}

// Stats types
export interface DashboardStats {
  totalUsers: number;
  totalArtists: number;
  totalTracks: number;
  totalAlbums: number;
  totalVideos: number;
  totalPlays: number;
  totalRevenue: number;
  monthlyGrowth: {
    users: number;
    artists: number;
    tracks: number;
    revenue: number;
  };
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  duration: number; // em segundos
  thumbnailUrl?: string;
  videoUrl: string;
  artist_id: string;
  artistName: string; // Campo calculado/joined
  uploadDate: string;
  views: number;
  status: 'published' | 'draft' | 'removed';
  created_at: string;
  updated_at: string;
}







// Table types
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onSort?: (key: keyof T) => void;
  onRowClick?: (item: T) => void;
}

// Filter types
export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'search' | 'date' | 'range';
  options?: FilterOption[];
}

// Interface para planos de monetização
export interface MonetizationPlanInfo {
  id: string;
  name: string;
  price: number; // Valor em MT
  subscribers: number;
  monthlyRevenue: number; // Valor em MT
  features: string[];
  status: 'active' | 'deprecated' | 'coming_soon';
}

// Interface para transações de receita - ATUALIZADA
export interface RevenueTransaction {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  amount: number; // Valor em MT
  type: 'subscription' | 'one_time' | 'refund';
  planId?: string;
  planName?: string;
  date: string;
  status: TransactionStatus;
  // NOVOS CAMPOS DE PAGAMENTO
  paymentMethod: PaymentMethod;
  phoneNumber?: string; // Para M-Pesa
  transactionFee?: number; // Taxa cobrada em MT
}

// Album types
export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  trackCount: number;
  totalDuration: number;
  plays: number;
  revenue: number;
  releaseDate: string;
  status: 'published' | 'draft' | 'removed';
  coverArt?: string;
  // Extra fields from DB
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  tags?: string[];
  visibility?: string;
  isExplicit?: boolean;
}

// Video types
export interface Video {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  duration: number;
  views: number;
  revenue: number;
  uploadDate: string;
  status: 'published' | 'draft' | 'removed';
  thumbnailUrl?: string;
}

// Settings types
export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  defaultLanguage: string;
  defaultCurrency: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  newArtistAlert: boolean;
  newContentAlert: boolean;
  revenueReports: boolean;
  systemUpdates: boolean;
  loginAlerts: boolean;
}

export interface MonetizationSettings {
  defaultCommissionRate: number; // porcentagem
  minimumPayoutAmount: number; // em MT
  payoutSchedule: 'weekly' | 'biweekly' | 'monthly';
  allowMicroDonations: boolean;
  allowSubscriptions: boolean;
}

export interface InterfaceSettings {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  itemsPerPage: number;
  enableAnimations: boolean;
  dashboardLayout: 'compact' | 'standard' | 'detailed';
}

/**
 * Representa uma estatística de análise
 */
export interface AnalyticsStat {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

/**
 * Representa um ponto de dados para gráficos
 */
export interface DataPoint {
  date: string;
  value: number;
}

/**
 * Representa uma série de dados para gráficos
 */
export interface DataSeries {
  name: string;
  data: DataPoint[];
}

/**
 * Representa dados de monetização
 */
export interface MonetizationData {
  totalRevenue: number;
  pendingPayouts: number;
  completedPayouts: number;
  revenueByPlatform: {
    platform: string;
    amount: number;
    percentage: number;
  }[];
  revenueHistory: DataPoint[];
}

/**
 * Representa um pagamento
 */
export interface Payment {
  id: string;
  artistId: string;
  artistName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  method: string;
  reference?: string;
}