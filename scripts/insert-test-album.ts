import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';

async function main() {
  const { url: supabaseUrl, serviceKey } = supabaseConfig;
  if (!supabaseUrl || !serviceKey) {
    console.error('Supabase URL ou Service Key não configurados.');
    process.exit(1);
  }
  const supabase = createClient(supabaseUrl, serviceKey);

  // Buscar um artist_id válido
  const { data: artists, error: artistError } = await supabase.from('artists').select('id').limit(1);
  if (artistError || !artists || artists.length === 0) {
    console.error('Não foi possível encontrar um artist_id válido.');
    process.exit(1);
  }
  const artist_id = artists[0].id;
  console.log('Usando artist_id:', artist_id);

  // Inserir álbum de teste
  const album = {
    id: uuidv4(),
    title: 'Álbum de Teste',
    artist_id,
    release_date: '2024-01-01',
    cover_url: 'https://placehold.co/300x300',
    genre: 'Pop',
  };

  const { data, error } = await supabase.from('albums').insert([album]).select();
  if (error) {
    console.error('Erro ao inserir álbum:', error.message);
  } else {
    console.log('Álbum inserido com sucesso:', data);
  }
}

main();
