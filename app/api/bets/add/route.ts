import { NextRequest, NextResponse } from 'next/server';
import * as data from '@/app/lib/data';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { gameId, playerName, goals1, goals2 } = body;

  try {
    data.addBet(gameId, playerName, goals1, goals2);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add bet' }, { status: 400 });
  }
}
