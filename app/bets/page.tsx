'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Game {
  id: number;
  date: string;
  team1: string;
  team2: string;
  goals1: number | null;
  goals2: number | null;
  status: string;
  phase: string;
}

interface Bet {
  id: number;
  game_id: number;
  player_name: string;
  goals1: number;
  goals2: number;
  points: number;
  paid: boolean;
}

export default function BetsPage() {
  const [playerName, setPlayerName] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [selectedPhase, setSelectedPhase] = useState('Grupos - A');
  const [phases, setPhases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem('playerName');
    if (!name) {
      window.location.href = '/';
      return;
    }
    setPlayerName(name);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const gamesRes = await fetch('/api/games');
      const gamesData = await gamesRes.json();
      setGames(gamesData.games || []);

      // Extrair fases únicas
      const uniquePhases = [...new Set((gamesData.games || []).map((g: Game) => g.phase))].sort();
      setPhases(uniquePhases as string[]);
      if (uniquePhases.length > 0) {
        setSelectedPhase(uniquePhases[0] as string);
      }

      // Buscar palpites
      const betsRes = await fetch(`/api/bets/player/${localStorage.getItem('playerName')}`);
      if (betsRes.ok) {
        const betsData = await betsRes.json();
        setBets(betsData.bets || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBetSubmit = async (gameId: number, goals1: number, goals2: number) => {
    try {
      const response = await fetch('/api/bets/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          playerName,
          goals1,
          goals2,
        }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Erro ao salvar palpite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-2xl text-gray-700">Carregando...</p>
      </div>
    );
  }

  const filteredGames = games.filter((g) => g.phase === selectedPhase);
  const playerBets = bets.reduce((acc, b) => {
    acc[b.game_id] = b;
    return acc;
  }, {} as Record<number, Bet>);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-green-600 to-yellow-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">⚽ Vera Bets</h1>
              <p className="text-green-100">Copa do Mundo 2026</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Jogador</p>
              <p className="text-2xl font-bold">{playerName}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex gap-4">
          <Link href="/" className="text-blue-600 font-semibold hover:text-blue-700">
            Início
          </Link>
          <Link href="/bets" className="text-blue-600 font-semibold hover:text-blue-700">
            Palpites
          </Link>
          <Link href="/ranking" className="text-blue-600 font-semibold hover:text-blue-700">
            Ranking
          </Link>
          <Link href="/pagamentos" className="text-blue-600 font-semibold hover:text-blue-700">
            Pagamentos
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Faça Seus Palpites</h2>

          <div className="flex gap-2 flex-wrap mb-6">
            {phases.map((phase) => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedPhase === phase
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
                }`}
              >
                {phase}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredGames.map((game) => {
            const bet = playerBets[game.id];
            const [goals1, setGoals1] = useState(bet?.goals1 || 0);
            const [goals2, setGoals2] = useState(bet?.goals2 || 0);

            return (
              <div key={game.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-lg font-bold">{game.team1}</span>
                  <span className="text-2xl font-bold text-gray-400">vs</span>
                  <span className="text-lg font-bold">{game.team2}</span>
                  <span className="ml-auto text-sm text-gray-500">
                    {new Date(game.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {game.status === 'finished' && game.goals1 !== null && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-sm">
                    <p className="font-semibold text-green-900">
                      Resultado: {game.team1} {game.goals1} x {game.goals2} {game.team2}
                    </p>
                    {bet && (
                      <p
                        className={`mt-1 font-bold ${
                          bet.points > 0 ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        Seu palpite: {bet.goals1} x {bet.goals2} | Pontos: {bet.points}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      {game.team1}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={goals1}
                      onChange={(e) => setGoals1(Number(e.target.value))}
                      disabled={game.status === 'finished'}
                      className="w-full border rounded px-3 py-2 text-center text-lg font-bold"
                    />
                  </div>
                  <div>
                    <p className="text-center text-gray-600 mb-2">Placar</p>
                    <p className="text-center text-xl font-bold text-gray-400">vs</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      {game.team2}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={goals2}
                      onChange={(e) => setGoals2(Number(e.target.value))}
                      disabled={game.status === 'finished'}
                      className="w-full border rounded px-3 py-2 text-center text-lg font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleBetSubmit(game.id, goals1, goals2)}
                  disabled={game.status === 'finished'}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded font-semibold transition"
                >
                  {bet ? 'Atualizar Palpite' : 'Confirmar Palpite'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
