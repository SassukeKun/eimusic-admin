// types/database.ts
import type { 
  MonetizationPlan, 
  PaymentMethod, 
  ArtistStatus, 
  UserStatus, 
  TransactionStatus,
  ContentStatus
} from './modal';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string;
          name: string;
          email: string;
          profile_image: string | null;
          genre: string;
          verified: boolean;
          joined_date: string;
          total_tracks: number;
          total_revenue: number;
          status: ArtistStatus;
          monetization_plan: MonetizationPlan;
          payment_method: PaymentMethod | null;
          phone_number: string | null;
          last_payment_date: string | null;
          total_earnings: number | null;
          bio: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          profile_image?: string | null;
          genre: string;
          verified?: boolean;
          joined_date?: string;
          total_tracks?: number;
          total_revenue?: number;
          status?: ArtistStatus;
          monetization_plan?: MonetizationPlan;
          payment_method?: PaymentMethod | null;
          phone_number?: string | null;
          last_payment_date?: string | null;
          total_earnings?: number | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          profile_image?: string | null;
          genre?: string;
          verified?: boolean;
          joined_date?: string;
          total_tracks?: number;
          total_revenue?: number;
          status?: ArtistStatus;
          monetization_plan?: MonetizationPlan;
          payment_method?: PaymentMethod | null;
          phone_number?: string | null;
          last_payment_date?: string | null;
          total_earnings?: number | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar: string | null;
          plan: MonetizationPlan;
          joined_date: string;
          last_active: string;
          total_spent: number;
          status: UserStatus;
          payment_method: PaymentMethod | null;
          phone_number: string | null;
          last_payment_date: string | null;
          subscription_status: UserStatus | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          avatar?: string | null;
          plan?: MonetizationPlan;
          joined_date?: string;
          last_active?: string;
          total_spent?: number;
          status?: UserStatus;
          payment_method?: PaymentMethod | null;
          phone_number?: string | null;
          last_payment_date?: string | null;
          subscription_status?: UserStatus | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar?: string | null;
          plan?: MonetizationPlan;
          joined_date?: string;
          last_active?: string;
          total_spent?: number;
          status?: UserStatus;
          payment_method?: PaymentMethod | null;
          phone_number?: string | null;
          last_payment_date?: string | null;
          subscription_status?: UserStatus | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      tracks: {
        Row: {
          id: string;
          title: string;
          artist_id: string;
          artist_name: string;
          duration: number;
          plays: number;
          revenue: number;
          upload_date: string;
          status: ContentStatus;
          cover_art: string | null;
          album_id: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          artist_id: string;
          artist_name: string;
          duration: number;
          plays?: number;
          revenue?: number;
          upload_date?: string;
          status?: ContentStatus;
          cover_art?: string | null;
          album_id?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          artist_id?: string;
          artist_name?: string;
          duration?: number;
          plays?: number;
          revenue?: number;
          upload_date?: string;
          status?: ContentStatus;
          cover_art?: string | null;
          album_id?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      albums: {
        Row: {
          id: string;
          title: string;
          artist_id: string;
          artist_name: string;
          track_count: number;
          total_duration: number;
          plays: number;
          revenue: number;
          release_date: string;
          status: ContentStatus;
          cover_art: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          artist_id: string;
          artist_name: string;
          track_count?: number;
          total_duration?: number;
          plays?: number;
          revenue?: number;
          release_date: string;
          status?: ContentStatus;
          cover_art?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          artist_id?: string;
          artist_name?: string;
          track_count?: number;
          total_duration?: number;
          plays?: number;
          revenue?: number;
          release_date?: string;
          status?: ContentStatus;
          cover_art?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      videos: {
        Row: {
          id: string;
          title: string;
          artist_id: string;
          artist_name: string;
          duration: number;
          views: number;
          revenue: number;
          upload_date: string;
          status: ContentStatus;
          thumbnail_url: string | null;
          video_url: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          artist_id: string;
          artist_name: string;
          duration: number;
          views?: number;
          revenue?: number;
          upload_date?: string;
          status?: ContentStatus;
          thumbnail_url?: string | null;
          video_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          artist_id?: string;
          artist_name?: string;
          duration?: number;
          views?: number;
          revenue?: number;
          upload_date?: string;
          status?: ContentStatus;
          thumbnail_url?: string | null;
          video_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      revenue_transactions: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          user_avatar: string | null;
          amount: number;
          type: 'subscription' | 'one_time' | 'refund';
          plan_id: string | null;
          plan_name: string | null;
          date: string;
          status: TransactionStatus;
          payment_method: PaymentMethod;
          phone_number: string | null;
          transaction_fee: number | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_name: string;
          user_avatar?: string | null;
          amount: number;
          type: 'subscription' | 'one_time' | 'refund';
          plan_id?: string | null;
          plan_name?: string | null;
          date: string;
          status: TransactionStatus;
          payment_method: PaymentMethod;
          phone_number?: string | null;
          transaction_fee?: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_name?: string;
          user_avatar?: string | null;
          amount?: number;
          type?: 'subscription' | 'one_time' | 'refund';
          plan_id?: string | null;
          plan_name?: string | null;
          date?: string;
          status?: TransactionStatus;
          payment_method?: PaymentMethod;
          phone_number?: string | null;
          transaction_fee?: number | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      monetization_plans: {
        Row: {
          id: string;
          name: string;
          price: number;
          subscribers: number;
          monthly_revenue: number;
          features: string[];
          status: 'active' | 'deprecated' | 'coming_soon';
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          subscribers?: number;
          monthly_revenue?: number;
          features: string[];
          status?: 'active' | 'deprecated' | 'coming_soon';
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          subscribers?: number;
          monthly_revenue?: number;
          features?: string[];
          status?: 'active' | 'deprecated' | 'coming_soon';
          created_at?: string;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 