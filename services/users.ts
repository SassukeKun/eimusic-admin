import { supabaseAdmin } from '@/lib/supabase';
import { uploadImage } from '@/lib/cloudinary';
import type { User } from '@/types/admin';
import type { UserFormData } from '@/types/modal';
import type { Database } from '@/types/database';

type UserRow = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

/**
 * Converte um registro do banco de dados para o formato da aplicação
 */
const mapUserFromDB = (user: UserRow): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar || undefined,
  plan: user.plan,
  joinedDate: user.joined_date,
  lastActive: user.last_active,
  totalSpent: user.total_spent,
  status: user.status,
  paymentMethod: user.payment_method || undefined,
  phoneNumber: user.phone_number || undefined,
  lastPaymentDate: user.last_payment_date || undefined,
  subscriptionStatus: user.subscription_status || undefined,
});

/**
 * Busca todos os usuários
 */
export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return (data || []).map(mapUserFromDB);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error('Falha ao buscar usuários');
  }
};

/**
 * Busca um usuário pelo ID
 */
export const fetchUserById = async (id: string): Promise<User | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Não encontrado
      throw error;
    }
    
    return data ? mapUserFromDB(data) : null;
  } catch (error) {
    console.error(`Erro ao buscar usuário ${id}:`, error);
    throw new Error('Falha ao buscar usuário');
  }
};

/**
 * Cria um novo usuário
 */
export const createUser = async (formData: UserFormData): Promise<User> => {
  try {
    let avatarUrl: string | undefined = undefined;
    
    // Se houver um arquivo de avatar, fazer upload para o Cloudinary
    if ('avatarFile' in formData && formData.avatarFile instanceof File) {
      avatarUrl = await uploadImage(formData.avatarFile, 'eimusic/users');
    }
    
    const now = new Date().toISOString();
    
    // Preparar dados para inserção
    const userData: UserInsert = {
      name: formData.name,
      email: formData.email,
      avatar: avatarUrl || null,
      plan: formData.plan,
      joined_date: now,
      last_active: now,
      total_spent: 0,
      status: formData.isActive ? 'active' : 'expired',
      payment_method: formData.paymentMethod || null,
      phone_number: formData.phoneNumber || null,
      subscription_status: formData.status || null,
      created_at: now,
    };
    
    // Inserir no banco de dados
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Nenhum dado retornado após a inserção');
    
    return mapUserFromDB(data);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw new Error('Falha ao criar usuário');
  }
};

/**
 * Atualiza um usuário existente
 */
export const updateUser = async (id: string, formData: UserFormData): Promise<User> => {
  try {
    let avatarUrl: string | undefined = undefined;
    
    // Se houver um arquivo de avatar, fazer upload para o Cloudinary
    if ('avatarFile' in formData && formData.avatarFile instanceof File) {
      avatarUrl = await uploadImage(formData.avatarFile, 'eimusic/users');
    }
    
    // Preparar dados para atualização
    const userData: UserUpdate = {
      name: formData.name,
      email: formData.email,
      avatar: avatarUrl || undefined,
      plan: formData.plan,
      status: formData.isActive ? 'active' : 'expired',
      payment_method: formData.paymentMethod || null,
      phone_number: formData.phoneNumber || null,
      subscription_status: formData.status || null,
      updated_at: new Date().toISOString(),
    };
    
    // Atualizar no banco de dados
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Nenhum dado retornado após a atualização');
    
    return mapUserFromDB(data);
  } catch (error) {
    console.error(`Erro ao atualizar usuário ${id}:`, error);
    throw new Error('Falha ao atualizar usuário');
  }
};

/**
 * Exclui um usuário
 */
export const deleteUser = async (id: string): Promise<void> => {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Erro ao excluir usuário ${id}:`, error);
    throw new Error('Falha ao excluir usuário');
  }
};

/**
 * Busca usuários com filtros
 */
export const fetchUsersWithFilters = async (
  filters: Record<string, string>,
  searchQuery?: string
): Promise<User[]> => {
  try {
    let query = supabaseAdmin.from('users').select('*');
    
    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query = query.eq(key, value);
      }
    });
    
    // Aplicar pesquisa
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
    }
    
    // Ordenar por nome
    query = query.order('name');
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(mapUserFromDB);
  } catch (error) {
    console.error('Erro ao buscar usuários com filtros:', error);
    throw new Error('Falha ao buscar usuários');
  }
}; 