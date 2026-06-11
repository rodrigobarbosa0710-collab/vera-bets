'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('playerName');
    if (stored) {
      router.push('/mercado');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsLoading(true);
    try {
      await fetch('/api/players/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName }),
      });

      localStorage.setItem('playerName', playerName);
      router.push('/mercado');
    } catch (error) {
      console.error('Erro:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative">
      {/* Efeito de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo Animado */}
        <div className="text-center mb-12 animate-bounce">
          <div className="text-8xl mb-4 drop-shadow-2xl">⚽</div>
          <h1 className="text-6xl font-black text-white mb-2 tracking-tighter drop-shadow-lg">
            VERA BETS
          </h1>
          <p className="text-2xl text-blue-400 font-bold drop-shadow-lg">Copa do Mundo 2026</p>
        </div>

        {/* Card Principal */}
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-gradient-to-r from-blue-500 to-purple-500 p-8 shadow-2xl backdrop-blur-xl">
            {/* Descrição */}
            <div className="text-center mb-8">
              <p className="text-slate-300 text-lg mb-4">
                🎯 Seu bolão de futebol online • 💰 Prêmios em disputa • 🏆 Compete com amigos
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-3">DIGITE SEU NOME</label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-slate-700 border-2 border-slate-600 focus:border-blue-500 text-white placeholder-slate-400 px-6 py-3 rounded-lg font-bold text-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !playerName.trim()}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-slate-600 disabled:to-slate-700 disabled:opacity-50 text-white font-black py-4 rounded-lg text-xl transition shadow-xl transform hover:scale-105 active:scale-95"
              >
                {isLoading ? '⏳ ENTRANDO...' : '🎮 ENTRAR NO BOLÃO'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-400">OU</span>
              </div>
            </div>

            {/* Demo Button */}
            <button
              onClick={() => {
                const demoName = `Demo_${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('playerName', demoName);
                fetch('/api/players/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ playerName: demoName }),
                });
                router.push('/mercado');
              }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition"
            >
              🎪 Teste Sem Login
            </button>
          </div>

          {/* Informações */}
          <div className="mt-8 text-center text-slate-400 text-sm space-y-2">
            <p>✅ Sem necessidade de email</p>
            <p>✅ Faça palpites em 50+ jogos</p>
            <p>✅ Ranking em tempo real</p>
            <p>✅ Compartilhe com amigos</p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-16 text-center text-slate-400 text-xs">
          <p>⚽ Vera Bets © 2026 • Seu Bolão da Copa</p>
        </div>
      </div>
    </div>
  );
}
