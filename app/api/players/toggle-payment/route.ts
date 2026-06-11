import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerName } = body;

    if (!playerName) {
      return NextResponse.json(
        { error: 'Nome do jogador é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar o status atual
    const { data: player, error: fetchError } = await supabase
      .from('players')
      .select('paid_pix')
      .eq('name', playerName)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Jogador não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar para o oposto
    const { data: updatedPlayer, error: updateError } = await supabase
      .from('players')
      .update({ paid_pix: !player.paid_pix })
      .eq('name', playerName)
      .select();

    if (updateError) {
      return NextResponse.json(
        { error: 'Erro ao atualizar status: ' + updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, player: updatedPlayer?.[0] });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pagamento' },
      { status: 500 }
    );
  }
}
