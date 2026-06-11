'use client';

import { useState, useEffect } from 'react';
import { Game, Bet } from '@/app/lib/types';

interface BetFormProps {
  game: Game;
  playerName: string;
  onSubmit: (gameId: string, goals1: number, goals2: number) => void;
  existingBet?: Bet;
}

export default function BetForm({ game, playerName, onSubmit, existingBet }: BetFormProps) {
  const [goals1, setGoals1] = useState(existingBet?.goals1 || 0);
  const [goals2, setGoals2] = useState(existingBet?.goals2 || 0);

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">{game.team1}</p>
          <input
            type="number"
            min="0"
            max="10"
            value={goals1}
            onChange={(e) => setGoals1(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 text-center text-lg font-bold"
          />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">{game.team2}</p>
          <input
            type="number"
            min="0"
            max="10"
            value={goals2}
            onChange={(e) => setGoals2(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 text-center text-lg font-bold"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSubmit(game.id, goals1, goals2)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
        >
          {existingBet ? 'Atualizar' : 'Confirmar'} Palpite
        </button>
      </div>

      {game.status === 'finished' && game.result && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-sm">
          <p className="font-semibold text-green-900">Resultado: {game.team1} {game.result.goals1} x {game.result.goals2} {game.team2}</p>
          {existingBet && (
            <p className={`mt-1 ${existingBet.points > 0 ? 'text-green-700 font-bold' : 'text-red-700'}`}>
              Pontos: {existingBet.points}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
