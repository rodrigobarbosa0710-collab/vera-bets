'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/app/lib/types';
import Link from 'next/link';

export default function PagamentosPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [pixKey, setPixKey] = useState('chave-pix@ejemplo.com');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const response = await fetch('/api/players/list');
    const data = await response.json();
    setPlayers(data.players);
    setLoading(false);
  };

  const togglePayment = async (playerName: string) => {
    const response = await fetch('/api/players/toggle-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName }),
    });

    if (response.ok) {
      fetchPlayers();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-2xl text-gray-700">Carregando...</p>
      </div>
    );
  }

  const paid = players.filter(p => p.paidPix);
  const pending = players.filter(p => !p.paidPix);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-yellow-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold">💰 Pagamentos</h1>
          <p className="text-green-100">Copa do Mundo 2026</p>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex gap-4">
            <Link href="/" className="text-blue-600 font-semibold hover:text-blue-700">
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
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Dados Pix */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Dados para Transferência</h2>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6">
            <p className="text-gray-700 mb-2">
              <span className="font-bold">Chave Pix:</span> {pixKey}
            </p>
            <p className="text-gray-600 text-sm">
              (Edite esse valor no arquivo de configuração do site)
            </p>
          </div>
        </div>

        {/* Status dos Pagamentos */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 rounded-lg shadow p-4 border-l-4 border-green-600">
            <p className="text-sm text-gray-600">Pagamentos Confirmados</p>
            <p className="text-3xl font-bold text-green-600">{paid.length}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4 border-l-4 border-red-600">
            <p className="text-sm text-gray-600">Pendente</p>
            <p className="text-3xl font-bold text-red-600">{pending.length}</p>
          </div>
        </div>

        {/* Jogadores que Pagaram */}
        {paid.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-green-700 flex items-center">
              ✓ Pagamentos Confirmados ({paid.length})
            </h3>
            <div className="space-y-2">
              {paid.map(player => (
                <div key={player.name} className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="font-semibold text-gray-700">{player.name}</span>
                  <button
                    onClick={() => togglePayment(player.name)}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Desmarcar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jogadores Pendentes */}
        {pending.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-red-700 flex items-center">
              ⏳ Aguardando Pagamento ({pending.length})
            </h3>
            <div className="space-y-2">
              {pending.map(player => (
                <div key={player.name} className="flex justify-between items-center p-3 bg-red-50 rounded">
                  <span className="font-semibold text-gray-700">{player.name}</span>
                  <button
                    onClick={() => togglePayment(player.name)}
                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Confirmar Pagamento
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {players.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum jogador registrado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
