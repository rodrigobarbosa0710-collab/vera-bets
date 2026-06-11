# ⚽ Vera Bets - Copa 2026

Sistema de bolão para a Copa do Mundo 2026. Compartilhe com seus amigos e colegas de trabalho!

🔗 **Link ao vivo**: https://vera-bets.vercel.app

---

## 🚀 Configuração Rápida

### 1. Criar conta no Supabase (GRATUITO)

1. Acesse https://supabase.com
2. Clique em "Sign Up" e crie conta com GitHub
3. Crie um novo projeto chamado "vera-bets"

### 2. Copiar Credenciais

No painel do Supabase:
1. Vá para **Settings** → **API**
2. Copie:
   - **Project URL** (começa com `https://...`)
   - **anon public** (a chave API)

### 3. Configurar Banco de Dados

No **SQL Editor** do Supabase, cole e execute o arquivo SETUP_BANCO_DE_DADOS.md

### 4. Criar arquivo `.env.local`

Na raiz do projeto, crie o arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-aqui
```

### 5. Fazer Deploy

```bash
git add .
git commit -m "Add Supabase configuration"
git push
```

O Vercel fará deploy automaticamente!

---

## 📊 Funcionalidades

✅ Registro de Jogadores
✅ 50+ Jogos da Copa (todas as fases)
✅ Sistema de Pontuação (5 pts/acerto)
✅ Ranking em Tempo Real
✅ Controle de Pagamentos
✅ Dados Persistentes (Banco de Dados)

---

**Divirta-se! ⚽🎉**
