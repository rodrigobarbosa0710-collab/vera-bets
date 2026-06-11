import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, playerName, goals1, goals2 } = body;

    if (!gameId || !playerName || goals1 === undefined || goals2 === undefined) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      );
    }

    // Buscar o jogo para verificar o resultado
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (gameError) {
      return NextResponse.json({ error: 'Jogo não encontrado' }, { status: 404 });
    }

    // Calcular pontos
    let points = 0;
    if (game.status === 'finished' && game.goals1 === goals1 && game.goals2 === goals2) {
      points = 5;
    }

    // Inserir ou atualizar palpite
    const { data: bet, error: betError } = await supabase
      .from('bets')
      .upsert(
        {
          game_id: gameId,
          player_name: playerName,
          goals1,
          goals2,
          points,
          paid: false,
        },
        { onConflict: 'game_id,player_name' }
      )
      .select();

    if (betError) {
      console.error('Erro ao salvar palpite:', betError);
      return NextResponse.json(
        { error: 'Erro ao salvar palpite: ' + betError.message },
        { status: 500 }
      );
    }

    // Atualizar total de pontos do jogador
    const { data: allBets } = await supabase
      .from('bets')
      .select('points')
      .eq('player_name', playerName);

    const totalPoints = (allBets || []).reduce((sum, b) => sum + (b.points || 0), 0);

    await supabase
      .from('players')
      .upsert(
        {
          name: playerName,
          total_points: totalPoints,
        },
        { onConflict: 'name' }
      );

    return NextResponse.json({ success: true, bet: bet?.[0] });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao processar palpite' },
      { status: 500 }
    );
  }
}
