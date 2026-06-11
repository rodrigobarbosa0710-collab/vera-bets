import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/app/api/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerName } = body;

    if (!playerName) {
      return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 });
    }

    appStore.togglePlayerPayment(playerName);
    return NextResponse.json({
      success: true,
      player: appStore.players.get(playerName),
    });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}
