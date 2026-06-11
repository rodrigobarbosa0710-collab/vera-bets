import { NextRequest, NextResponse } from 'next/server';
import * as data from '@/app/lib/data';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { playerName } = body;

  try {
    data.registerPlayer(playerName);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to register player' }, { status: 400 });
  }
}
