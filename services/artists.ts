// services/artists.ts - VERSÃO SEM CLOUDINARY (TEMPORÁRIA)
import { supabaseAdmin } from '@/lib/supabase';
// import { uploadImage } from '@/lib/cloudinary'; // TEMPORARIAMENTE DESABILITADO

/**
 * INTERFACE ARTIST - TIPAGEM FORTE E MODERNA
 * Baseada nos campos reais da tabela artists
 */
export interface Artist {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  phone?: string | null;
  monetization_plan_id?: string | null;
  profile_image_url?: string | null;
  social_links?: Record<string, string> | null;
  created_at: string;
}

/**
 * INTERFACE PARA FORMULÁRIO - TYPE SAFE
 */
export interface ArtistFormData {
  name: string;
  email: string;
  bio?: string | null;
  phone?: string | null;
  monetization_plan_id?: string | null;
  profile_image_url?: string | null;
  social_links?: Record<string, string> | null;
  profileImageFile?: File;
}

/**
 * UPLOAD TEMPORARIAMENTE DESABILITADO
 * Para evitar erro do Cloudinary no cliente
 */
const uploadImageTemporary = async (file: File, folder: string): Promise<string> => {
  console.log('📸 [Upload] Simulando upload para:', folder);
  console.log('📁 [Upload] Arquivo:', file.name);
  // Retorna URL de placeholder por enquanto
  return `https://via.placeholder.com/400x400?text=${encodeURIComponent(file.name)}`;
};

function isValidArtistData(data: unknown): data is Artist {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as Record<string, unknown>).id === 'string' &&
    typeof (data as Record<string, unknown>).name === 'string' &&
    typeof (data as Record<string, unknown>).email === 'string' &&
    typeof (data as Record<string, unknown>).created_at === 'string'
  );
}

/**
 * MAPEAMENTO TYPE-SAFE - SEM ANY!
 * Usa type guards para validação segura
 */
const mapArtistFromDB = (data: Record<string, unknown>): Artist => {
  if (!isValidArtistData(data)) {
    throw new Error('Dados de artista inválidos recebidos do banco');
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    bio: data.bio as string | null,
    phone: data.phone as string | null,
    monetization_plan_id: data.monetization_plan_id as string | null,
    profile_image_url: data.profile_image_url as string | null,
    social_links: data.social_links as Record<string, string> | null,
    created_at: data.created_at,
  };
};

/**
 * BUSCA TODOS OS ARTISTAS - TYPE SAFE
 */
export const fetchAllArtists = async (): Promise<Artist[]> => {
  try {
    console.log('🎤 [Artists Service] Buscando todos os artistas...');
    
    const { data, error } = await supabaseAdmin
      .from('artists')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('❌ [Artists Service] Erro na query:', error);
      throw error;
    }
    
    console.log(`✅ [Artists Service] ${data?.length || 0} artistas encontrados`);
    
    if (data && data.length > 0) {
      console.log('📋 [Artists Service] Primeiro artista:', data[0]);
    }
    
    return (data || []).map((item) => mapArtistFromDB(item as Record<string, unknown>));
  } catch (error) {
    console.error('❌ [Artists Service] Erro ao buscar artistas:', error);
    throw new Error('Falha ao buscar artistas');
  }
};

/**
 * BUSCA ARTISTA POR ID - TYPE SAFE
 */
export const fetchArtistById = async (id: string): Promise<Artist | null> => {
  try {
    console.log(`🎤 [Artists Service] Buscando artista ID: ${id}`);
    
    const { data, error } = await supabaseAdmin
      .from('artists')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`ℹ️ [Artists Service] Artista ${id} não encontrado`);
        return null;
      }
      console.error('❌ [Artists Service] Erro na query:', error);
      throw error;
    }
    
    console.log(`✅ [Artists Service] Artista ${id} encontrado:`, data.name);
    return data ? mapArtistFromDB(data as Record<string, unknown>) : null;
  } catch (error) {
    console.error(`❌ [Artists Service] Erro ao buscar artista ${id}:`, error);
    throw new Error('Falha ao buscar artista');
  }
};

/**
 * CRIA NOVO ARTISTA - TYPE SAFE
 */
export const createArtist = async (formData: ArtistFormData): Promise<Artist> => {
  try {
    console.log('➕ [Artists Service] Criando novo artista:', formData.name);
    
    let profileImageUrl: string | null = formData.profile_image_url || null;
    
    // Upload da imagem se fornecida (VERSÃO TEMPORÁRIA)
    if (formData.profileImageFile) {
      console.log('📸 [Artists Service] Fazendo upload da imagem...');
      profileImageUrl = await uploadImageTemporary(formData.profileImageFile, 'eimusic/artists');
      console.log('✅ [Artists Service] Imagem enviada:', profileImageUrl);
    }
    
    const now = new Date().toISOString();
    
    // Preparar dados com tipagem explícita
    const artistData: Record<string, string | null> = {
      name: formData.name,
      email: formData.email,
      bio: formData.bio || null,
      phone: formData.phone || null,
      monetization_plan_id: formData.monetization_plan_id || null,
      profile_image_url: profileImageUrl,
      social_links: formData.social_links ? JSON.stringify(formData.social_links) : null,
      created_at: now,
    };
    
    console.log('💾 [Artists Service] Dados para inserção:', artistData);
    
    // Inserir no banco
    const { data, error } = await supabaseAdmin
      .from('artists')
      .insert(artistData)
      .select('*')
      .single();
    
    if (error) {
      console.error('❌ [Artists Service] Erro ao inserir:', error);
      throw error;
    }
    
    console.log('✅ [Artists Service] Artista criado com sucesso:', data.id);
    return mapArtistFromDB(data as Record<string, unknown>);
  } catch (error) {
    console.error('❌ [Artists Service] Erro ao criar artista:', error);
    throw new Error('Falha ao criar artista');
  }
};

/**
 * ATUALIZA ARTISTA EXISTENTE - TYPE SAFE
 */
export const updateArtist = async (id: string, formData: ArtistFormData): Promise<Artist> => {
  try {
    console.log(`📝 [Artists Service] Atualizando artista ${id}:`, formData.name);
    
    let profileImageUrl: string | null = formData.profile_image_url || null;
    
    // Upload de nova imagem se fornecida (VERSÃO TEMPORÁRIA)
    if (formData.profileImageFile) {
      console.log('📸 [Artists Service] Fazendo upload da nova imagem...');
      profileImageUrl = await uploadImageTemporary(formData.profileImageFile, 'eimusic/artists');
      console.log('✅ [Artists Service] Nova imagem enviada:', profileImageUrl);
    }
    
    // Preparar dados com tipagem explícita
    const artistData: Record<string, string | null> = {
      name: formData.name,
      email: formData.email,
      bio: formData.bio || null,
      phone: formData.phone || null,
      monetization_plan_id: formData.monetization_plan_id || null,
      profile_image_url: profileImageUrl,
      social_links: formData.social_links ? JSON.stringify(formData.social_links) : null,
    };
    
    console.log('💾 [Artists Service] Dados para atualização:', artistData);
    
    // Atualizar no banco
    const { data, error } = await supabaseAdmin
      .from('artists')
      .update(artistData)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('❌ [Artists Service] Erro ao atualizar:', error);
      throw error;
    }
    
    console.log('✅ [Artists Service] Artista atualizado com sucesso');
    return mapArtistFromDB(data as Record<string, unknown>);
  } catch (error) {
    console.error(`❌ [Artists Service] Erro ao atualizar artista ${id}:`, error);
    throw new Error('Falha ao atualizar artista');
  }
};

/**
 * EXCLUI ARTISTA - TYPE SAFE
 */
export const deleteArtist = async (id: string): Promise<void> => {
  try {
    console.log(`🗑️ [Artists Service] Excluindo artista ${id}`);
    
    const { error } = await supabaseAdmin
      .from('artists')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ [Artists Service] Erro ao excluir:', error);
      throw error;
    }
    
    console.log('✅ [Artists Service] Artista excluído com sucesso');
  } catch (error) {
    console.error(`❌ [Artists Service] Erro ao excluir artista ${id}:`, error);
    throw new Error('Falha ao excluir artista');
  }
};