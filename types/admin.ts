// types/admin.ts
import type { 
  MonetizationPlan, 
  PaymentMethod, 
  ArtistStatus, 
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

// Artist types - ATUALIZADO com campos de pagamento
export interface Artist {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  genre: string;
  verified: boolean;
  joinedDate: string;
  totalTracks: number;
  totalRevenue: number;
  status: ArtistStatus;
  monetizationPlan: MonetizationPlan;
  // NOVOS CAMPOS DE PAGAMENTO
  paymentMethod?: PaymentMethod;
  phoneNumber?: string; // Para M-Pesa
  lastPaymentDate?: string;
  totalEarnings?: number; // Total ganho historicamente
}

// User types - ATUALIZADO com campos de pagamento  
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: MonetizationPlan;
  joinedDate: string;
  lastActive: string;
  totalSpent: number;
  status: ArtistStatus;
  // NOVOS CAMPOS DE PAGAMENTO
  paymentMethod?: PaymentMethod;
  phoneNumber?: string; // Para M-Pesa
  lastPaymentDate?: string;
  subscriptionStatus?: UserStatus;
}

// Content types
export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  duration: number;
  plays: number;
  revenue: number;
  uploadDate: string;
  status: 'published' | 'draft' | 'removed';
  coverArt?: string;
}

// Stats types
export interface DashboardStats {
  totalUsers: number;
  totalArtists: number;
  totalTracks: number;
  totalRevenue: number;
  monthlyGrowth: {
    users: number;
    artists: number;
    tracks: number;
    revenue: number;
  };
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