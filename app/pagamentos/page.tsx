'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Player {
  name: string;
  total_points: number;
  paid_pix: boolean;
}

export default function PagamentosPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [pixKey, setPixKey] = useState('SEU-PIX-AQUI@seudominio');

  useEffect(() => {
    const name = localStorage.getItem('playerName');
    if (!name) {
      window.location.href = '/';
      return;
    }
    setPlayerName(name);
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players/list');
      const data = await response.json();
      setPlayers(data.players || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePayment = async (name: string) => {
    try {
      await fetch('/api/players/toggle-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: name }),
      });
      fetchPlayers();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4 text-4xl">💰</div>
          <p className="text-white text-2xl">Carregando pagamentos...</p>
        </div>
      </div>
    );
  }

  const paid = players.filter((p) => p.paid_pix);
  const pending = players.filter((p) => !p.paid_pix);
  const totalValue = pending.length > 0 ? pending.length * 10 : 0; // R$ 10 por pessoa

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 shadow-2xl">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-4xl">💰</div>
              <div>
                <h1 className="text-white text-3xl font-black">PAGAMENTOS</h1>
                <p className="text-green-400 text-sm">Controle de Pix</p>
              </div>
            </div>

            <Link
              href="/mercado"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-bold transition"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Dados do Pix */}
        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-2 border-green-700/50 rounded-xl p-8 mb-8 shadow-xl">
          <h2 className="text-white text-2xl font-bold mb-4">📲 DADOS PARA TRANSFERÊNCIA</h2>
          <div className="bg-slate-900/50 rounded-lg p-6 border border-green-700/30">
            <p className="text-green-300 text-sm font-bold mb-2">PIX</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-white text-lg font-mono">{pixKey}</p>
              <button
                onClick={() => navigator.clipboard.writeText(pixKey)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold transition"
              >
                📋 Copiar
              </button>
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-xl border border-green-500/30">
            <p className="text-green-100 text-sm font-bold">PAGOS</p>
            <p className="text-4xl font-black text-white">{paid.length}</p>
            <p className="text-green-200 text-sm mt-2">✓ Confirmados</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 shadow-xl border border-yellow-500/30">
            <p className="text-yellow-100 text-sm font-bold">PENDENTES</p>
            <p className="text-4xl font-black text-white">{pending.length}</p>
            <p className="text-yellow-200 text-sm mt-2">⏳ Aguardando</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-xl border border-blue-500/30">
            <p className="text-blue-100 text-sm font-bold">TOTAL A RECEBER</p>
            <p className="text-4xl font-black text-white">R$ {totalValue}</p>
            <p className="text-blue-200 text-sm mt-2">R$ 10 por pessoa</p>
          </div>
        </div>

        {/* Pagos */}
        {paid.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-green-700/30 overflow-hidden shadow-xl mb-6">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <h3 className="text-white text-xl font-bold">✓ PAGAMENTOS CONFIRMADOS ({paid.length})</h3>
            </div>
            <div className="p-6 space-y-3">
              {paid.map((player) => (
                <div
                  key={player.name}
                  className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-green-900/30 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-bold">{player.name}</p>
                      <p className="text-green-400 text-sm">Pagamento confirmado</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePayment(player.name)}
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-4 py-2 rounded font-bold transition text-sm border border-red-700/50"
                  >
                    Desmarcar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pendentes */}
        {pending.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-yellow-700/30 overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-6 py-4">
              <h3 className="text-white text-xl font-bold">⏳ AGUARDANDO PAGAMENTO ({pending.length})</h3>
            </div>
            <div className="p-6 space-y-3">
              {pending.map((player) => (
                <div
                  key={player.name}
                  className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-yellow-900/30 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-bold">{player.name}</p>
                      <p className="text-yellow-400 text-sm">R$ 10,00 pendente</p>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePayment(player.name)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold transition text-sm"
                  >
                    ✓ Confirmar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {players.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-xl">Nenhum jogador registrado ainda</p>
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
