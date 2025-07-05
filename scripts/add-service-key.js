#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.resolve(process.cwd(), '.env.local');

// Verificar se o arquivo .env.local existe
if (!fs.existsSync(envPath)) {
  console.error('Erro: Arquivo .env.local não encontrado.');
  console.error('Crie o arquivo .env.local primeiro.');
  process.exit(1);
}

console.log('Este script irá adicionar ou atualizar a chave SUPABASE_SERVICE_ROLE_KEY no seu arquivo .env.local');
console.log('Você pode encontrar esta chave no painel do Supabase em Project Settings > API');
console.log('');

rl.question('Digite a chave de serviço do Supabase (SUPABASE_SERVICE_ROLE_KEY): ', (serviceKey) => {
  if (!serviceKey.trim()) {
    console.error('Erro: A chave não pode estar vazia.');
    rl.close();
    process.exit(1);
  }

  try {
    // Ler o conteúdo atual do arquivo
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Verificar se a chave já existe no arquivo
    const keyRegex = /^SUPABASE_SERVICE_ROLE_KEY=.*/m;
    
    if (keyRegex.test(envContent)) {
      // Substituir a chave existente
      envContent = envContent.replace(keyRegex, `SUPABASE_SERVICE_ROLE_KEY=${serviceKey}`);
      console.log('Chave SUPABASE_SERVICE_ROLE_KEY atualizada com sucesso!');
    } else {
      // Adicionar a nova chave
      envContent += `\nSUPABASE_SERVICE_ROLE_KEY=${serviceKey}\n`;
      console.log('Chave SUPABASE_SERVICE_ROLE_KEY adicionada com sucesso!');
    }
    
    // Escrever de volta no arquivo
    fs.writeFileSync(envPath, envContent);
    
    console.log('\nAgora você pode reiniciar o servidor para aplicar as alterações.');
  } catch (error) {
    console.error('Erro ao atualizar o arquivo .env.local:', error);
  }
  
  rl.close();
}); 