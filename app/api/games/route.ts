import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { COPA_2026_GAMES } from '@/lib/copa-2026';

export async function GET(request: NextRequest) {
  try {
    // Verificar se há jogos no banco
    const { data: existingGames, count } = await supabase
      .from('games')
      .select('*', { count: 'exact' });

    // Se não há jogos, popular com os dados da Copa 2026
    if (count === 0) {
      const { data: insertedGames, error: insertError } = await supabase
        .from('games')
        .insert(COPA_2026_GAMES)
        .select();

      if (insertError) {
        return NextResponse.json(
          { error: 'Erro ao carregar jogos: ' + insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ games: insertedGames || [] });
    }

    return NextResponse.json({ games: existingGames || [] });
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar jogos' },
      { status: 500 }
    );
  }
}
