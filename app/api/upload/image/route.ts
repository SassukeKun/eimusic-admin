// app/api/upload/image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Recebendo upload de imagem...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'eimusic';
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Arquivo deve ser uma imagem' },
        { status: 400 }
      );
    }
    
    // Validar tamanho (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 10MB.' },
        { status: 400 }
      );
    }
    
    // Upload para Cloudinary
    const imageUrl = await uploadImage(file, folder);
    
    return NextResponse.json({
      success: true,
      url: imageUrl,
      message: 'Upload realizado com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro na API de upload:', error);
    return NextResponse.json(
      { error: 'Falha no upload da imagem' },
      { status: 500 }
    );
  }
}