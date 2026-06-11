import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/app/api/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { playerName: string } }
) {
  try {
    const playerName = decodeURIComponent(params.playerName);
    const bets = appStore.getPlayerBets(playerName);
    return NextResponse.json({ bets });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro ao buscar palpites' }, { status: 500 });
  }
}
