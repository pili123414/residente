# Cadastro Municipal de Residentes

Sistema de cadastro de residentes para a Prefeitura Municipal de São José do Vale do Rio Preto.

## Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá para SQL Editor e execute o script SQL localizado em `supabase/schema.sql`
4. Vá para Project Settings > API e copie a URL e a chave anônima
5. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_TEMPO=true
```

## Configuração da Vercel

1. Faça login na [Vercel](https://vercel.com)
2. Importe o repositório do GitHub
3. Adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Clique em Deploy

## Desenvolvimento Local

```bash
npm install
npm run dev
```

## Funcionalidades

- Cadastro de moradores
- Relatórios e exportação de dados
- Autenticação de usuários
- Sincronização em tempo real entre dispositivos
