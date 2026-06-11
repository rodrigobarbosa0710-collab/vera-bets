import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/app/api/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, playerName, goals1, goals2 } = body;

    if (!gameId || !playerName || goals1 === undefined || goals2 === undefined) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    const bet = appStore.addBet(gameId, playerName, goals1, goals2);
    return NextResponse.json({ success: true, bet });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro ao processar palpite' }, { status: 500 });
  }
}
