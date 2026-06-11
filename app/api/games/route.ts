import { NextRequest, NextResponse } from 'next/server';
import * as data from '@/app/lib/data';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    games: data.games,
    bets: data.bets,
  });
}
