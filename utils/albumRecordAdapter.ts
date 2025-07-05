// Utility to convert Album[] to Record<string, unknown>[] for DataTable
import { Album } from '@/types/admin';

// Adapta todos os campos do banco de dados para a tabela
export function albumsToRecords(albums: Album[]): Record<string, unknown>[] {
  return albums.map(album => ({
    id: album.id,
    title: album.title,
    artistId: album.artistId,
    artistName: album.artistName,
    trackCount: album.trackCount,
    totalDuration: album.totalDuration,
    plays: album.plays,
    revenue: album.revenue,
    releaseDate: album.releaseDate,
    status: album.status,
    coverArt: album.coverArt,
    createdAt: album.createdAt,
    updatedAt: album.updatedAt,
    description: album.description,
    tags: album.tags,
    visibility: album.visibility,
    isExplicit: album.isExplicit,
  }));
}
