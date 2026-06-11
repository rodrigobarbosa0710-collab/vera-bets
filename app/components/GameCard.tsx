'use client';

import { useState } from 'react';

interface GameCardProps {
  game: {
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
  };
  playerBet?: {
    goals1: number;
    goals2: number;
    points: number;
  };
  onBet: (gameId: number, goals1: number, goals2: number) => void;
}

export default function GameCard({ game, playerBet, onBet }: GameCardProps) {
  const [goals1, setGoals1] = useState(playerBet?.goals1 || 0);
  const [goals2, setGoals2] = useState(playerBet?.goals2 || 0);
  const [showBetModal, setShowBetModal] = useState(false);

  const isFinished = game.status === 'finished';
  const dateObj = new Date(game.date + 'T12:00:00');
  const timeStr = dateObj.toLocaleDateString('pt-BR', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 hover:border-blue-500 transition overflow-hidden shadow-lg hover:shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2">
          <div className="flex justify-between items-center text-white text-xs">
            <span className="font-bold">{game.phase}</span>
            <span className="text-blue-200">{timeStr}</span>
          </div>
        </div>

        {/* Resultado/Status */}
        {isFinished && game.goals1 !== null && (
          <div className="bg-green-900/20 border-b border-green-700/30 px-4 py-2">
            <p className="text-green-400 text-sm font-semibold text-center">
              ✓ Resultado: {game.team1} {game.goals1} x {game.goals2} {game.team2}
            </p>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className="p-4">
          {/* Times e Placar */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Time 1 */}
            <div className="text-center">
              <p className="text-white font-bold text-sm mb-2">{game.team1}</p>
              {!isFinished ? (
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={goals1}
                  onChange={(e) => setGoals1(Number(e.target.value))}
                  className="w-full bg-slate-700 text-white text-center text-2xl font-bold py-2 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <div className="text-3xl font-bold text-yellow-400">{game.goals1}</div>
              )}
            </div>

            {/* Separador */}
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-500">-</span>
            </div>

            {/* Time 2 */}
            <div className="text-center">
              <p className="text-white font-bold text-sm mb-2">{game.team2}</p>
              {!isFinished ? (
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={goals2}
                  onChange={(e) => setGoals2(Number(e.target.value))}
                  className="w-full bg-slate-700 text-white text-center text-2xl font-bold py-2 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <div className="text-3xl font-bold text-yellow-400">{game.goals2}</div>
              )}
            </div>
          </div>

          {/* Seu Palpite (se existe) */}
          {playerBet && !isFinished && (
            <div className="bg-blue-900/30 border border-blue-700/30 rounded px-3 py-2 mb-4 text-center">
              <p className="text-blue-300 text-xs">Seu palpite atual</p>
              <p className="text-blue-200 font-bold">
                {playerBet.goals1} x {playerBet.goals2}
              </p>
            </div>
          )}

          {playerBet && isFinished && (
            <div
              className={`border rounded px-3 py-2 mb-4 text-center ${
                playerBet.points > 0
                  ? 'bg-green-900/30 border-green-700/30'
                  : 'bg-red-900/30 border-red-700/30'
              }`}
            >
              <p className="text-xs opacity-75">Seu Palpite</p>
              <p className="font-bold">
                {playerBet.goals1} x {playerBet.goals2}
              </p>
              <p className={`text-sm font-bold ${playerBet.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {playerBet.points > 0 ? `+${playerBet.points} pts` : 'Errado'}
              </p>
            </div>
          )}

          {/* Odds */}
          {!isFinished && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button className="bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-slate-600 rounded p-2 transition">
                <p className="text-white text-xs opacity-70">Vitória</p>
                <p className="text-blue-400 font-bold text-lg">{game.odds1?.toFixed(2) || '1.50'}</p>
              </button>
              <button className="bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-slate-600 rounded p-2 transition">
                <p className="text-white text-xs opacity-70">Empate</p>
                <p className="text-yellow-400 font-bold text-lg">{game.oddsDraw?.toFixed(2) || '3.00'}</p>
              </button>
              <button className="bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-slate-600 rounded p-2 transition">
                <p className="text-white text-xs opacity-70">Derrota</p>
                <p className="text-red-400 font-bold text-lg">{game.odds2?.toFixed(2) || '1.50'}</p>
              </button>
            </div>
          )}

          {/* Botão */}
          {!isFinished ? (
            <button
              onClick={() => onBet(game.id, goals1, goals2)}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 rounded transition shadow-lg"
            >
              💰 Confirmar Palpite
            </button>
          ) : (
            <button disabled className="w-full bg-slate-700 text-slate-400 font-bold py-3 rounded opacity-50">
              Jogo Finalizado
            </button>
          )}
        </div>
      </div>
    </>
  );
}
