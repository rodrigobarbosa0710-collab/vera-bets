import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/app/api/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerName } = body;

    if (!playerName?.trim()) {
      return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 });
    }

    appStore.registerPlayer(playerName);
    return NextResponse.json({
      success: true,
      player: appStore.players.get(playerName),
    });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro ao registrar' }, { status: 500 });
  }
}
