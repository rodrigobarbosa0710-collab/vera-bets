import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/app/api/store';

export async function GET(request: NextRequest) {
  try {
    const players = appStore.getAllPlayers();
    return NextResponse.json({ players });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro ao buscar' }, { status: 500 });
  }
}
