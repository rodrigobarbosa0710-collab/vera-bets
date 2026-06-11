import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { playerName: string } }
) {
  try {
    const playerName = params.playerName;

    if (!playerName) {
      return NextResponse.json(
        { error: 'Nome do jogador é obrigatório' },
        { status: 400 }
      );
    }

    const { data: bets, error } = await supabase
      .from('bets')
      .select('*')
      .eq('player_name', decodeURIComponent(playerName));

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao buscar palpites: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ bets: bets || [] });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar palpites' },
      { status: 500 }
    );
  }
}
