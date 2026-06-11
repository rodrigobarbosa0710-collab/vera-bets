# 🗄️ Configurar Banco de Dados (Supabase)

## Passo 1: Criar conta no Supabase

1. Acesse: https://supabase.com
2. Clique em "Sign Up" 
3. Use sua conta GitHub para login rápido
4. Crie um novo projeto com nome "vera-bets"

## Passo 2: Copiar as credenciais

1. Após criar o projeto, vá para **Settings** → **API**
2. Copie:
   - **Project URL** (começa com https://...)
   - **anon public** (a chave API)

## Passo 3: Adicionar arquivo .env.local

Na pasta raiz do projeto (vera-bets/), crie um arquivo chamado `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-api-aqui
```

Substitua pelos valores copiados do Supabase.

## Passo 4: Criar as tabelas

Copie e cole no SQL Editor do Supabase:

```sql
-- Tabela de jogadores
CREATE TABLE players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  total_points INT DEFAULT 0,
  paid_pix BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de jogos
CREATE TABLE games (
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

-- Tabela de palpites
CREATE TABLE bets (
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

-- Índices para melhor performance
CREATE INDEX idx_players_name ON players(name);
CREATE INDEX idx_games_date ON games(date);
CREATE INDEX idx_bets_game ON bets(game_id);
CREATE INDEX idx_bets_player ON bets(player_name);
```

Depois de fazer isso, avise que está pronto!
