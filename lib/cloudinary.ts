// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload de imagem para o Cloudinary
 * @param file - Arquivo a ser enviado
 * @param folder - Pasta no Cloudinary (ex: 'eimusic/albums')
 * @returns URL da imagem uploadada
 */
export async function uploadImage(file: File, folder: string = 'eimusic'): Promise<string> {
  try {
    console.log('📤 Iniciando upload para Cloudinary...', { fileName: file.name, folder });
    
    // Converter File para base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    // Upload para Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 800, crop: 'fill', quality: 'auto' }, // Otimizar tamanho
      ],
    });
    
    console.log('✅ Upload concluído:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('❌ Erro no upload:', error);
    throw new Error('Falha no upload da imagem');
  }
}

/**
 * Deletar imagem do Cloudinary
 * @param publicId - ID público da imagem no Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log('🗑️ Imagem deletada:', publicId);
  } catch (error) {
    console.error('❌ Erro ao deletar imagem:', error);
    // Não fazer throw aqui para não quebrar o fluxo principal
  }
}

/**
 * Extrair public_id de uma URL do Cloudinary
 * @param url - URL da imagem
 * @returns Public ID ou null se não for URL do Cloudinary
 */
export function extractPublicId(url: string): string | null {
  const match = url.match(/\/([^\/]+)\/([^\/]+)\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)$/i);
  return match ? match[3] : null;
}