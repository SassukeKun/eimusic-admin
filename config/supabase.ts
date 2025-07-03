/**
 * Configurações do Supabase
 */
export const supabaseConfig = {
  /**
   * URL da API do Supabase
   * Deve ser definida como variável de ambiente NEXT_PUBLIC_SUPABASE_URL
   */
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  
  /**
   * Chave anônima do Supabase (permissões limitadas)
   * Deve ser definida como variável de ambiente NEXT_PUBLIC_SUPABASE_ANON_KEY
   */
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  
  /**
   * Chave de serviço do Supabase (permissões administrativas)
   * Deve ser definida como variável de ambiente SUPABASE_SERVICE_ROLE_KEY
   * ATENÇÃO: Esta chave deve ser mantida em segredo e usada apenas no servidor
   */
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};

/**
 * Configurações do Cloudinary
 */
export const cloudinaryConfig = {
  /**
   * Nome da cloud do Cloudinary
   * Deve ser definida como variável de ambiente NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   */
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  
  /**
   * Chave da API do Cloudinary
   * Deve ser definida como variável de ambiente CLOUDINARY_API_KEY
   */
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  
  /**
   * Segredo da API do Cloudinary
   * Deve ser definida como variável de ambiente CLOUDINARY_API_SECRET
   * ATENÇÃO: Este segredo deve ser mantido em segredo e usado apenas no servidor
   */
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
}; 