import { NextResponse } from 'next/server';
import { fetchArtistById, updateArtist, deleteArtist } from '@/services/artists';
import type { ArtistFormData } from '@/types/modal';

/**
 * GET /api/artists/[id]
 * Busca um artista pelo ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const artist = await fetchArtistById(id);
    
    if (!artist) {
      return NextResponse.json(
        { error: 'Artista não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(artist);
  } catch (error) {
    console.error(`Erro ao buscar artista ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao buscar artista' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/artists/[id]
 * Atualiza um artista
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const formData = await request.json() as ArtistFormData;
    
    // Verificar se o artista existe
    const existingArtist = await fetchArtistById(id);
    
    if (!existingArtist) {
      return NextResponse.json(
        { error: 'Artista não encontrado' },
        { status: 404 }
      );
    }
    
    // Atualizar o artista
    const updatedArtist = await updateArtist(id, formData);
    
    return NextResponse.json(updatedArtist);
  } catch (error) {
    console.error(`Erro ao atualizar artista ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao atualizar artista' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/artists/[id]
 * Exclui um artista
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Verificar se o artista existe
    const existingArtist = await fetchArtistById(id);
    
    if (!existingArtist) {
      return NextResponse.json(
        { error: 'Artista não encontrado' },
        { status: 404 }
      );
    }
    
    // Excluir o artista
    await deleteArtist(id);
    
    return NextResponse.json(
      { message: 'Artista excluído com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Erro ao excluir artista ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Falha ao excluir artista' },
      { status: 500 }
    );
  }
} 