// types/users.ts
export interface UserDB {
    id: string;
    name: string;
    email: string;
    payment_method: string | null;
    has_active_subscription: boolean;
    created_at: string;
    profile_image_url: string | null;
    subscription_plan_id: string | null;
    is_admin: boolean;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    paymentMethod?: string;
    hasActiveSubscription: boolean;
    createdAt: string;
    profileImageUrl?: string;
    subscriptionPlanId?: string;
    isAdmin: boolean;
    
    subscriptionPlanName?: string;
    totalPlaylists?: number;
    totalFavorites?: number;
    lastLogin?: string;
    accountStatus?: 'active' | 'suspended' | 'pending';
  }
  
  export interface UserFormData {
    name: string;
    email: string;
    paymentMethod?: string;
    hasActiveSubscription: boolean;
    subscriptionPlanId?: string;
    isAdmin: boolean;
    profileImage?: File;
    existingProfileImageUrl?: string;
  }
  
  export interface UserCreateData {
    name: string;
    email: string;
    payment_method?: string | null;
    has_active_subscription?: boolean;
    profile_image_url?: string | null;
    subscription_plan_id?: string | null;
    is_admin?: boolean;
  }
  
  export interface UserUpdateData {
    name?: string;
    email?: string;
    payment_method?: string | null;
    has_active_subscription?: boolean;
    profile_image_url?: string | null;
    subscription_plan_id?: string | null;
    is_admin?: boolean;
  }
  
  export interface UserFilters {
    hasSubscription?: boolean;
    isAdmin?: boolean;
    subscriptionPlanId?: string;
    searchQuery?: string;
    dateFrom?: string;
    dateTo?: string;
  }
  
  export interface UsersResponse {
    data: User[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }
  
  export interface UserStats {
    totalUsers: number;
    activeSubscriptions: number;
    adminUsers: number;
    newUsersThisMonth: number;
    subscriptionRate: number;
  }
  
  export type UserSortBy = 'name' | 'email' | 'created_at' | 'has_active_subscription';
  export type SortDirection = 'asc' | 'desc';
  
  export function isValidUser(obj: unknown): obj is User {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'id' in obj &&
      'name' in obj &&
      'email' in obj &&
      'isAdmin' in obj &&
      typeof (obj as Record<string, unknown>).id === 'string' &&
      typeof (obj as Record<string, unknown>).name === 'string' &&
      typeof (obj as Record<string, unknown>).email === 'string' &&
      typeof (obj as Record<string, unknown>).isAdmin === 'boolean'
    );
  }
  
  export function mapUserFromDB(userDB: UserDB): User {
    return {
      id: userDB.id,
      name: userDB.name,
      email: userDB.email,
      paymentMethod: userDB.payment_method || undefined,
      hasActiveSubscription: userDB.has_active_subscription,
      createdAt: userDB.created_at,
      profileImageUrl: userDB.profile_image_url || undefined,
      subscriptionPlanId: userDB.subscription_plan_id || undefined,
      isAdmin: userDB.is_admin,
    };
  }