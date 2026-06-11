# 🗄️ GUIA COMPLETO - Configurar Supabase para Vera Bets

## ✅ PASSO 1: Criar Conta no Supabase

1. Abra: **https://supabase.com**
2. Clique em **"Sign Up"** (canto superior direito)
3. **Escolha uma opção:**
   - ✅ **GitHub** (mais rápido!)
   - Ou email/senha
4. Confirme seu email

## ✅ PASSO 2: Criar Novo Projeto

1. Após fazer login, clique em **"New Project"**
2. Preencha:
   - **Organization**: deixe como está (ou crie uma nova)
   - **Project Name**: `vera-bets`
   - **Database Password**: gere uma senha (copie e guarde!)
   - **Region**: escolha a mais próxima do Brasil (São Paulo ou us-east-1)
3. Clique em **"Create New Project"**
4. **Aguarde** 2-3 minutos enquanto cria o banco

## ✅ PASSO 3: Copiar as Credenciais

Quando o projeto estiver pronto:

1. Vá para **Settings** (canto inferior esquerdo)
2. Clique em **API**
3. Você verá:
   - **Project URL**: algo como `https://abcdefgh.supabase.co`
   - **API Keys** com a chave `anon public`

**COPIE E GUARDE ESSES DOIS VALORES!**

```
URL: https://abcdefgh.supabase.co
CHAVE: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ✅ PASSO 4: Criar as Tabelas do Banco

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. **COPIE E COLE** este código completo:

```sql
-- Criar tabela de jogadores
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  total_points INT DEFAULT 0,
  paid_pix BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de jogos
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  date VARCHAR(10) NOT NULL,
  team1 VARCHAR(100) NOT NULL,
  team2 VARCHAR(100) NOT NULL,
  goals1 INT,
  goals2 INT,
  status VARCHAR(50) DEFAULT 'pending',
  phase VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de palpites
CREATE TABLE IF NOT EXISTS bets (
  id SERIAL PRIMARY KEY,
  game_id INT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_name VARCHAR(255) NOT NULL REFERENCES players(name) ON DELETE CASCADE,
  goals1 INT NOT NULL,
  goals2 INT NOT NULL,
  points INT DEFAULT 0,
  paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(game_id, player_name)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);
CREATE INDEX IF NOT EXISTS idx_games_date ON games(date);
CREATE INDEX IF NOT EXISTS idx_bets_game ON bets(game_id);
CREATE INDEX IF NOT EXISTS idx_bets_player ON bets(player_name);
```

4. Clique em **"Run"** (botão azul)
5. Aguarde a confirmação ✅

## ✅ PASSO 5: Criar Arquivo `.env.local`

Agora no seu computador:

1. Abra a pasta do projeto: `/Users/barbosarodd/vera-bets`
2. Crie um arquivo chamado: `.env.local`
3. **COLE** este conteúdo (substitua pelos seus valores):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE:**
- Substitua `https://abcdefgh.supabase.co` pelo seu Project URL
- Substitua a chave pela sua chave `anon public`
- **NUNCA** commita esse arquivo no Git!

## ✅ PASSO 6: Testar Localmente

1. Abra o terminal na pasta `vera-bets`
2. Execute:

```bash
npm install
npm run dev
```

3. Abra: **http://localhost:3000**
4. **Teste:**
   - Digite um nome
   - Clique em "Entrar no Bolão"
   - Veja se aparece a página de palpites

## ✅ PASSO 7: Fazer Deploy

O deploy automático já está configurado!

Quando fizer:

```bash
git add .env.local
git commit -m "Add Supabase credentials"
git push
```

O Vercel fará deploy automaticamente em **5-10 minutos**.

Seu site ao vivo em: https://vera-bets.vercel.app

---

## 🐛 Troubleshooting

### Erro: "Credenciais inválidas"
- ✅ Verifique se copiar certo o Project URL e a chave
- ✅ Remova espaços em branco do `.env.local`
- ✅ Reinicie o servidor local (Ctrl+C e `npm run dev` novamente)

### Erro: "Tabelas não encontradas"
- ✅ Verifique se o SQL rodou sem erros no Supabase
- ✅ Atualize a página do Supabase e veja se as tabelas aparecem em "Tables"

### Ninguém consegue acessar o site
- ✅ Verifique se o Vercel fez deploy (vá em vercel.com)
- ✅ Aguarde 10 minutos para o deploy terminar
- ✅ Limpe o cache (Ctrl+Shift+Del)

---

## 🎯 Próximo Passos

Após configurar:

1. ✅ Compartilhe o link: **https://vera-bets.vercel.app**
2. ✅ Defina o **valor do Pix** (editar em `app/pagamentos/page.tsx`)
3. ✅ **Convide o pessoal** do escritório!

---

**Sucesso! Divirta-se com o Vera Bets! ⚽🎉**
