import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Game = {
  id?: number;
  date: string;
  team1: string;
  team2: string;
  goals1?: number | null;
  goals2?: number | null;
  status: 'pending' | 'finished';
  phase: string;
};

export type Bet = {
  id?: number;
  game_id: number;
  player_name: string;
  goals1: number;
  goals2: number;
  points: number;
  paid: boolean;
};

export type Player = {
  id?: number;
  name: string;
  total_points: number;
  paid_pix: boolean;
};
