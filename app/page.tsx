'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('playerName');
    if (stored) {
      setIsLoggedIn(true);
      router.push('/bets');
    }
  }, [router]);

  const handleEnter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    try {
      await fetch('/api/players/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName }),
      });

      localStorage.setItem('playerName', playerName);
      router.push('/bets');
    } catch (error) {
      console.error('Erro ao registrar:', error);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-yellow-600 flex items-center justify-center">
        <p className="text-white text-2xl">Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-yellow-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">⚽</h1>
          <h2 className="text-4xl font-bold mb-2">Vera Bets</h2>
          <p className="text-gray-600">Copa do Mundo 2026</p>
        </div>

        <form onSubmit={handleEnter}>
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Seu Nome:
          </label>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg transition"
          >
            Entrar no Bolão
          </button>
        </form>

        <button
          onClick={() => {
            localStorage.removeItem('playerName');
            setPlayerName('');
            setIsLoggedIn(false);
          }}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 text-sm"
        >
          Trocar de jogador
        </button>
      </div>
    </div>
  );
}
