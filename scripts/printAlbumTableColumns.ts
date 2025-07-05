// scripts/printAlbumTableColumns.ts
// Script para imprimir as colunas da tabela 'albums' do banco de dados

import { getAlbumTableColumns } from '../utils/getAlbumTableColumns';

console.log('Colunas da tabela albums:');
getAlbumTableColumns().forEach(col => console.log(col));
