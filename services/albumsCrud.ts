// services/albumsCrud.ts
// CRUD utilitário para a tabela 'albums' usando Supabase
import { supabaseAdmin } from '@/lib/supabase';
import { Album } from '@/types/admin';

// Tipagem explícita para o mapeamento
interface AlbumDB {
  id: string;
  title: string;
  artist_id: string;
  artist_name: string;
  track_count: number;
  total_duration: number;
  plays: number;
  revenue: number;
  release_date: string;
  status: string;
  cover_art?: string | null;
  created_at?: string;
  updated_at?: string;
  description?: string | null;
  tags?: string[] | null;
  visibility?: string | null;
  is_explicit?: boolean | null;
}

function mapAlbumFromDB(album: AlbumDB): Album {
  return {
    id: album.id,
    title: album.title,
    artistId: album.artist_id,
    artistName: album.artist_name,
    trackCount: album.track_count ?? 0,
    totalDuration: album.total_duration ?? 0,
    plays: album.plays ?? 0,
    revenue: album.revenue ?? 0,
    releaseDate: album.release_date ?? '',
    status: album.status as Album['status'],
    coverArt: album.cover_art ?? '',
    createdAt: album.created_at ?? '',
    updatedAt: album.updated_at ?? '',
    description: album.description ?? '',
    tags: album.tags ?? [],
    visibility: album.visibility ?? '',
    isExplicit: album.is_explicit ?? false,
  };
}

export async function getAllAlbums(): Promise<Album[]> {
  const { data, error } = await supabaseAdmin
    .from('albums')
    .select('*')
    .order('title');
  if (error) throw error;
  return (data || []).map(mapAlbumFromDB);
}

export async function getAlbumById(id: string): Promise<Album | null> {
  const { data, error } = await supabaseAdmin
    .from('albums')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data ? mapAlbumFromDB(data) : null;
}

export async function createAlbum(album: Omit<Album, 'id'>): Promise<Album> {
  // Adaptar para snake_case antes de inserir
  const dbAlbum = {
    title: album.title,
    artist_id: album.artistId,
    artist_name: album.artistName,
    track_count: album.trackCount ?? 0,
    total_duration: album.totalDuration ?? 0,
    plays: album.plays ?? 0,
    revenue: album.revenue ?? 0,
    release_date: album.releaseDate ?? '',
    status: album.status,
    cover_art: album.coverArt ?? '',
    created_at: album.createdAt ?? undefined,
    updated_at: album.updatedAt ?? undefined,
    description: album.description ?? undefined,
    tags: album.tags ?? undefined,
    visibility: album.visibility ?? undefined,
    is_explicit: album.isExplicit ?? undefined,
  };
  const { data, error } = await supabaseAdmin
    .from('albums')
    .insert(dbAlbum)
    .select()
    .single();
  if (error) throw error;
  return mapAlbumFromDB(data);
}

export async function updateAlbum(id: string, album: Partial<Album>): Promise<Album> {
  // Adaptar para snake_case antes de atualizar
  const dbAlbum: Partial<AlbumDB> = {};
  if (album.title !== undefined) dbAlbum.title = album.title;
  if (album.artistId !== undefined) dbAlbum.artist_id = album.artistId;
  if (album.artistName !== undefined) dbAlbum.artist_name = album.artistName;
  if (album.trackCount !== undefined) dbAlbum.track_count = album.trackCount;
  if (album.totalDuration !== undefined) dbAlbum.total_duration = album.totalDuration;
  if (album.plays !== undefined) dbAlbum.plays = album.plays;
  if (album.revenue !== undefined) dbAlbum.revenue = album.revenue;
  if (album.releaseDate !== undefined) dbAlbum.release_date = album.releaseDate;
  if (album.status !== undefined) dbAlbum.status = album.status;
  if (album.coverArt !== undefined) dbAlbum.cover_art = album.coverArt;
  if (album.createdAt !== undefined) dbAlbum.created_at = album.createdAt;
  if (album.updatedAt !== undefined) dbAlbum.updated_at = album.updatedAt;
  if (album.description !== undefined) dbAlbum.description = album.description;
  if (album.tags !== undefined) dbAlbum.tags = album.tags;
  if (album.visibility !== undefined) dbAlbum.visibility = album.visibility;
  if (album.isExplicit !== undefined) dbAlbum.is_explicit = album.isExplicit;

  const { data, error } = await supabaseAdmin
    .from('albums')
    .update(dbAlbum)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapAlbumFromDB(data);
}

export async function deleteAlbum(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('albums')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
