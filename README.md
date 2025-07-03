# EI Music Admin

Painel administrativo para a plataforma EI Music, uma plataforma de distribuição e monetização de conteúdo audiovisual para Moçambique.

## Tecnologias

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Banco de dados)
- **Cloudinary** (Armazenamento de mídia)

## Requisitos

- Node.js 18.x ou superior
- npm 8.x ou superior

## Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/eimusic-admin.git
cd eimusic-admin
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse o painel em [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

- `app/` - Páginas e rotas da aplicação (Next.js App Router)
- `components/` - Componentes reutilizáveis
- `hooks/` - Hooks personalizados
- `lib/` - Bibliotecas e utilitários
- `services/` - Serviços para comunicação com APIs externas
- `types/` - Definições de tipos TypeScript
- `public/` - Arquivos estáticos

## Configuração do Banco de Dados

### Supabase

1. Crie uma conta no [Supabase](https://supabase.com/)
2. Crie um novo projeto
3. Obtenha as credenciais (URL e chaves) nas configurações do projeto
4. Configure as tabelas conforme a estrutura definida em `types/database.ts`

### Cloudinary

1. Crie uma conta no [Cloudinary](https://cloudinary.com/)
2. Obtenha as credenciais (cloud name, API key, API secret) no dashboard
3. Configure as variáveis de ambiente conforme descrito acima

## Desenvolvimento

### Comandos

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa a verificação de linting

### Integração com a Plataforma Principal

Este painel administrativo compartilha o mesmo banco de dados da aplicação principal EI Music. Todas as alterações feitas aqui afetarão diretamente a plataforma principal.

## Licença

Todos os direitos reservados.
