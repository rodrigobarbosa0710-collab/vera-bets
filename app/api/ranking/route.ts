import { NextRequest, NextResponse } from 'next/server';
import * as data from '@/app/lib/data';

export async function GET(request: NextRequest) {
  const ranking = data.getRanking();
  return NextResponse.json({ ranking });
}
