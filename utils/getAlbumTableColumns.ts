// utils/getAlbumTableColumns.ts
// Função utilitária para retornar as colunas da tabela 'albums' do banco de dados

export const getAlbumTableColumns = () => [
  'id',
  'title',
  'artist_id',
  'artist_name',
  'track_count',
  'total_duration',
  'plays',
  'revenue',
  'release_date',
  'status',
  'cover_art',
  'created_at',
  'updated_at',
];

// Exemplo de uso:
// const columns = getAlbumTableColumns();
// columns.forEach(col => console.log(col));
