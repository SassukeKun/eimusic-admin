// scripts/create-test-user.ts
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabase';


async function main() {
  // Obter configurações
  const { url: supabaseUrl, serviceKey: supabaseServiceKey } = supabaseConfig;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Erro: Variáveis de ambiente do Supabase não estão definidas');
    process.exit(1);
  }
  
  // Criar cliente com chave de serviço (admin)
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Dados do usuário de teste
  const testUser = {
    email: 'admin@eimusic.co.mz',
    password: 'admin123',
    user_metadata: {
      name: 'Administrador',
      role: 'admin'
    }
  };
  
  try {
    console.log('Tentando criar usuário de teste...');
    console.log(`URL do Supabase: ${supabaseUrl}`);
    
    // Criar usuário
    const { data, error } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      email_confirm: true,
      user_metadata: testUser.user_metadata
    });
    
    if (error) {
      // Se o erro for porque o usuário já existe, tentar atualizar a senha
      if (error.message.includes('already exists')) {
        console.log(`Usuário ${testUser.email} já existe. Tentando atualizar a senha...`);
        
        // Obter o ID do usuário
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
        
        if (userError) {
          throw userError;
        }
        
        const user = userData.users.find(u => u.email === testUser.email);
        
        if (!user) {
          throw new Error(`Não foi possível encontrar o usuário ${testUser.email}`);
        }
        
        // Atualizar a senha
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          user.id,
          { password: testUser.password }
        );
        
        if (updateError) {
          throw updateError;
        }
        
        console.log('Senha atualizada com sucesso!');
        console.log(`- Email: ${testUser.email}`);
        console.log(`- Senha: ${testUser.password}`);
        console.log(`- ID: ${user.id}`);
      } else {
        throw error;
      }
    } else {
      console.log('Usuário de teste criado com sucesso:');
      console.log(`- Email: ${testUser.email}`);
      console.log(`- Senha: ${testUser.password}`);
      console.log(`- ID: ${data.user.id}`);
    }
  } catch (error) {
    console.error('Erro ao criar/atualizar usuário de teste:', error);
    process.exit(1);
  }
}

main(); 