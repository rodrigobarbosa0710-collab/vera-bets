'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Player {
  name: string;
  total_points: number;
  paid_pix: boolean;
}

interface RankingItem {
  position: number;
  name: string;
  points: number;
  paidPix: boolean;
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem('playerName');
    if (!name) {
      window.location.href = '/';
      return;
    }
    setPlayerName(name);
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const response = await fetch('/api/ranking');
      const data = await response.json();
      setRanking(data.ranking || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  const getColorClass = (position: number) => {
    if (position === 1)
      return 'from-yellow-600 to-yellow-700 border-yellow-500 shadow-yellow-500/20';
    if (position === 2) return 'from-slate-600 to-slate-700 border-slate-400 shadow-slate-400/20';
    if (position === 3)
      return 'from-orange-600 to-orange-700 border-orange-500 shadow-orange-500/20';
    return 'from-slate-700 to-slate-800 border-slate-600 shadow-slate-600/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4 text-4xl">⚽</div>
          <p className="text-white text-2xl">Carregando ranking...</p>
        </div>
      </div>
    );
  }

  const playerPosition = ranking.findIndex((p) => p.name === playerName) + 1 || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🏆</div>
              <div>
                <h1 className="text-white text-3xl font-black">RANKING</h1>
                <p className="text-purple-400 text-sm">Copa do Mundo 2026</p>
              </div>
            </div>

            <Link
              href="/mercado"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-bold transition"
            >
              ← Voltar ao Mercado
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Top 3 - Destaques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {ranking.slice(0, 3).map((player, idx) => (
            <div
              key={player.name}
              className={`bg-gradient-to-br ${getColorClass(
                player.position
              )} rounded-xl border-2 p-6 shadow-2xl transform ${
                idx === 0 ? 'md:scale-110 md:row-span-2' : ''
              } transition hover:shadow-2xl`}
            >
              <div className="text-5xl text-center mb-3">{getMedalEmoji(player.position)}</div>
              <h2 className="text-white text-xl font-bold text-center mb-2">{player.name}</h2>
              <div className="bg-black/30 rounded px-4 py-3 text-center">
                <p className="text-white/70 text-xs">PONTOS</p>
                <p className="text-white text-4xl font-black">{player.points}</p>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4">
                {player.paidPix ? (
                  <span className="text-green-300 text-sm font-bold">✓ Pago</span>
                ) : (
                  <span className="text-yellow-300 text-sm font-bold">⏳ Pendente</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tabela Completa */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-slate-600">
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">POS.</th>
                  <th className="px-6 py-4 text-left text-white font-bold text-sm">JOGADOR</th>
                  <th className="px-6 py-4 text-center text-white font-bold text-sm">PONTOS</th>
                  <th className="px-6 py-4 text-center text-white font-bold text-sm">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((player, index) => {
                  const isCurrentPlayer = player.name === playerName;
                  return (
                    <tr
                      key={player.name}
                      className={`border-b border-slate-700 transition hover:bg-slate-700/30 ${
                        isCurrentPlayer ? 'bg-blue-900/30' : index % 2 === 0 ? 'bg-slate-800/50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-lg w-6 text-center">
                            {getMedalEmoji(player.position)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p
                              className={`font-bold ${
                                isCurrentPlayer ? 'text-blue-400' : 'text-white'
                              }`}
                            >
                              {player.name}
                              {isCurrentPlayer && ' (Você)'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="bg-slate-700/50 rounded px-4 py-2 inline-block">
                          <p className="text-yellow-400 font-black text-xl">{player.points}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {player.paidPix ? (
                          <span className="bg-green-900/30 text-green-400 px-4 py-2 rounded-full text-sm font-bold border border-green-700/50">
                            ✓ Pago
                          </span>
                        ) : (
                          <span className="bg-yellow-900/30 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold border border-yellow-700/50">
                            ⏳ Pendente
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info do Jogador */}
        {playerPosition > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6 text-center">
            <p className="text-blue-300 mb-2">Você está em</p>
            <p className="text-5xl font-black text-white mb-2">{getMedalEmoji(playerPosition)}</p>
            <p className="text-2xl font-bold text-blue-300">
              {playerPosition}º lugar com {ranking[playerPosition - 1]?.points || 0} pontos
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12 py-6 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>⚽ Vera Bets © 2026</p>
        </div>
      </footer>
    </div>
  );
}
