import { NextRequest, NextResponse } from 'next/server';
import { COPA_2026_GAMES } from '@/lib/copa-2026';

// Em memória para simular banco de dados
let games: any[] = JSON.parse(JSON.stringify(COPA_2026_GAMES)).map((g: any, idx: number) => ({
  id: idx + 1,
  ...g,
}));

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ games });
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return NextResponse.json({ error: 'Erro ao buscar jogos' }, { status: 500 });
  }
}
