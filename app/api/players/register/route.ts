import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerName } = body;

    if (!playerName || playerName.trim() === '') {
      return NextResponse.json(
        { error: 'Nome do jogador é obrigatório' },
        { status: 400 }
      );
    }

    const { data: player, error } = await supabase
      .from('players')
      .upsert(
        {
          name: playerName,
          total_points: 0,
          paid_pix: false,
        },
        { onConflict: 'name' }
      )
      .select();

    if (error) {
      console.error('Erro ao registrar jogador:', error);
      return NextResponse.json(
        { error: 'Erro ao registrar jogador: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, player: player?.[0] });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar jogador' },
      { status: 500 }
    );
  }
}
