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
        { error: 'Erro ao buscar ranking: ' + error.message },
        { status: 500 }
      );
    }

    const ranking = (players || []).map((player, index) => ({
      position: index + 1,
      name: player.name,
      points: player.total_points,
      paidPix: player.paid_pix,
    }));

    return NextResponse.json({ ranking });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ranking' },
      { status: 500 }
    );
  }
}
