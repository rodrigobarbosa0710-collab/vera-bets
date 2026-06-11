import { Game, Bet, Player } from './types';

// Copa 2026 - Jogos principais (exemplo - você pode expandir)
export const INITIAL_GAMES: Game[] = [
  { id: '1', date: '2026-06-21', team1: 'Brasil', team2: 'Sérvia', status: 'pending' },
  { id: '2', date: '2026-06-21', team1: 'Canadá', team2: 'Bélgica', status: 'pending' },
  { id: '3', date: '2026-06-22', team1: 'Suíça', team2: 'Espanha', status: 'pending' },
  { id: '4', date: '2026-06-22', team1: 'Itália', team2: 'Paraguai', status: 'pending' },
  { id: '5', date: '2026-06-23', team1: 'França', team2: 'Dinamarca', status: 'pending' },
  { id: '6', date: '2026-06-23', team1: 'Holanda', team2: 'Senegal', status: 'pending' },
  { id: '7', date: '2026-06-24', team1: 'Portugal', team2: 'Uruguai', status: 'pending' },
  { id: '8', date: '2026-06-24', team1: 'Polônia', team2: 'Japão', status: 'pending' },
];

// Dados simulados
export let games: Game[] = JSON.parse(JSON.stringify(INITIAL_GAMES));
export let bets: Bet[] = [];
export let players: Map<string, Player> = new Map();

export function addBet(gameId: string, playerName: string, goals1: number, goals2: number) {
  const game = games.find(g => g.id === gameId);
  if (!game) throw new Error('Game not found');

  const existingBetIndex = bets.findIndex(b => b.gameId === gameId && b.playerName === playerName);
  let points = 0;

  if (game.result && game.result.goals1 === goals1 && game.result.goals2 === goals2) {
    points = 5;
  }

  const newBet: Bet = {
    id: `${gameId}-${playerName}-${Date.now()}`,
    gameId,
    playerName,
    goals1,
    goals2,
    points,
  };

  if (existingBetIndex >= 0) {
    bets[existingBetIndex] = newBet;
  } else {
    bets.push(newBet);
  }

  updatePlayerPoints(playerName);
}

function updatePlayerPoints(playerName: string) {
  const playerBets = bets.filter(b => b.playerName === playerName);
  const totalPoints = playerBets.reduce((sum, b) => sum + b.points, 0);

  const player = players.get(playerName) || { name: playerName, totalPoints: 0, paidPix: false };
  player.totalPoints = totalPoints;
  players.set(playerName, player);
}

export function getPlayerBets(playerName: string) {
  return bets.filter(b => b.playerName === playerName);
}

export function getRanking() {
  const ranking = Array.from(players.values())
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((player, index) => ({
      position: index + 1,
      name: player.name,
      points: player.totalPoints,
      paidPix: player.paidPix,
    }));
  return ranking;
}

export function setGameResult(gameId: string, goals1: number, goals2: number) {
  const game = games.find(g => g.id === gameId);
  if (!game) throw new Error('Game not found');

  game.result = { goals1, goals2 };
  game.status = 'finished';

  // Atualizar pontos de todos que fizeram palpites neste jogo
  const gameBets = bets.filter(b => b.gameId === gameId);
  gameBets.forEach(bet => {
    if (goals1 === bet.goals1 && goals2 === bet.goals2) {
      bet.points = 5;
    } else {
      bet.points = 0;
    }
    updatePlayerPoints(bet.playerName);
  });
}

export function togglePlayerPayment(playerName: string) {
  const player = players.get(playerName);
  if (player) {
    player.paidPix = !player.paidPix;
    players.set(playerName, player);
  }
}

export function registerPlayer(playerName: string) {
  if (!players.has(playerName)) {
    players.set(playerName, {
      name: playerName,
      totalPoints: 0,
      paidPix: false,
    });
  }
}
