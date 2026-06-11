import { NextRequest, NextResponse } from 'next/server';
import { appStore } from '@/app/api/store';

export async function GET(request: NextRequest) {
  try {
    const ranking = appStore.getRanking();
    return NextResponse.json({ ranking });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro ao buscar ranking' }, { status: 500 });
  }
}
