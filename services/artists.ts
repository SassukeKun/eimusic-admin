import { supabaseAdmin } from '@/lib/supabase';
import { uploadImage } from '@/lib/cloudinary';
import type { Artist } from '@/types/admin';
import type { ArtistFormData } from '@/types/modal';
import type { Database } from '@/types/database';

type ArtistRow = Database['public']['Tables']['artists']['Row'];
type ArtistInsert = Database['public']['Tables']['artists']['Insert'];
type ArtistUpdate = Database['public']['Tables']['artists']['Update'];

/**
 * Converte um registro do banco de dados para o formato da aplicação
 */
const mapArtistFromDB = (artist: ArtistRow): Artist => ({
  id: artist.id,
  name: artist.name,
  email: artist.email,
  profileImage: artist.profile_image || undefined,
  genre: artist.genre,
  verified: artist.verified,
  joinedDate: artist.joined_date,
  totalTracks: artist.total_tracks,
  totalRevenue: artist.total_revenue,
  status: artist.status,
  monetizationPlan: artist.monetization_plan,
  paymentMethod: artist.payment_method || undefined,
  phoneNumber: artist.phone_number || undefined,
  lastPaymentDate: artist.last_payment_date || undefined,
  totalEarnings: artist.total_earnings || undefined,
});

/**
 * Busca todos os artistas
 */
export const fetchAllArtists = async (): Promise<Artist[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('artists')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return (data || []).map(mapArtistFromDB);
  } catch (error) {
    console.error('Erro ao buscar artistas:', error);
    throw new Error('Falha ao buscar artistas');
  }
};

/**
 * Busca um artista pelo ID
 */
export const fetchArtistById = async (id: string): Promise<Artist | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('artists')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Não encontrado
      throw error;
    }
    
    return data ? mapArtistFromDB(data) : null;
  } catch (error) {
    console.error(`Erro ao buscar artista ${id}:`, error);
    throw new Error('Falha ao buscar artista');
  }
};

/**
 * Cria um novo artista
 */
export const createArtist = async (formData: ArtistFormData): Promise<Artist> => {
  try {
    let profileImageUrl: string | undefined = undefined;
    
    // Se houver um arquivo de imagem, fazer upload para o Cloudinary
    if (formData.coverFile) {
      profileImageUrl = await uploadImage(formData.coverFile, 'eimusic/artists');
    }
    
    const now = new Date().toISOString();
    
    // Preparar dados para inserção
    const artistData: ArtistInsert = {
      name: formData.name,
      email: formData.email,
      profile_image: profileImageUrl || null,
      genre: formData.genre,
      verified: formData.verified,
      joined_date: now,
      total_tracks: 0,
      total_revenue: 0,
      status: formData.isActive ? 'active' : 'inactive',
      monetization_plan: formData.monetizationPlan,
      payment_method: formData.paymentMethod || null,
      phone_number: formData.phoneNumber || null,
      bio: formData.bio || null,
      created_at: now,
    };
    
    // Inserir no banco de dados
    const { data, error } = await supabaseAdmin
      .from('artists')
      .insert(artistData)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Nenhum dado retornado após a inserção');
    
    return mapArtistFromDB(data);
  } catch (error) {
    console.error('Erro ao criar artista:', error);
    throw new Error('Falha ao criar artista');
  }
};

/**
 * Atualiza um artista existente
 */
export const updateArtist = async (id: string, formData: ArtistFormData): Promise<Artist> => {
  try {
    let profileImageUrl: string | undefined = undefined;
    
    // Se houver um arquivo de imagem, fazer upload para o Cloudinary
    if (formData.coverFile) {
      profileImageUrl = await uploadImage(formData.coverFile, 'eimusic/artists');
    }
    
    // Preparar dados para atualização
    const artistData: ArtistUpdate = {
      name: formData.name,
      email: formData.email,
      profile_image: profileImageUrl || undefined,
      genre: formData.genre,
      verified: formData.verified,
      status: formData.isActive ? 'active' : 'inactive',
      monetization_plan: formData.monetizationPlan,
      payment_method: formData.paymentMethod || null,
      phone_number: formData.phoneNumber || null,
      bio: formData.bio || null,
      updated_at: new Date().toISOString(),
    };
    
    // Atualizar no banco de dados
    const { data, error } = await supabaseAdmin
      .from('artists')
      .update(artistData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Nenhum dado retornado após a atualização');
    
    return mapArtistFromDB(data);
  } catch (error) {
    console.error(`Erro ao atualizar artista ${id}:`, error);
    throw new Error('Falha ao atualizar artista');
  }
};

/**
 * Exclui um artista
 */
export const deleteArtist = async (id: string): Promise<void> => {
  try {
    const { error } = await supabaseAdmin
      .from('artists')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Erro ao excluir artista ${id}:`, error);
    throw new Error('Falha ao excluir artista');
  }
};

/**
 * Busca artistas com filtros
 */
export const fetchArtistsWithFilters = async (
  filters: Record<string, string>,
  searchQuery?: string
): Promise<Artist[]> => {
  try {
    let query = supabaseAdmin.from('artists').select('*');
    
    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'verified') {
          const isVerified = value === 'verified';
          query = query.eq('verified', isVerified);
        } else {
          query = query.eq(key, value);
        }
      }
    });
    
    // Aplicar pesquisa
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,genre.ilike.%${searchQuery}%`);
    }
    
    // Ordenar por nome
    query = query.order('name');
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(mapArtistFromDB);
  } catch (error) {
    console.error('Erro ao buscar artistas com filtros:', error);
    throw new Error('Falha ao buscar artistas');
  }
}; 