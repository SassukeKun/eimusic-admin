// services/albumsCrud.ts
// CRUD utilitário para a tabela 'albums' usando Supabase
import { supabaseAdmin } from '@/lib/supabase';
import { Album } from '@/types/admin';

// ✅ CORRIGIDO: Interface baseada nos campos reais do banco
interface AlbumDB {
  id: string;
  title: string;
  description?: string | null;
  cover_url?: string | null;
  artist_id: string;
  artist_name: string;
  track_count?: number | null;
  release_date: string;
  created_at?: string;
  updated_at?: string;
  genre?: string | null;
  is_explicit?: boolean | null;
  tags?: string[] | null;
  visibility?: string | null;
}

// ✅ CORRIGIDO: Mapeamento usando campos reais
function mapAlbumFromDB(album: AlbumDB): Album {
  return {
    id: album.id,
    title: album.title,
    artistId: album.artist_id,
    artistName: album.artist_name,
    trackCount: album.track_count ?? 0,
    totalDuration: 0, // Valor padrão - campo não existe no banco
    plays: 0, // Valor padrão - campo não existe no banco
    revenue: 0, // Valor padrão - campo não existe no banco
    releaseDate: album.release_date ?? '',
    status: 'published', // Valor padrão - campo não existe no banco
    coverArt: album.cover_url ?? '', // ✅ CORRIGIDO: usar cover_url
    createdAt: album.created_at ?? '',
    updatedAt: album.updated_at ?? '',
    description: album.description ?? '',
    tags: album.tags ?? [],
    visibility: album.visibility ?? '',
    isExplicit: album.is_explicit ?? false,
  };
}

// ✅ MANTIDO: Função de buscar todos os álbuns
export async function getAllAlbums(): Promise<Album[]> {
  const { data, error } = await supabaseAdmin
    .from('albums')
    .select('*')
    .order('title');
  if (error) throw error;
  return (data || []).map(mapAlbumFromDB);
}

// ✅ MANTIDO: Função de buscar álbum por ID
export async function getAlbumById(id: string): Promise<Album | null> {
  const { data, error } = await supabaseAdmin
    .from('albums')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data ? mapAlbumFromDB(data) : null;
}

// ✅ CORRIGIDO: Função de criar álbum usando campos reais
export async function createAlbum(album: Omit<Album, 'id'>): Promise<Album> {
  const dbAlbum = {
    title: album.title,
    description: album.description ?? null,
    cover_url: album.coverArt ?? null,
    artist_id: album.artistId,
    artist_name: album.artistName,
    track_count: album.trackCount ?? 0,
    release_date: album.releaseDate ?? new Date().toISOString(),
    is_explicit: album.isExplicit ?? false,
    tags: album.tags ?? null,
    visibility: album.visibility ?? 'public',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
  try {
    console.log('🔍 Dados recebidos para atualização:', album);
    
    const dbAlbum: Partial<AlbumDB> = {};
    
    // ✅ CORRIGIDO: Mapear apenas campos que existem no banco
    if (album.title !== undefined) dbAlbum.title = album.title;
    if (album.description !== undefined) dbAlbum.description = album.description;
    if (album.artistName !== undefined) dbAlbum.artist_name = album.artistName;
    if (album.trackCount !== undefined) dbAlbum.track_count = album.trackCount;
    if (album.releaseDate !== undefined) dbAlbum.release_date = album.releaseDate;
    if (album.isExplicit !== undefined) dbAlbum.is_explicit = album.isExplicit;
    if (album.tags !== undefined) dbAlbum.tags = album.tags;
    if (album.visibility !== undefined) dbAlbum.visibility = album.visibility;
    
    // ✅ Sempre atualizar updated_at
    dbAlbum.updated_at = new Date().toISOString();

    console.log('📝 Dados formatados para o banco:', dbAlbum);
    console.log('🎯 ID do álbum:', id);

    const { data, error } = await supabaseAdmin
      .from('albums')
      .update(dbAlbum)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('❌ Erro detalhado do Supabase:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    console.log('✅ Atualização bem-sucedida:', data);
    return mapAlbumFromDB(data);
  } catch (error) {
    console.error(`❌ Erro ao atualizar álbum ${id}:`, error);
    throw new Error('Falha ao atualizar álbum');
  }
}

// ✅ MANTIDO: Função de deletar álbum
export async function deleteAlbum(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('albums')
    .delete()
    .eq('id', id);
  if (error) throw error;
}