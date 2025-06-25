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

// Artist types
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
  status: 'active' | 'inactive' | 'suspended';
  monetizationPlan: 'basic' | 'premium' | 'enterprise';
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'premium';
  joinedDate: string;
  lastActive: string;
  totalSpent: number;
  status: 'active' | 'inactive' | 'suspended';
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

// Table types - CORRIGIDO AQUI
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