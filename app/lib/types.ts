export interface Game {
  id: string;
  date: string;
  team1: string;
  team2: string;
  result?: {
    goals1: number;
    goals2: number;
  };
  status: 'pending' | 'finished';
}

export interface Bet {
  id: string;
  gameId: string;
  playerName: string;
  goals1: number;
  goals2: number;
  points: number;
}

export interface Player {
  name: string;
  totalPoints: number;
  paidPix: boolean;
}

export interface Ranking {
  position: number;
  name: string;
  points: number;
  paidPix: boolean;
}
