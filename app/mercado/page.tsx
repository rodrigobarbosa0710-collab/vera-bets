'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GameCard from '@/app/components/GameCard';

interface Game {
  id: number;
  date: string;
  team1: string;
  team2: string;
  goals1?: number | null;
  goals2?: number | null;
  status: string;
  phase: string;
  odds1?: number;
  oddsDraw?: number;
  odds2?: number;
}

interface Bet {
  id: number;
  game_id: number;
  goals1: number;
  goals2: number;
  points: number;
}

export default function MercadoPage() {
  const [playerName, setPlayerName] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [selectedPhase, setSelectedPhase] = useState('Grupos - A');
  const [phases, setPhases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPoints: 0, totalBets: 0 });

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

      const uniquePhases = [...new Set((gamesData.games || []).map((g: Game) => g.phase))].sort();
      setPhases(uniquePhases as string[]);
      setSelectedPhase((uniquePhases[0] as string) || 'Grupos - A');

      const name = localStorage.getItem('playerName');
      if (name) {
        const betsRes = await fetch(`/api/bets/player/${encodeURIComponent(name)}`);
        if (betsRes.ok) {
          const betsData = await betsRes.json();
          setBets(betsData.bets || []);

          const totalPoints = (betsData.bets || []).reduce(
            (sum: number, b: Bet) => sum + (b.points || 0),
            0
          );
          setStats({ totalPoints, totalBets: betsData.bets?.length || 0 });
        }
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBet = async (gameId: number, goals1: number, goals2: number) => {
    try {
      const response = await fetch('/api/bets/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, playerName, goals1, goals2 }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">⚽</div>
          <p className="text-white text-2xl">Carregando mercado...</p>
        </div>
      </div>
    );
  }

  const filteredGames = games.filter((g) => g.phase === selectedPhase);
  const playerBets = bets.reduce((acc, b) => {
    acc[b.game_id] = b;
    return acc;
  }, {} as Record<number, Bet>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header Sticky */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">⚽</div>
              <div>
                <h1 className="text-white text-2xl font-black">VERA BETS</h1>
                <p className="text-blue-400 text-xs">Copa do Mundo 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Stats */}
              <div className="hidden md:flex gap-6">
                <div className="bg-slate-700/50 rounded px-4 py-2 border border-slate-600">
                  <p className="text-slate-400 text-xs">SEUS PONTOS</p>
                  <p className="text-yellow-400 text-2xl font-bold">{stats.totalPoints}</p>
                </div>
                <div className="bg-slate-700/50 rounded px-4 py-2 border border-slate-600">
                  <p className="text-slate-400 text-xs">PALPITES</p>
                  <p className="text-blue-400 text-2xl font-bold">{stats.totalBets}</p>
                </div>
              </div>

              {/* Jogador */}
              <div className="text-right">
                <p className="text-slate-400 text-xs">JOGADOR</p>
                <p className="text-white font-bold">{playerName}</p>
              </div>

              {/* Menu */}
              <Link
                href="/ranking"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-2 rounded font-bold transition"
              >
                🏆 Ranking
              </Link>
            </div>
          </div>

          {/* Filtros de Fase */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {phases.map((phase) => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${
                  selectedPhase === phase
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600'
                }`}
              >
                {phase}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                playerBet={playerBets[game.id]}
                onBet={handleBet}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 text-xl">Nenhum jogo nesta fase</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12 py-6 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>⚽ Vera Bets © 2026 - Seu Bolão da Copa</p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/" className="hover:text-white transition">
              Início
            </Link>
            <Link href="/ranking" className="hover:text-white transition">
              Ranking
            </Link>
            <Link href="/pagamentos" className="hover:text-white transition">
              Pagamentos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
