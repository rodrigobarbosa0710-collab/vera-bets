import { NextRequest, NextResponse } from 'next/server';
import * as data from '@/app/lib/data';

export async function GET(request: NextRequest) {
  const players = Array.from(data.players.values());
  return NextResponse.json({ players });
}
