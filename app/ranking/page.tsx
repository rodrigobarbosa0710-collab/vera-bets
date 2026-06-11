'use client';

import { useState, useEffect } from 'react';
import { Ranking } from '@/app/lib/types';
import Link from 'next/link';

export default function RankingPage() {
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    const response = await fetch('/api/ranking');
    const data = await response.json();
    setRanking(data.ranking);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-2xl text-gray-700">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-yellow-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold">🏆 Ranking</h1>
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
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Posição</th>
                  <th className="px-6 py-4 text-left font-bold">Jogador</th>
                  <th className="px-6 py-4 text-center font-bold">Pontos</th>
                  <th className="px-6 py-4 text-center font-bold">Status Pix</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((player, index) => (
                  <tr
                    key={player.name}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
                  >
                    <td className="px-6 py-4 font-bold text-lg">
                      {player.position === 1 && '🥇'}
                      {player.position === 2 && '🥈'}
                      {player.position === 3 && '🥉'}
                      {player.position > 3 && `#${player.position}`}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{player.name}</td>
                    <td className="px-6 py-4 text-center font-bold text-blue-600 text-lg">
                      {player.points}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {player.paidPix ? (
                        <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-semibold text-sm">
                          ✓ Pago
                        </span>
                      ) : (
                        <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full font-semibold text-sm">
                          Aguardando
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {ranking.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum jogador registrado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
