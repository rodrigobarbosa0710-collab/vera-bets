import { createClient } from '@libsql/client';

// Usar banco de dados local para desenvolvimento
// Em produção, use Turso ou Supabase
export const db = createClient({
  url: process.env.DATABASE_URL || 'file:./vera-bets.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export async function initializeDatabase() {
  try {
    // Verificar se as tabelas já existem
    const result = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='games'"
    );

    if (result.rows.length === 0) {
      // Criar tabelas
      await db.execute(`
        CREATE TABLE IF NOT EXISTS players (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          total_points INTEGER DEFAULT 0,
          paid_pix BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS games (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          team1 TEXT NOT NULL,
          team2 TEXT NOT NULL,
          goals1 INTEGER,
          goals2 INTEGER,
          status TEXT DEFAULT 'pending',
          phase TEXT NOT NULL,
          odds1 REAL DEFAULT 1.5,
          oddsDraw REAL DEFAULT 3.0,
          odds2 REAL DEFAULT 1.5,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS bets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          game_id INTEGER NOT NULL,
          player_name TEXT NOT NULL,
          goals1 INTEGER NOT NULL,
          goals2 INTEGER NOT NULL,
          points INTEGER DEFAULT 0,
          paid BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (game_id) REFERENCES games(id),
          FOREIGN KEY (player_name) REFERENCES players(name),
          UNIQUE(game_id, player_name)
        )
      `);

      console.log('Tabelas criadas com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
  }
}
