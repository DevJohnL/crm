# CRM Varejo

CRM simples com Kanban para organizar a prospecção das empresas de varejo
(tabela `empresas_varejo` no Supabase). React 18 + Vite, sem backend próprio —
o front fala direto com o Supabase usando a chave `anon` (pública) + RLS.

## Rodar localmente
```bash
cd crm-app
npm install
npm run dev
```
Abre em http://localhost:5173

Requer o arquivo `.env` (já criado) com:
```
VITE_SUPABASE_URL=https://bjugdulowbhbhiqxrqos.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...   # chave anon public (Supabase > Settings > API)
```

## Como usar
1. **Buscar empresas** — pesquise por razão social / nome fantasia / município,
   filtre por UF e clique **+ Adicionar** para jogar a empresa no pipeline.
2. **Pipeline** — arraste os cards entre as colunas
   (Lead → Contatado → Negociando → Ganho → Perdido).
3. Clique num card para ver os contatos e escrever **anotações**, ou removê-lo.

## Deploy no Netlify
O `netlify.toml` já está configurado (base `crm-app`, publish `dist`, SPA redirect).

**Opção A — conectar o repositório (recomendado):**
1. Suba o projeto para o GitHub.
2. No Netlify: *Add new site → Import an existing project* → selecione o repo.
3. As configurações de build vêm do `netlify.toml`.
4. Em *Site settings → Environment variables*, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy.

**Opção B — deploy manual (drag & drop):**
```bash
npm run build
```
Arraste a pasta `crm-app/dist` para o Netlify (*Deploys → Drag and drop*).
(Neste modo as variáveis são embutidas no build local, então garanta o `.env` preenchido antes.)

## Segurança
- No front vai **somente** a chave `anon` (pública por design). A `service_role`
  e a senha do Postgres **nunca** são usadas aqui.
- O acesso é **público** (sem login): quem tiver a URL vê e edita os dados.
  Para restringir depois, habilite Supabase Auth e ajuste as policies de RLS.
