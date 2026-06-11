import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: players, error } = await supabase
      .from('players')
      .select('*')
      .order('total_points', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao buscar jogadores: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ players: players || [] });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar jogadores' },
      { status: 500 }
    );
  }
}
