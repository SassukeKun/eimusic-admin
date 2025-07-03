import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from '@/config/supabase';

// Configurar o Cloudinary
cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
  secure: true
});

/**
 * Faz o upload de uma imagem para o Cloudinary
 * @param file Arquivo de imagem
 * @param folder Pasta no Cloudinary
 * @returns URL da imagem
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  try {
    // Converter o arquivo para base64
    const fileBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(fileBuffer).toString('base64');
    const fileUri = `data:${file.type};base64,${base64}`;
    
    // Fazer upload para o Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Erro ao fazer upload de imagem:', error);
    throw new Error('Falha ao fazer upload de imagem');
  }
}

/**
 * Resultado do upload de um vídeo
 */
export interface VideoUploadResult {
  videoUrl: string;
  thumbnailUrl: string;
}

/**
 * Faz o upload de um vídeo para o Cloudinary
 * @param file Arquivo de vídeo
 * @param folder Pasta no Cloudinary
 * @returns Objeto com URLs do vídeo e thumbnail
 */
export async function uploadVideo(file: File, folder: string): Promise<VideoUploadResult> {
  try {
    // Converter o arquivo para base64
    const fileBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(fileBuffer).toString('base64');
    const fileUri = `data:${file.type};base64,${base64}`;
    
    // Fazer upload para o Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: 'video',
      eager: [
        // Gerar thumbnail
        { format: 'jpg', transformation: [{ width: 640, crop: 'fill' }] },
        // Otimizar vídeo para streaming
        { format: 'mp4', transformation: [
          { quality: 'auto:good' },
          { streaming_profile: 'hd' }
        ]},
      ],
      eager_async: true,
      eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL,
    });
    
    return {
      videoUrl: result.secure_url,
      thumbnailUrl: result.eager?.[0]?.secure_url || result.secure_url.replace(/\.[^/.]+$/, '.jpg'),
    };
  } catch (error) {
    console.error('Erro ao fazer upload de vídeo:', error);
    throw new Error('Falha ao fazer upload de vídeo');
  }
}

/**
 * Exclui um arquivo do Cloudinary
 * @param publicId ID público do arquivo
 * @param resourceType Tipo de recurso ('image' ou 'video')
 */
export async function deleteCloudinaryFile(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Erro ao excluir arquivo do Cloudinary:', error);
    throw new Error('Falha ao excluir arquivo');
  }
} 